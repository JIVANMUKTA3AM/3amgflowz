
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-SUBSCRIPTION-CHECKOUT] ${step}${detailsStr}`);
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

    const { planType, successUrl, cancelUrl } = await req.json();
    logStep("Request data", { planType, successUrl, cancelUrl });

    // Buscar informações do plano
    const { data: planData, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('plan_type', planType)
      .eq('is_active', true)
      .single();

    if (planError || !planData) {
      throw new Error(`Plan not found: ${planType}`);
    }

    if (!planData.stripe_price_id) {
      throw new Error(`Plan ${planType} does not have a Stripe price ID`);
    }

    logStep("Plan found", { plan: planData.name, priceId: planData.stripe_price_id });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Verificar se o cliente já existe no Stripe
    let customerId: string;
    const customers = await stripe.customers.list({ email: userData.user.email, limit: 1 });
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: userData.user.email,
        metadata: {
          user_id: userData.user.id,
        },
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: planData.stripe_price_id,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.get('origin')}/subscription?success=true`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/subscription?canceled=true`,
      metadata: {
        user_id: userData.user.id,
        plan_type: planType,
      },
      subscription_data: {
        metadata: {
          user_id: userData.user.id,
          plan_type: planType,
        },
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url 
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
