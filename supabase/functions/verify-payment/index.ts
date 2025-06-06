
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
  console.log(`[VERIFY-PAYMENT] ${step}${detailsStr}`);
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

    // Obter dados da solicitação
    const { invoiceId, sessionId, intentId } = await req.json();
    logStep("Request data parsed", { invoiceId, sessionId, intentId });
    
    if (!invoiceId) {
      throw new Error("ID da fatura é obrigatório");
    }

    if (!sessionId && !intentId) {
      throw new Error("Session ID ou Intent ID é obrigatório");
    }

    // Definir variáveis para resultados
    let isPaid = false;
    let paymentData = {};
    let paymentMethod = '';
    let paymentId = '';
    
    // Verificar tipo de pagamento (checkout session ou payment intent)
    if (sessionId) {
      logStep("Verifying checkout session", { sessionId });
      // Verificar status da sessão do Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      isPaid = session.payment_status === 'paid';
      paymentData = {
        session_id: session.id,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        customer_email: session.customer_email,
      };
      paymentMethod = 'credit_card';
      paymentId = sessionId;
      
      logStep("Session verified", { isPaid, paymentStatus: session.payment_status });
    } else if (intentId) {
      logStep("Verifying payment intent", { intentId });
      // Verificar status do payment intent
      const intent = await stripe.paymentIntents.retrieve(intentId);
      isPaid = intent.status === 'succeeded';
      paymentData = {
        intent_id: intent.id,
        status: intent.status,
        amount: intent.amount,
        currency: intent.currency,
        payment_method_types: intent.payment_method_types,
      };
      
      // Determinar o método de pagamento baseado nos métodos disponíveis
      if (intent.payment_method_types.includes('pix')) {
        paymentMethod = 'pix';
      } else if (intent.payment_method_types.includes('boleto')) {
        paymentMethod = 'boleto';
      } else {
        paymentMethod = intent.payment_method_types[0] || 'unknown';
      }
      
      paymentId = intentId;
      
      logStep("Intent verified", { isPaid, status: intent.status, method: paymentMethod });
    }

    // Se o pagamento foi bem-sucedido, atualizar o status da fatura
    if (isPaid) {
      logStep("Payment successful, updating invoice");
      
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
        logStep("Error updating invoice", { error });
        throw new Error("Falha ao atualizar o status da fatura");
      }
      
      logStep("Invoice updated successfully");
    } else {
      logStep("Payment not completed yet");
    }

    // Buscar fatura atualizada
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (invoiceError) {
      logStep("Error fetching updated invoice", { invoiceError });
      throw new Error("Falha ao buscar dados atualizados da fatura");
    }

    logStep("Verification completed", { isPaid, invoiceStatus: invoice.status });

    return new Response(
      JSON.stringify({ 
        success: true, 
        isPaid, 
        invoice,
        paymentData: isPaid ? paymentData : null
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in verify-payment", { message: errorMessage });
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
