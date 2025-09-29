
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
    
    const body = await req.text();
    let requestData;
    
    try {
      requestData = JSON.parse(body);
    } catch (parseError) {
      logStep("Erro ao fazer parse do JSON", { error: parseError instanceof Error ? parseError.message : String(parseError), body: body.substring(0, 200) });
      return new Response(JSON.stringify({ error: "JSON inválido" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Verificar se é um teste
    if (requestData.test === true) {
      logStep("Modo de teste detectado - processando sem verificação de assinatura");
      
      // Simular processamento de teste
      return new Response(JSON.stringify({ 
        status: "success", 
        message: "Webhook de teste processado com sucesso",
        test: true
      }), { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Para webhooks reais do Stripe, verificar assinatura
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      logStep("STRIPE_WEBHOOK_SECRET não configurada");
      return new Response(JSON.stringify({ error: "Webhook secret não configurada" }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Obter a assinatura do webhook
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("Cabeçalho stripe-signature não encontrado - este pode ser um teste ou requisição inválida");
      return new Response(JSON.stringify({ 
        error: "Cabeçalho stripe-signature não encontrado",
        message: "Para testes, inclua 'test: true' no payload"
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Processar o evento real do Stripe
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
      logStep("Erro na verificação do evento", { error: err instanceof Error ? err.message : String(err) });
      return new Response(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`, { status: 400, headers: corsHeaders });
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

      // Obter o ID do usuário a partir do email
      const { data: userData, error: userError } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', customerEmail)
        .single();
      
      if (userError || !userData) {
        logStep("Erro ao buscar usuário pelo email", { error: userError?.message });
        return new Response(JSON.stringify({ 
          status: "error", 
          message: "Usuário não encontrado" 
        }), { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
      
      const userId = userData.id;

      // Atualizar o plano do usuário para 'pro' e marcar como precisando do onboarding
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ 
          plan: 'pro', 
          updated_at: new Date().toISOString(),
          agent_settings: { 
            onboarding_completed: false, // Marca que precisa completar onboarding
            checkout_completed: true,
            needs_onboarding: true
          }
        })
        .eq('id', userId);
      
      if (updateError) {
        logStep("Erro ao atualizar perfil do usuário", { error: updateError.message });
        return new Response(JSON.stringify({ 
          status: "error", 
          message: "Erro ao atualizar perfil", 
          details: updateError.message 
        }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      // Obter detalhes dos agentes disponíveis
      const { data: agentsData, error: agentsError } = await supabaseAdmin
        .from('agents')
        .select('type')
        .order('base_price');
        
      if (agentsError) {
        logStep("Erro ao buscar agentes", { error: agentsError.message });
        return new Response(JSON.stringify({ 
          status: "error", 
          message: "Erro ao buscar agentes", 
          details: agentsError.message 
        }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      // Ativar todos os agentes para o usuário (plano pro)
      const userAgents = agentsData.map(agent => ({
        user_id: userId,
        agent_type: agent.type,
        is_active: true
      }));

      const { error: insertError } = await supabaseAdmin
        .from('user_agents')
        .upsert(userAgents);
        
      if (insertError) {
        logStep("Erro ao ativar agentes para o usuário", { error: insertError.message });
        return new Response(JSON.stringify({ 
          status: "error", 
          message: "Erro ao ativar agentes", 
          details: insertError.message 
        }), { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }

      logStep("Perfil e agentes atualizados com sucesso - usuário será redirecionado para onboarding", { email: customerEmail, plan: 'pro' });
      return new Response(JSON.stringify({ 
        status: "success", 
        message: "Plano atualizado para pro, agentes ativados e onboarding necessário" 
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
    logStep("Erro no processamento do webhook", { error: error instanceof Error ? error.message : String(error) });
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
