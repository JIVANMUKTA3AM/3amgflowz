
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[TEST-INTEGRATION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    const { integration_id } = await req.json();
    if (!integration_id) throw new Error("integration_id is required");
    logStep("Integration ID received", { integration_id });

    // Buscar a integração
    const { data: integration, error: integrationError } = await supabaseClient
      .from('integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('user_id', user.id)
      .single();

    if (integrationError) throw new Error(`Integration not found: ${integrationError.message}`);
    logStep("Integration found", { name: integration.name, type: integration.type });

    // Preparar dados de teste
    const testData = {
      test: true,
      timestamp: new Date().toISOString(),
      integration_id: integration.id,
      user_id: user.id,
      message: "Test message from integration testing"
    };

    // Preparar headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...integration.config.headers
    };

    // Adicionar autenticação se configurada
    if (integration.config.auth_type === 'bearer' && integration.config.credentials?.token) {
      headers['Authorization'] = `Bearer ${integration.config.credentials.token}`;
    } else if (integration.config.auth_type === 'api_key' && integration.config.credentials?.api_key) {
      headers['X-API-Key'] = integration.config.credentials.api_key;
    } else if (integration.config.auth_type === 'basic' && integration.config.credentials?.username && integration.config.credentials?.password) {
      const credentials = btoa(`${integration.config.credentials.username}:${integration.config.credentials.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }

    logStep("Sending test request", { 
      url: integration.config.url, 
      method: integration.config.method,
      hasAuth: integration.config.auth_type !== 'none'
    });

    // Fazer requisição de teste
    let response;
    let responseData;
    let statusCode;
    let errorMessage;

    try {
      const fetchOptions: RequestInit = {
        method: integration.config.method || 'POST',
        headers,
      };

      if (integration.config.method !== 'GET') {
        fetchOptions.body = JSON.stringify(testData);
      }

      response = await fetch(integration.config.url, fetchOptions);
      statusCode = response.status;
      
      const responseText = await response.text();
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      logStep("Test request completed", { statusCode, success: response.ok });

    } catch (error) {
      statusCode = 0;
      errorMessage = error instanceof Error ? error.message : String(error);
      logStep("Test request failed", { error: errorMessage });
    }

    // Registrar log da integração
    const logEntry = {
      integration_id: integration.id,
      event_type: response?.ok ? 'success' : 'error',
      request_data: testData,
      response_data: responseData,
      status_code: statusCode,
      error_message: errorMessage
    };

    await supabaseClient
      .from('integration_logs')
      .insert(logEntry);

    // Atualizar status da integração
    const newStatus = response?.ok ? 'active' : 'error';
    const updateData: any = {
      status: newStatus,
      last_sync: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (errorMessage) {
      updateData.error_message = errorMessage;
    } else {
      updateData.error_message = null;
    }

    await supabaseClient
      .from('integrations')
      .update(updateData)
      .eq('id', integration.id);

    logStep("Integration status updated", { newStatus });

    return new Response(JSON.stringify({
      success: response?.ok || false,
      status_code: statusCode,
      response_data: responseData,
      error_message: errorMessage,
      test_completed_at: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in test-integration", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
