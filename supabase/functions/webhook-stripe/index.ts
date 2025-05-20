
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Configuração de CORS para permitir requisições do webhook do Stripe
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Função para log detalhado (facilita depuração)
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[WEBHOOK-STRIPE] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Tratamento de requisição OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Recebendo webhook");
    
    // Obter a chave secreta do webhook
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET não configurada");
    }

    // Obter a assinatura do webhook
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Cabeçalho stripe-signature não encontrado");
    }

    // Processar o evento
    const body = await req.text();
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });
    
    // Construir e verificar o evento
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Evento verificado com sucesso", { type: event.type });
    } catch (err) {
      logStep("Erro na verificação do evento", { error: err.message });
      return new Response(`Webhook Error: ${err.message}`, { status: 400, headers: corsHeaders });
    }

    // Inicializar o cliente Supabase com a chave de serviço para poder escrever no banco
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Processar apenas eventos checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Verificar se o objeto da sessão contém um email do cliente
      const customerEmail = session.customer_email;
      if (!customerEmail) {
        logStep("Email do cliente não encontrado na sessão", { session_id: session.id });
        return new Response(JSON.stringify({ 
          status: "error", 
          message: "Email do cliente não encontrado" 
        }), { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      logStep("Processando pagamento confirmado", { email: customerEmail });

      // Atualizar o plano do usuário para 'pro'
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({ plan: 'pro', updated_at: new Date().toISOString() })
        .eq('id', (
          await supabaseAdmin
            .from('auth.users')
            .select('id')
            .eq('email', customerEmail)
            .single()
        ).data?.id);
      
      if (error) {
        logStep("Erro ao atualizar perfil do usuário", { error: error.message });
        return new Response(JSON.stringify({ 
          status: "error", 
          message: "Erro ao atualizar perfil", 
          details: error.message 
        }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      logStep("Perfil atualizado com sucesso", { email: customerEmail, plan: 'pro' });
      return new Response(JSON.stringify({ 
        status: "success", 
        message: "Plano atualizado para pro" 
      }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Para outros tipos de eventos, responder com um OK
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    logStep("Erro no processamento do webhook", { error: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
