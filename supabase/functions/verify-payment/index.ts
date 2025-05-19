
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
    const { invoiceId, sessionId, intentId } = await req.json();
    
    // Definir variáveis para resultados
    let isPaid = false;
    let paymentData = {};
    let paymentMethod = '';
    let paymentId = '';
    
    // Verificar tipo de pagamento (checkout session ou payment intent)
    if (sessionId) {
      // Verificar status da sessão do Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      isPaid = session.payment_status === 'paid';
      paymentData = session;
      paymentMethod = 'credit_card';
      paymentId = sessionId;
    } else if (intentId) {
      // Verificar status do payment intent
      const intent = await stripe.paymentIntents.retrieve(intentId);
      isPaid = intent.status === 'succeeded';
      paymentData = intent;
      
      // Determinar o método de pagamento baseado nos métodos disponíveis
      if (intent.payment_method_types.includes('pix')) {
        paymentMethod = 'pix';
      } else if (intent.payment_method_types.includes('boleto')) {
        paymentMethod = 'boleto';
      } else {
        paymentMethod = intent.payment_method_types[0] || 'unknown';
      }
      
      paymentId = intentId;
    } else {
      throw new Error("Informações de pagamento insuficientes");
    }

    // Se o pagamento foi bem-sucedido, atualizar o status da fatura
    if (isPaid) {
      const { data, error } = await supabase.rpc(
        'mark_invoice_as_paid',
        { 
          p_invoice_id: invoiceId,
          p_payment_method: paymentMethod,
          p_payment_id: paymentId,
          p_payment_data: paymentData
        }
      );

      if (error) {
        console.error("Erro ao atualizar fatura:", error);
        throw new Error("Falha ao atualizar o status da fatura");
      }
    }

    // Buscar fatura atualizada
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (invoiceError) {
      throw new Error("Falha ao buscar dados atualizados da fatura");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        isPaid, 
        invoice 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
