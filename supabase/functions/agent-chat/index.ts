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
    
    const openAIKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIKey) {
      throw new Error('OPENAI_API_KEY is not configured');
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

    // Preparar chamada para OpenAI
    const startTime = Date.now();
    
    const requestBody = {
      model: agentConfig.model,
      messages: [
        { role: 'system', content: agentConfig.prompt },
        { role: 'user', content: message }
      ],
      temperature: agentConfig.temperature || 0.7,
      max_tokens: agentConfig.max_tokens || 1000,
    };

    logStep("Calling OpenAI", { model: agentConfig.model });

    // Chamar OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      throw new Error(`OpenAI API error: ${openAIResponse.status} - ${errorData}`);
    }

    const openAIData = await openAIResponse.json();
    const responseTime = Date.now() - startTime;
    const agentResponse = openAIData.choices[0]?.message?.content;
    const tokensUsed = openAIData.usage?.total_tokens || 0;

    if (!agentResponse) {
      throw new Error('No response from OpenAI');
    }

    logStep("OpenAI response received", { responseTime, tokensUsed, responseLength: agentResponse.length });

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