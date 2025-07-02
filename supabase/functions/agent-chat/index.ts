
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
    console.log('Processing agent chat request...');
    
    const requestData = await req.json();
    console.log('Request data:', requestData);
    
    const { agent_configuration_id, user_message, session_id }: ChatRequest = requestData;
    
    if (!agent_configuration_id || !user_message || !session_id) {
      console.error('Missing required parameters:', { agent_configuration_id, user_message, session_id });
      throw new Error('Missing required parameters: agent_configuration_id, user_message, and session_id are required');
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      throw new Error('Supabase configuration not found');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');
    
    // Get agent configuration
    const { data: agentConfig, error: configError } = await supabase
      .from('agent_configurations')
      .select('*')
      .eq('id', agent_configuration_id)
      .eq('is_active', true)
      .single();
    
    if (configError) {
      console.error('Error fetching agent config:', configError);
      throw new Error(`Agent configuration error: ${configError.message}`);
    }
    
    if (!agentConfig) {
      console.error('Agent configuration not found');
      throw new Error('Agent configuration not found or inactive');
    }
    
    console.log('Agent config found:', agentConfig.name, agentConfig.model);
    
    const startTime = Date.now();
    
    // Determine which AI provider to use based on model
    let aiResponse;
    let tokensUsed = 0;
    
    try {
      if (agentConfig.model.startsWith('gpt-') || agentConfig.model.includes('openai')) {
        console.log('Using OpenAI API');
        aiResponse = await callOpenAI(agentConfig, user_message);
        tokensUsed = aiResponse.usage?.total_tokens || 0;
      } else if (agentConfig.model.startsWith('claude-') || agentConfig.model.includes('anthropic')) {
        console.log('Using Anthropic API');
        aiResponse = await callClaude(agentConfig, user_message);
        tokensUsed = (aiResponse.usage?.input_tokens || 0) + (aiResponse.usage?.output_tokens || 0);
      } else if (agentConfig.model.startsWith('gemini-') || agentConfig.model.includes('google')) {
        console.log('Using Google API');
        aiResponse = await callGemini(agentConfig, user_message);
        tokensUsed = aiResponse.usage?.total_tokens || 0;
      } else {
        console.log('Unknown model, defaulting to OpenAI');
        aiResponse = await callOpenAI(agentConfig, user_message);
        tokensUsed = aiResponse.usage?.total_tokens || 0;
      }
    } catch (apiError) {
      console.error('API call error:', apiError);
      throw new Error(`AI API error: ${apiError.message}`);
    }
    
    const responseTime = Date.now() - startTime;
    const agentResponseText = extractResponseText(aiResponse, agentConfig.model);
    
    console.log('AI response generated in', responseTime, 'ms');
    
    // Get user ID from the auth header
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    let userId = null;
    if (token) {
      try {
        const { data: userData } = await supabase.auth.getUser(token);
        userId = userData.user?.id;
        console.log('User ID found:', userId);
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
        console.log('Conversation saved to database');
      } catch (dbError) {
        console.warn('Database save error, continuing:', dbError);
      }
    }
    
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
    console.error('Error in agent-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        agent_response: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
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
    throw new Error('OpenAI API key not configured');
  }
  
  console.log('Calling OpenAI with model:', agentConfig.model);
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: agentConfig.model,
      messages: [
        { role: 'system', content: agentConfig.prompt },
        { role: 'user', content: userMessage }
      ],
      temperature: agentConfig.temperature || 0.7,
      max_tokens: agentConfig.max_tokens || 1000,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', response.status, errorText);
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

async function callClaude(agentConfig: any, userMessage: string) {
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicApiKey) {
    throw new Error('Anthropic API key not configured');
  }
  
  console.log('Calling Anthropic with model:', agentConfig.model);
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: agentConfig.model,
      system: agentConfig.prompt,
      messages: [
        { role: 'user', content: userMessage }
      ],
      temperature: agentConfig.temperature || 0.7,
      max_tokens: agentConfig.max_tokens || 1000,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Anthropic API error:', response.status, errorText);
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

async function callGemini(agentConfig: any, userMessage: string) {
  const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!googleApiKey) {
    throw new Error('Google API key not configured');
  }
  
  console.log('Calling Google with model:', agentConfig.model);
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${agentConfig.model}:generateContent?key=${googleApiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${agentConfig.prompt}\n\nUser: ${userMessage}`
        }]
      }],
      generationConfig: {
        temperature: agentConfig.temperature || 0.7,
        maxOutputTokens: agentConfig.max_tokens || 1000,
      },
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Google API error:', response.status, errorText);
    throw new Error(`Google API error: ${response.status} - ${errorText}`);
  }
  
  return await response.json();
}

function extractResponseText(aiResponse: any, model: string): string {
  try {
    if (model.startsWith('gpt-') || model.includes('openai')) {
      return aiResponse.choices?.[0]?.message?.content || 'Erro ao processar resposta';
    } else if (model.startsWith('claude-') || model.includes('anthropic')) {
      return aiResponse.content?.[0]?.text || 'Erro ao processar resposta';
    } else if (model.startsWith('gemini-') || model.includes('google')) {
      return aiResponse.candidates?.[0]?.content?.parts?.[0]?.text || 'Erro ao processar resposta';
    }
  } catch (error) {
    console.error('Error extracting response text:', error);
  }
  
  return 'Erro ao processar resposta do modelo';
}
