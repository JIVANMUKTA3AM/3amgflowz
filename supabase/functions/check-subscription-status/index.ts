
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
    
    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      // Garantir que existe um registro de assinatura gratuita
      await supabaseClient.from('subscriptions').upsert({
        user_id: userData.user.id,
        plan_type: 'free',
        status: 'active',
        cancel_at_period_end: false,
        price_amount: 0,
        price_currency: 'BRL',
      }, { onConflict: 'user_id' });
      
      return new Response(JSON.stringify({ 
        subscription: null,
        message: "No active subscription found" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Stripe customer found", { customerId });

    // Buscar assinaturas ativas no Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 10,
    });

    let activeSubscription = null;
    
    // Encontrar a assinatura mais recente
    for (const sub of subscriptions.data) {
      if (['active', 'past_due', 'unpaid'].includes(sub.status)) {
        activeSubscription = sub;
        break;
      }
    }

    if (!activeSubscription) {
      logStep("No active subscription found in Stripe");
      // Atualizar para plano gratuito
      await supabaseClient.from('subscriptions').upsert({
        user_id: userData.user.id,
        stripe_customer_id: customerId,
        plan_type: 'free',
        status: 'active',
        cancel_at_period_end: false,
        price_amount: 0,
        price_currency: 'BRL',
      }, { onConflict: 'user_id' });
      
      return new Response(JSON.stringify({ 
        subscription: null,
        message: "No active subscription found" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Active subscription found", { subscriptionId: activeSubscription.id, status: activeSubscription.status });

    // Determinar tipo de plano baseado no preço
    const priceId = activeSubscription.items.data[0].price.id;
    const price = await stripe.prices.retrieve(priceId);
    const amount = price.unit_amount || 0;
    
    let planType = 'free';
    if (amount <= 2900) planType = 'basic';
    else if (amount <= 7900) planType = 'premium';
    else if (amount > 7900) planType = 'enterprise';

    // Atualizar assinatura no Supabase
    const subscriptionData = {
      user_id: userData.user.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: activeSubscription.id,
      plan_type: planType as any,
      status: activeSubscription.status as any,
      current_period_start: new Date(activeSubscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(activeSubscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: activeSubscription.cancel_at_period_end,
      canceled_at: activeSubscription.canceled_at ? new Date(activeSubscription.canceled_at * 1000).toISOString() : null,
      price_amount: amount,
      price_currency: price.currency?.toUpperCase() || 'BRL',
    };

    const { data: updatedSub, error: updateError } = await supabaseClient
      .from('subscriptions')
      .upsert(subscriptionData, { onConflict: 'user_id' })
      .select()
      .single();

    if (updateError) {
      logStep("Error updating subscription", { error: updateError });
      throw updateError;
    }

    logStep("Subscription updated successfully", { planType, status: activeSubscription.status });

    return new Response(JSON.stringify({ 
      subscription: updatedSub,
      message: "Subscription status updated successfully" 
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
