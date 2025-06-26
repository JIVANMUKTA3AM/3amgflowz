
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

    logStep("User authenticated", { userId: userData.user.id, email: userData.user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Buscar cliente no Stripe
    const customers = await stripe.customers.list({ email: userData.user.email, limit: 1 });
    
    let subscriptionData = {
      plan_type: 'free' as const,
      status: 'active' as const,
      current_period_start: null as string | null,
      current_period_end: null as string | null,
      cancel_at_period_end: false,
      price_amount: 0,
      stripe_customer_id: null as string | null,
      stripe_subscription_id: null as string | null,
    };

    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      subscriptionData.stripe_customer_id = customerId;
      logStep("Found Stripe customer", { customerId });

      // Buscar assinaturas ativas
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        const price = subscription.items.data[0].price;
        
        // Determinar tipo do plano baseado no preço
        let planType: 'free' | 'basic' | 'premium' | 'enterprise' = 'free';
        const amount = price.unit_amount || 0;
        
        if (amount === 4900) planType = 'basic';
        else if (amount === 14900) planType = 'premium';
        else if (amount === 29900) planType = 'enterprise';

        subscriptionData = {
          plan_type: planType,
          status: subscription.status as any,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          price_amount: amount,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
        };

        logStep("Active subscription found", { subscriptionId: subscription.id, planType });
      }
    }

    // Atualizar ou criar registro na tabela subscriptions
    const { error: upsertError } = await supabaseClient
      .from('subscriptions')
      .upsert({
        user_id: userData.user.id,
        ...subscriptionData,
        updated_at: new Date().toISOString(),
      }, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      logStep("Error updating subscription", { error: upsertError });
      throw new Error("Failed to update subscription status");
    }

    logStep("Subscription status updated successfully", subscriptionData);

    return new Response(JSON.stringify({
      success: true,
      subscription: subscriptionData
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
