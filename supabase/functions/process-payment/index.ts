
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Configuração de CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Lidar com solicitações preflight OPTIONS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Configuração do Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Configuração do Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    if (!stripeKey) {
      throw new Error("Chave do Stripe não configurada");
    }
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Obter dados da solicitação
    const { invoiceId, paymentMethod, returnUrl } = await req.json();
    console.log(`Processando pagamento para fatura ${invoiceId} via ${paymentMethod}`);

    // Buscar detalhes da fatura
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      console.error("Erro ao buscar fatura:", invoiceError);
      throw new Error("Fatura não encontrada");
    }

    // Verificar se a fatura já está paga
    if (invoice.status === "paid") {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Fatura já está paga", 
          paymentUrl: invoice.payment_url 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Configurar checkout de acordo com o método de pagamento
    let session;
    const amountInCents = invoice.amount; // Valor já está em centavos
    const baseUrl = req.headers.get("origin") || "http://localhost:3000";

    // Formatação para descrição no checkout
    const description = `${invoice.description} - Vencimento: ${new Date(invoice.due_date).toLocaleDateString('pt-BR')}`;

    if (paymentMethod === "pix" || paymentMethod === "boleto") {
      // Para Pix e Boleto, usamos o payment_intents
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "brl",
        payment_method_types: paymentMethod === "pix" ? ["pix"] : ["boleto"],
        description: description,
        metadata: {
          invoice_id: invoiceId,
        },
      });

      // Para Pix e Boleto, retornamos o clientSecret para o frontend criar o formulário
      return new Response(
        JSON.stringify({ 
          success: true, 
          clientSecret: paymentIntent.client_secret,
          intentId: paymentIntent.id
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // Para cartão de crédito e outros métodos, usamos o checkout
      session = await stripe.checkout.sessions.create({
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
        success_url: `${returnUrl || baseUrl}/pagamentos/sucesso?session_id={CHECKOUT_SESSION_ID}&invoice_id=${invoiceId}`,
        cancel_url: `${returnUrl || baseUrl}/pagamentos?canceled=true`,
        metadata: {
          invoice_id: invoiceId,
        },
      });

      // Atualizar URL de pagamento na fatura
      await supabase
        .from("invoices")
        .update({
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
    console.error("Erro ao processar pagamento:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
