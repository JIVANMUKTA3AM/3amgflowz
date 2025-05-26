
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { priceId } = await req.json();
    logStep("Request parsed", { priceId });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer, will create during checkout");
    }

    // Configuração padrão de planos se não especificado
    const defaultPlans = {
      basic: {
        price_data: {
          currency: "brl",
          product_data: { 
            name: "Plano Basic",
            description: "1 agente ativo, 1.000 execuções/mês"
          },
          unit_amount: 2900, // R$ 29,00
          recurring: { interval: "month" },
        },
      },
      premium: {
        price_data: {
          currency: "brl",
          product_data: { 
            name: "Plano Premium",
            description: "5 agentes ativos, 10.000 execuções/mês"
          },
          unit_amount: 7900, // R$ 79,00
          recurring: { interval: "month" },
        },
      },
      enterprise: {
        price_data: {
          currency: "brl",
          product_data: { 
            name: "Plano Enterprise",
            description: "Agentes ilimitados, execuções ilimitadas"
          },
          unit_amount: 19900, // R$ 199,00
          recurring: { interval: "month" },
        },
      },
    };

    let lineItems;
    if (priceId && priceId.startsWith('price_')) {
      // Usar price ID específico do Stripe
      lineItems = [{ price: priceId, quantity: 1 }];
    } else {
      // Usar configuração padrão
      const planType = priceId || 'premium';
      const planConfig = defaultPlans[planType as keyof typeof defaultPlans] || defaultPlans.premium;
      lineItems = [{ ...planConfig, quantity: 1 }];
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/subscription?success=true`,
      cancel_url: `${req.headers.get("origin")}/subscription?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
