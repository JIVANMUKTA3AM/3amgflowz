
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatRequest {
  agent_configuration_id: string;
  user_message: string;
  session_id: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== AGENT CHAT REQUEST START ===');
    
    const requestData = await req.json();
    console.log('Request data received:', JSON.stringify(requestData, null, 2));
    
    const { agent_configuration_id, user_message, session_id }: ChatRequest = requestData;
    
    if (!agent_configuration_id || !user_message || !session_id) {
      console.error('Missing required parameters:', { agent_configuration_id, user_message, session_id });
      return new Response(
        JSON.stringify({ 
          error: 'Parâmetros obrigatórios ausentes',
          agent_response: "Erro: parâmetros obrigatórios não fornecidos.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ 
          error: 'Configuração do Supabase não encontrada',
          agent_response: "Erro de configuração do servidor.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized successfully');
    
    // Get agent configuration
    console.log('Fetching agent configuration for ID:', agent_configuration_id);
    const { data: agentConfig, error: configError } = await supabase
      .from('agent_configurations')
      .select('*')
      .eq('id', agent_configuration_id)
      .eq('is_active', true)
      .single();
    
    if (configError) {
      console.error('Error fetching agent config:', configError);
      return new Response(
        JSON.stringify({ 
          error: `Erro na configuração do agente: ${configError.message}`,
          agent_response: "Agente não encontrado ou inativo.",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!agentConfig) {
      console.error('Agent configuration not found');
      return new Response(
        JSON.stringify({ 
          error: 'Configuração do agente não encontrada',
          agent_response: "Agente não encontrado ou inativo.",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    console.log('Agent config found:', {
      name: agentConfig.name,
      model: agentConfig.model,
      temperature: agentConfig.temperature,
      max_tokens: agentConfig.max_tokens
    });
    
    const startTime = Date.now();
    
    // Determine which AI provider to use based on model
    let aiResponse;
    let tokensUsed = 0;
    
    try {
      console.log('Calling AI provider for model:', agentConfig.model);
      
      if (agentConfig.model.includes('gpt') || agentConfig.model.includes('o3') || agentConfig.model.includes('o4')) {
        console.log('Using OpenAI API');
        aiResponse = await callOpenAI(agentConfig, user_message);
        tokensUsed = aiResponse.usage?.total_tokens || 0;
      } else if (agentConfig.model.includes('claude') || agentConfig.model.includes('anthropic')) {
        console.log('Using Anthropic API');
        aiResponse = await callClaude(agentConfig, user_message);
        tokensUsed = (aiResponse.usage?.input_tokens || 0) + (aiResponse.usage?.output_tokens || 0);
      } else if (agentConfig.model.includes('gemini') || agentConfig.model.includes('google')) {
        console.log('Using Google API');
        aiResponse = await callGemini(agentConfig, user_message);
        tokensUsed = aiResponse.usage?.total_tokens || 0;
      } else {
        console.log('Unknown model, defaulting to OpenAI');
        aiResponse = await callOpenAI(agentConfig, user_message);
        tokensUsed = aiResponse.usage?.total_tokens || 0;
      }
      
      console.log('AI response received successfully');
    } catch (apiError) {
      console.error('API call error:', apiError);
      return new Response(
        JSON.stringify({ 
          error: `Erro na API de IA: ${apiError.message}`,
          agent_response: "Erro ao se comunicar com o modelo de IA. Verifique se as chaves da API estão configuradas corretamente.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    const responseTime = Date.now() - startTime;
    const agentResponseText = extractResponseText(aiResponse, agentConfig.model);
    
    console.log('Response generated successfully:', {
      responseTime: `${responseTime}ms`,
      tokensUsed,
      responseLength: agentResponseText.length
    });
    
    // Get user ID from the auth header
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    let userId = null;
    if (token) {
      try {
        const { data: userData } = await supabase.auth.getUser(token);
        userId = userData.user?.id;
        console.log('User ID found for conversation logging:', userId);
      } catch (authError) {
        console.warn('Auth error, continuing without user ID:', authError);
      }
    }
    
    // Save conversation to database if user is authenticated
    if (userId) {
      try {
        await supabase
          .from('agent_conversations')
          .insert({
            user_id: userId,
            agent_configuration_id,
            session_id,
            user_message,
            agent_response: agentResponseText,
            response_time_ms: responseTime,
            tokens_used: tokensUsed,
            model_used: agentConfig.model,
          });
        console.log('Conversation saved to database successfully');
      } catch (dbError) {
        console.warn('Database save error, continuing:', dbError);
      }
    }
    
    console.log('=== AGENT CHAT REQUEST SUCCESS ===');
    
    return new Response(
      JSON.stringify({
        agent_response: agentResponseText,
        response_time_ms: responseTime,
        tokens_used: tokensUsed,
        model_used: agentConfig.model,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('=== AGENT CHAT REQUEST ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: `Erro interno do servidor: ${error.message}`,
        agent_response: "Desculpe, ocorreu um erro interno. Tente novamente em alguns instantes.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function callOpenAI(agentConfig: any, userMessage: string) {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiApiKey) {
    throw new Error('Chave da API OpenAI não configurada');
  }
  
  console.log('Making OpenAI API call with model:', agentConfig.model);
  
  // Map model names correctly for OpenAI
  let modelName = agentConfig.model;
  if (agentConfig.model === 'gpt-4.1-2025-04-14') {
    modelName = 'gpt-4o'; // Use available model
  } else if (agentConfig.model === 'o3-2025-04-16') {
    modelName = 'o1-preview'; // Map to available reasoning model
  } else if (agentConfig.model === 'o4-mini-2025-04-16') {
    modelName = 'o1-mini'; // Map to available fast reasoning model
  }
  
  const requestBody = {
    model: modelName,
    messages: [
      { role: 'system', content: agentConfig.prompt },
      { role: 'user', content: userMessage }
    ],
    temperature: agentConfig.temperature || 0.7,
    max_tokens: agentConfig.max_tokens || 1000,
  };
  
  console.log('OpenAI request body:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Erro da API OpenAI: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('OpenAI API response received successfully');
  return result;
}

async function callClaude(agentConfig: any, userMessage: string) {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicApiKey) {
    throw new Error('Chave da API Anthropic não configurada');
  }
  
  console.log('Making Anthropic API call with model:', agentConfig.model);
  
  // Map model names correctly for Claude
  let modelName = agentConfig.model;
  if (agentConfig.model === 'claude-opus-4-20250514') {
    modelName = 'claude-3-5-sonnet-20241022'; // Use available model
  } else if (agentConfig.model === 'claude-sonnet-4-20250514') {
    modelName = 'claude-3-5-sonnet-20241022'; // Use available model  
  }
  
  const requestBody = {
    model: modelName,
    system: agentConfig.prompt,
    messages: [
      { role: 'user', content: userMessage }
    ],
    temperature: agentConfig.temperature || 0.7,
    max_tokens: agentConfig.max_tokens || 1000,
  };
  
  console.log('Anthropic request body:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Anthropic API error response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Erro da API Anthropic: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('Anthropic API response received successfully');
  return result;
}

async function callGemini(agentConfig: any, userMessage: string) {
  const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!googleApiKey) {
    throw new Error('Chave da API Google não configurada');
  }
  
  console.log('Making Google API call with model:', agentConfig.model);
  
  const requestBody = {
    contents: [{
      parts: [{
        text: `${agentConfig.prompt}\n\nUser: ${userMessage}`
      }]
    }],
    generationConfig: {
      temperature: agentConfig.temperature || 0.7,
      maxOutputTokens: agentConfig.max_tokens || 1000,
    },
  };
  
  console.log('Google request body:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${agentConfig.model}:generateContent?key=${googleApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google API error response:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText
    });
    throw new Error(`Erro da API Google: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('Google API response received successfully');
  return result;
}

function extractResponseText(aiResponse: any, model: string): string {
  try {
    if (model.includes('gpt') || model.includes('o3') || model.includes('o4')) {
      return aiResponse.choices?.[0]?.message?.content || 'Erro ao processar resposta da OpenAI';
    } else if (model.includes('claude') || model.includes('anthropic')) {
      return aiResponse.content?.[0]?.text || 'Erro ao processar resposta do Claude';
    } else if (model.includes('gemini') || model.includes('google')) {
      return aiResponse.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao processar resposta do Gemini';
    }
  } catch (error) {
    console.error('Error extracting response text:', error);
  }
  
  return 'Erro ao processar resposta do modelo de IA';
}
