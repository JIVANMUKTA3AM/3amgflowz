import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookTestRequest {
  webhook_url: string;
  webhook_id?: string;
  test_payload?: any;
  timeout_ms?: number;
}

interface WebhookTestResult {
  success: boolean;
  status_code?: number;
  response_time_ms: number;
  error_message?: string;
  response_body?: any;
  response_headers?: Record<string, string>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== WEBHOOK TESTER START ===');
    
    const { webhook_url, webhook_id, test_payload, timeout_ms = 10000 }: WebhookTestRequest = await req.json();
    
    if (!webhook_url) {
      return new Response(
        JSON.stringify({ error: 'webhook_url é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validar se não é localhost
    if (webhook_url.includes('localhost') || webhook_url.includes('127.0.0.1')) {
      return new Response(
        JSON.stringify({ 
          error: 'URLs localhost não são acessíveis do ambiente Supabase',
          message: 'Use uma URL publicamente acessível (ngrok, domínio público, etc)'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Testing webhook URL:', webhook_url);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: 'Configuração do servidor não encontrada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Default test payload
    const defaultPayload = test_payload || {
      event_type: 'webhook_test',
      timestamp: new Date().toISOString(),
      test: true,
      data: {
        message: 'Este é um teste de webhook do ambiente live',
        webhook_id: webhook_id || 'test',
        source: '3amg_webhook_tester'
      }
    };

    const startTime = Date.now();
    let testResult: WebhookTestResult;

    try {
      // Test the webhook with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout_ms);

      const response = await fetch(webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': '3AMG-Webhook-Tester/1.0',
          'X-Webhook-Test': 'true'
        },
        body: JSON.stringify(defaultPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      let responseBody: any = null;
      const responseHeaders: Record<string, string> = {};
      
      // Collect response headers
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Try to get response body
      try {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          responseBody = await response.json();
        } else {
          responseBody = await response.text();
        }
      } catch (bodyError) {
        console.log('Could not parse response body:', bodyError instanceof Error ? bodyError.message : String(bodyError));
        responseBody = 'Could not parse response body';
      }

      testResult = {
        success: response.ok,
        status_code: response.status,
        response_time_ms: responseTime,
        response_body: responseBody,
        response_headers: responseHeaders,
        error_message: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };

      console.log('Webhook test result:', {
        url: webhook_url,
        status: response.status,
        success: response.ok,
        responseTime: responseTime + 'ms'
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      testResult = {
        success: false,
        response_time_ms: responseTime,
        error_message: error instanceof Error ? error.message : String(error)
      };

      console.error('Webhook test failed:', error instanceof Error ? error.message : String(error));
    }

    // Log the test result to database if webhook_id is provided
    if (webhook_id) {
      try {
        await supabase
          .from('webhook_logs')
          .insert({
            webhook_id: webhook_id,
            status_http: testResult.status_code,
            payload_enviado: defaultPayload,
            resposta_recebida: testResult.response_body,
            timestamp_execucao: new Date().toISOString(),
            erro_message: testResult.error_message
          });
      } catch (logError) {
        console.error('Failed to log webhook test:', logError instanceof Error ? logError.message : String(logError));
      }
    }

    console.log('=== WEBHOOK TESTER SUCCESS ===');
    
    return new Response(
      JSON.stringify({
        success: true,
        webhook_url,
        test_result: testResult,
        tested_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('=== WEBHOOK TESTER ERROR ===');
    console.error('Error details:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Erro ao testar webhook',
        message: error instanceof Error ? error.message : String(error) 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});