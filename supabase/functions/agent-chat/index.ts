
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agent_configuration_id, user_message, session_id } = await req.json();
    
    // Validar entrada
    if (!agent_configuration_id || !user_message || !session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Inicializar Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar configuração do agente
    const { data: config, error: configError } = await supabase
      .from('agent_configurations')
      .select('*')
      .eq('id', agent_configuration_id)
      .single();

    if (configError || !config) {
      return new Response(
        JSON.stringify({ error: 'Agent configuration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar histórico da conversa
    const { data: history } = await supabase
      .from('agent_conversations')
      .select('user_message, agent_response')
      .eq('agent_configuration_id', agent_configuration_id)
      .eq('session_id', session_id)
      .order('created_at')
      .limit(10);

    // Montar histórico para contexto
    const messages = [
      { role: 'system', content: config.prompt }
    ];

    // Adicionar histórico recente
    if (history) {
      history.forEach(conv => {
        messages.push({ role: 'user', content: conv.user_message });
        messages.push({ role: 'assistant', content: conv.agent_response });
      });
    }

    // Adicionar mensagem atual
    messages.push({ role: 'user', content: user_message });

    const startTime = Date.now();

    // Chamar OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        temperature: config.temperature,
        max_tokens: config.max_tokens,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to generate response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const agent_response = data.choices[0].message.content;
    const response_time_ms = Date.now() - startTime;
    const tokens_used = data.usage?.total_tokens || 0;

    // Salvar conversa
    const { error: saveError } = await supabase
      .from('agent_conversations')
      .insert({
        user_id: config.user_id,
        agent_configuration_id,
        session_id,
        user_message,
        agent_response,
        response_time_ms,
        tokens_used,
        model_used: config.model,
      });

    if (saveError) {
      console.error('Error saving conversation:', saveError);
    }

    // Atualizar métricas do dia
    const today = new Date().toISOString().split('T')[0];
    
    const { data: todayMetric } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('agent_configuration_id', agent_configuration_id)
      .eq('date', today)
      .single();

    if (todayMetric) {
      // Atualizar métrica existente
      const newTotal = todayMetric.total_conversations + 1;
      const newAvgTime = ((todayMetric.avg_response_time_ms || 0) * todayMetric.total_conversations + response_time_ms) / newTotal;
      
      await supabase
        .from('agent_metrics')
        .update({
          total_conversations: newTotal,
          avg_response_time_ms: newAvgTime,
          total_tokens_used: todayMetric.total_tokens_used + tokens_used,
        })
        .eq('id', todayMetric.id);
    } else {
      // Criar nova métrica
      await supabase
        .from('agent_metrics')
        .insert({
          agent_configuration_id,
          date: today,
          total_conversations: 1,
          avg_response_time_ms: response_time_ms,
          total_tokens_used: tokens_used,
        });
    }

    return new Response(
      JSON.stringify({ 
        agent_response,
        response_time_ms,
        tokens_used 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in agent-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
