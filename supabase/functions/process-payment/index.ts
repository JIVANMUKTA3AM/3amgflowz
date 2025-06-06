
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Configuração de CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper para logs detalhados
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Lidar com solicitações preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Configuração do Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    logStep("Supabase client initialized");

    // Configuração do Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    if (!stripeKey) {
      throw new Error("Chave do Stripe não configurada");
    }
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    logStep("Stripe client initialized");

    // Autenticação do usuário
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Token de autorização não fornecido");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Usuário não autenticado");
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    // Obter dados da solicitação
    const { invoiceId, paymentMethod, returnUrl } = await req.json();
    logStep("Request data parsed", { invoiceId, paymentMethod });

    if (!invoiceId || !paymentMethod) {
      throw new Error("Dados de pagamento incompletos");
    }

    // Buscar detalhes da fatura
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single();

    if (invoiceError || !invoice) {
      logStep("Invoice not found", { invoiceError });
      throw new Error("Fatura não encontrada ou não pertence ao usuário");
    }

    logStep("Invoice found", { invoiceId: invoice.id, amount: invoice.amount, status: invoice.status });

    // Verificar se a fatura já está paga
    if (invoice.status === "paid") {
      logStep("Invoice already paid");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Fatura já está paga", 
          paymentUrl: invoice.payment_url 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verificar se a fatura está vencida
    const today = new Date();
    const dueDate = new Date(invoice.due_date);
    if (dueDate < today && invoice.status === 'pending') {
      await supabase
        .from("invoices")
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq("id", invoiceId);
      
      throw new Error("Fatura está vencida");
    }

    // Configurar valores para checkout
    const amountInCents = invoice.amount; // Valor já está em centavos
    const baseUrl = req.headers.get("origin") || "http://localhost:3000";
    const description = `${invoice.description} - Vencimento: ${new Date(invoice.due_date).toLocaleDateString('pt-BR')}`;

    logStep("Processing payment", { method: paymentMethod, amount: amountInCents });

    if (paymentMethod === "pix" || paymentMethod === "boleto") {
      // Para Pix e Boleto, usamos o payment_intents
      const paymentMethodTypes = paymentMethod === "pix" ? ["pix"] : ["boleto"];
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "brl",
        payment_method_types: paymentMethodTypes,
        description: description,
        metadata: {
          invoice_id: invoiceId,
          user_id: user.id,
        },
      });

      logStep("Payment intent created", { intentId: paymentIntent.id, method: paymentMethod });

      // Atualizar fatura com o intent ID
      await supabase
        .from("invoices")
        .update({
          payment_id: paymentIntent.id,
          payment_url: `${baseUrl}/pagamento-metodo?method=${paymentMethod}&invoice=${invoiceId}&clientSecret=${paymentIntent.client_secret}&intentId=${paymentIntent.id}`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);

      // Para Pix e Boleto, retornamos o clientSecret para o frontend
      return new Response(
        JSON.stringify({ 
          success: true, 
          clientSecret: paymentIntent.client_secret,
          intentId: paymentIntent.id,
          url: `${baseUrl}/pagamento-metodo?method=${paymentMethod}&invoice=${invoiceId}&clientSecret=${paymentIntent.client_secret}&intentId=${paymentIntent.id}`
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Para cartão de crédito, usamos o checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: invoice.description,
                description: `Vencimento: ${new Date(invoice.due_date).toLocaleDateString('pt-BR')}`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${returnUrl || baseUrl}/pagamentos?success=true&session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoiceId}`,
        cancel_url: `${returnUrl || baseUrl}/pagamentos?canceled=true`,
        metadata: {
          invoice_id: invoiceId,
          user_id: user.id,
        },
      });

      logStep("Checkout session created", { sessionId: session.id });

      // Atualizar URL de pagamento na fatura
      await supabase
        .from("invoices")
        .update({
          payment_id: session.id,
          payment_url: session.url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);

      return new Response(
        JSON.stringify({ success: true, url: session.url }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in process-payment", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
