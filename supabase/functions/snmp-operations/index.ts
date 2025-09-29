
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SNMPRequest {
  oltConfigId: string;
  operation: 'get' | 'walk' | 'set';
  oid: string;
  value?: string;
  community?: string;
  version?: '1' | '2c' | '3';
}

interface SNMPResponse {
  success: boolean;
  data?: any[];
  error?: string;
  executionTime?: number;
}

// Função para simular comando SNMP (substitua por implementação real)
async function executeSNMPCommand(
  host: string,
  community: string,
  operation: string,
  oid: string,
  value?: string
): Promise<SNMPResponse> {
  const startTime = Date.now();
  
  try {
    // Simulação de comando SNMP - substitua por implementação real
    // Em produção, você usaria uma biblioteca SNMP como net-snmp
    console.log(`Executing SNMP ${operation} on ${host} with OID ${oid}`);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    let mockData: any[] = [];
    
    switch (operation) {
      case 'get':
        mockData = [{
          oid: oid,
          value: Math.random() > 0.5 ? '1' : '0',
          type: 'integer'
        }];
        break;
        
      case 'walk':
        // Simular walk retornando múltiplos valores
        for (let i = 1; i <= 5; i++) {
          mockData.push({
            oid: `${oid}.${i}`,
            value: `Interface ${i}`,
            type: 'string'
          });
        }
        break;
        
      case 'set':
        mockData = [{
          oid: oid,
          value: value,
          type: 'string',
          status: 'success'
        }];
        break;
    }
    
    const executionTime = Date.now() - startTime;
    
    return {
      success: true,
      data: mockData,
      executionTime
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
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

    const requestData: SNMPRequest = await req.json();
    const { oltConfigId, operation, oid, value, community = 'public' } = requestData;

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
      operation_type: operation,
      oid: oid,
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

    // Executar comando SNMP
    const result = await executeSNMPCommand(
      oltConfig.ip_address,
      community || oltConfig.snmp_community,
      operation,
      oid,
      value
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

    // Salvar dados SNMP se sucesso
    if (result.success && result.data) {
      for (const item of result.data) {
        await supabase
          .from('snmp_data')
          .insert({
            olt_configuration_id: oltConfigId,
            user_id: user.id,
            oid: item.oid,
            value: item.value.toString(),
            data_type: item.type || 'string',
            description: `${operation.toUpperCase()} operation result`
          });
      }
    }

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('SNMP operation error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
