
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  agent_id?: string;
  agent_type?: string;
  event_type: string;
  data: any;
  timestamp?: string;
  source?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== WEBHOOK RECEIVER START ===');
    
    const payload: WebhookPayload = await req.json();
    console.log('Webhook payload received:', JSON.stringify(payload, null, 2));
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor não encontrada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Save webhook event to database
    const { error: logError } = await supabase
      .from('webhook_events')
      .insert({
        agent_id: payload.agent_id,
        agent_type: payload.agent_type,
        event_type: payload.event_type,
        payload: payload.data,
        source: payload.source || 'n8n',
        timestamp: payload.timestamp || new Date().toISOString(),
        status: 'received'
      });
    
    if (logError) {
      console.error('Error saving webhook event:', logError);
    }
    
    // Process webhook based on event type
    let response_data = {};
    
    switch (payload.event_type) {
      case 'agent_response':
        console.log('Processing agent response webhook');
        response_data = { 
          message: 'Resposta do agente recebida com sucesso',
          processed: true 
        };
        break;
        
      case 'workflow_completed':
        console.log('Processing workflow completion webhook');
        response_data = { 
          message: 'Workflow concluído com sucesso',
          processed: true 
        };
        break;
        
      case 'integration_test':
        console.log('Processing integration test webhook');
        response_data = { 
          message: 'Teste de integração recebido',
          status: 'success',
          timestamp: new Date().toISOString()
        };
        break;
        
      default:
        console.log('Processing generic webhook');
        response_data = { 
          message: 'Webhook recebido com sucesso',
          event_type: payload.event_type,
          processed: true 
        };
    }
    
    console.log('=== WEBHOOK RECEIVER SUCCESS ===');
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processado com sucesso',
        data: response_data,
        received_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
    
  } catch (error) {
    console.error('=== WEBHOOK RECEIVER ERROR ===');
    console.error('Error details:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro ao processar webhook',
        message: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
