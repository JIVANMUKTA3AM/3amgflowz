import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AGENT-CHAT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Criar client do Supabase com chave de serviço
    const supabaseServiceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Autenticar usuário
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseServiceClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error(`Authentication error: ${userError?.message}`);
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id });

    const { message, agentConfigId, sessionId, channelType } = await req.json();
    
    if (!message || !agentConfigId) {
      throw new Error('Message and agentConfigId are required');
    }

    logStep("Request data", { message, agentConfigId, sessionId, channelType });

    // Buscar configuração do agente
    const { data: agentConfig, error: agentError } = await supabaseServiceClient
      .from('agent_configurations')
      .select('*')
      .eq('id', agentConfigId)
      .eq('user_id', user.id)
      .single();

    if (agentError || !agentConfig) {
      throw new Error(`Agent configuration not found: ${agentError?.message}`);
    }

    logStep("Agent config found", { name: agentConfig.name, model: agentConfig.model });

    // Preparar chamada para Google Gemini
    const startTime = Date.now();
    
    // Mapear modelo para o formato do Gemini (usar gemini-2.0-flash-exp como padrão)
    const geminiModel = agentConfig.model?.includes('gemini') 
      ? agentConfig.model 
      : 'gemini-2.0-flash-exp';
    
    const requestBody = {
      contents: [{
        parts: [{
          text: `${agentConfig.prompt}\n\nUsuário: ${message}`
        }]
      }],
      generationConfig: {
        temperature: agentConfig.temperature || 0.7,
        maxOutputTokens: agentConfig.max_tokens || 1000,
      }
    };

    logStep("Calling Gemini", { model: geminiModel });

    // Chamar Google Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.text();
      throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorData}`);
    }

    const geminiData = await geminiResponse.json();
    const responseTime = Date.now() - startTime;
    const agentResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    const tokensUsed = geminiData.usageMetadata?.totalTokenCount || 0;

    if (!agentResponse) {
      throw new Error('No response from Gemini');
    }

    logStep("Gemini response received", { responseTime, tokensUsed, responseLength: agentResponse.length });

    // Salvar conversa na base de dados
    const { error: saveError } = await supabaseServiceClient
      .from('agent_conversations')
      .insert({
        agent_configuration_id: agentConfigId,
        user_id: user.id,
        message: message,
        response: agentResponse,
        response_time_ms: responseTime,
        tokens_used: tokensUsed,
        model: agentConfig.model,
        session_id: sessionId || `session_${Date.now()}`,
        channel_type: channelType || 'chat'
      });

    if (saveError) {
      console.error('Error saving conversation:', saveError);
    }

    // Enviar webhook se configurado
    if (agentConfig.webhook_url) {
      try {
        await fetch(agentConfig.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agent_name: agentConfig.name,
            agent_type: agentConfig.agent_type,
            user_message: message,
            ai_response: agentResponse,
            response_time_ms: responseTime,
            tokens_used: tokensUsed,
            timestamp: new Date().toISOString(),
            session_id: sessionId,
            channel_type: channelType
          }),
        });
        logStep("Webhook sent successfully");
      } catch (webhookError) {
        logStep("Webhook error", { error: webhookError instanceof Error ? webhookError.message : String(webhookError) });
      }
    }

    logStep("Function completed successfully");

    return new Response(JSON.stringify({
      success: true,
      response: agentResponse,
      sessionId: sessionId || `session_${Date.now()}`,
      responseTime,
      tokensUsed
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      success: false,
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});