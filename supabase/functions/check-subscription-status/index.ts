
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION-STATUS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      throw new Error("User not authenticated");
    }

    logStep("User authenticated", { email: userData.user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Verificar se o cliente já existe no Stripe
    const customers = await stripe.customers.list({ email: userData.user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating subscription status to inactive");
      
      // Atualizar ou criar assinatura como inativa
      const { error: upsertError } = await supabaseClient
        .from('subscriptions')
        .upsert({
          user_id: userData.user.id,
          plan_type: 'free',
          status: 'canceled',
          stripe_customer_id: null,
          stripe_subscription_id: null,
          updated_at: new Date().toISOString(),
        }, { 
          onConflict: 'user_id'
        });

      if (upsertError) {
        logStep("Error updating subscription", { error: upsertError });
      }

      return new Response(JSON.stringify({ 
        subscribed: false,
        plan_type: 'free',
        status: 'canceled'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Buscar assinaturas ativas
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    const hasActiveSubscription = subscriptions.data.length > 0;
    let subscriptionData = null;

    if (hasActiveSubscription) {
      const subscription = subscriptions.data[0];
      subscriptionData = {
        stripe_subscription_id: subscription.id,
        plan_type: 'premium',
        status: 'active',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        price_amount: subscription.items.data[0].price.unit_amount,
        price_currency: subscription.items.data[0].price.currency,
      };
      
      logStep("Active subscription found", { subscriptionId: subscription.id });
    }

    // Atualizar dados da assinatura no Supabase
    const { error: upsertError } = await supabaseClient
      .from('subscriptions')
      .upsert({
        user_id: userData.user.id,
        stripe_customer_id: customerId,
        plan_type: hasActiveSubscription ? 'premium' : 'free',
        status: hasActiveSubscription ? 'active' : 'canceled',
        ...subscriptionData,
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'user_id'
      });

    if (upsertError) {
      logStep("Error updating subscription", { error: upsertError });
      throw new Error("Failed to update subscription status");
    }

    logStep("Subscription status updated successfully", { 
      subscribed: hasActiveSubscription,
      planType: hasActiveSubscription ? 'premium' : 'free'
    });

    return new Response(JSON.stringify({
      subscribed: hasActiveSubscription,
      plan_type: hasActiveSubscription ? 'premium' : 'free',
      status: hasActiveSubscription ? 'active' : 'canceled',
      ...subscriptionData,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
