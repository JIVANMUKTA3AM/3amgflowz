
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HTTPRequest {
  oltConfigId: string;
  operation: 'get' | 'post' | 'put' | 'delete';
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
}

interface HTTPResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionTime?: number;
  status?: number;
  headers?: Record<string, string>;
}

// Função para executar requisição HTTP na OLT
async function executeHTTPRequest(
  host: string,
  operation: string,
  endpoint: string,
  data?: any,
  headers?: Record<string, string>,
  username?: string,
  password?: string
): Promise<HTTPResponse> {
  const startTime = Date.now();
  
  try {
    const url = `http://${host}${endpoint}`;
    
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Adicionar autenticação básica se fornecida
    if (username && password) {
      const credentials = btoa(`${username}:${password}`);
      requestHeaders['Authorization'] = `Basic ${credentials}`;
    }

    const requestOptions: RequestInit = {
      method: operation.toUpperCase(),
      headers: requestHeaders,
      ...(data && ['POST', 'PUT'].includes(operation.toUpperCase()) && {
        body: JSON.stringify(data)
      })
    };

    console.log(`Executing HTTP ${operation.toUpperCase()} request to ${url}`);
    
    const response = await fetch(url, requestOptions);
    
    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Converter headers para objeto
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const executionTime = Date.now() - startTime;
    
    return {
      success: response.ok,
      data: responseData,
      status: response.status,
      headers: responseHeaders,
      executionTime,
      ...((!response.ok) && { error: `HTTP ${response.status}: ${response.statusText}` })
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      executionTime: Date.now() - startTime
    };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const requestData: HTTPRequest = await req.json();
    const { oltConfigId, operation, endpoint, data, headers } = requestData;

    // Buscar configuração da OLT
    const { data: oltConfig, error: oltError } = await supabase
      .from('olt_configurations')
      .select('*')
      .eq('id', oltConfigId)
      .eq('user_id', user.id)
      .single();

    if (oltError || !oltConfig) {
      throw new Error('OLT configuration not found');
    }

    // Log da operação
    const logEntry = {
      olt_configuration_id: oltConfigId,
      user_id: user.id,
      operation_type: `http_${operation}`,
      oid: endpoint,
      status: 'running'
    };

    const { data: logData, error: logError } = await supabase
      .from('snmp_logs')
      .insert(logEntry)
      .select()
      .single();

    if (logError) {
      console.error('Error creating log entry:', logError);
    }

    // Executar requisição HTTP
    const result = await executeHTTPRequest(
      oltConfig.ip_address,
      operation,
      endpoint,
      data,
      headers,
      oltConfig.username,
      oltConfig.password
    );

    // Atualizar log com resultado
    if (logData) {
      await supabase
        .from('snmp_logs')
        .update({
          status: result.success ? 'success' : 'error',
          error_message: result.error,
          response_data: result.data,
          execution_time_ms: result.executionTime
        })
        .eq('id', logData.id);
    }

    // Salvar dados HTTP se sucesso
    if (result.success && result.data) {
      await supabase
        .from('snmp_data')
        .insert({
          olt_configuration_id: oltConfigId,
          user_id: user.id,
          oid: endpoint,
          value: typeof result.data === 'string' ? result.data : JSON.stringify(result.data),
          data_type: 'http_response',
          description: `${operation.toUpperCase()} operation result`
        });
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('HTTP operation error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
