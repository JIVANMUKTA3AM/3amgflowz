
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CANCEL-SUBSCRIPTION] ${step}${detailsStr}`);
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
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const { subscriptionId, cancelAtPeriodEnd = true } = await req.json();
    logStep("Request data", { subscriptionId, cancelAtPeriodEnd });

    if (!subscriptionId) {
      throw new Error("Subscription ID is required");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Verificar se a assinatura pertence ao usuário
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', userData.user.id)
      .single();

    if (subError || !subscription) {
      throw new Error("Subscription not found or access denied");
    }

    let updatedSubscription;
    
    if (cancelAtPeriodEnd) {
      // Cancelar no final do período
      updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      logStep("Subscription set to cancel at period end");
    } else {
      // Reativar ou cancelar imediatamente
      if (subscription.cancel_at_period_end) {
        // Reativar assinatura
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false,
        });
        logStep("Subscription reactivated");
      } else {
        // Cancelar imediatamente
        updatedSubscription = await stripe.subscriptions.cancel(subscriptionId);
        logStep("Subscription canceled immediately");
      }
    }

    // Atualizar assinatura no Supabase
    const updateData: any = {
      cancel_at_period_end: updatedSubscription.cancel_at_period_end,
      status: updatedSubscription.status,
      updated_at: new Date().toISOString(),
    };

    if (updatedSubscription.canceled_at) {
      updateData.canceled_at = new Date(updatedSubscription.canceled_at * 1000).toISOString();
    }

    const { error: updateError } = await supabaseClient
      .from('subscriptions')
      .update(updateData)
      .eq('id', subscription.id);

    if (updateError) {
      logStep("Error updating subscription in database", { error: updateError });
      throw updateError;
    }

    logStep("Subscription updated successfully");

    return new Response(JSON.stringify({ 
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        cancel_at_period_end: updatedSubscription.cancel_at_period_end,
        canceled_at: updatedSubscription.canceled_at,
      }
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
