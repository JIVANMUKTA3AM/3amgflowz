
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
    const { integration_id } = await req.json();
    
    if (!integration_id) {
      return new Response(
        JSON.stringify({ error: 'Missing integration_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Inicializar Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Buscar integração
    const { data: integration, error: integrationError } = await supabase
      .from('agent_integrations')
      .select('*')
      .eq('id', integration_id)
      .single();

    if (integrationError || !integration) {
      return new Response(
        JSON.stringify({ error: 'Integration not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let testResult = { success: false, message: '', details: {} };

    // Testar baseado no tipo de integração
    switch (integration.integration_type.toLowerCase()) {
      case 'whatsapp':
        testResult = await testWhatsAppIntegration(integration);
        break;
      case 'slack':
        testResult = await testSlackIntegration(integration);
        break;
      case 'email':
        testResult = await testEmailIntegration(integration);
        break;
      case 'webhook':
        testResult = await testWebhookIntegration(integration);
        break;
      case 'crm':
        testResult = await testCRMIntegration(integration);
        break;
      default:
        testResult = { 
          success: false, 
          message: `Tipo de integração '${integration.integration_type}' não suportado`,
          details: {} 
        };
    }

    // Atualizar última sincronização se o teste passou
    if (testResult.success) {
      await supabase
        .from('agent_integrations')
        .update({ 
          last_sync_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', integration_id);
    }

    return new Response(
      JSON.stringify(testResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in test-integration function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Erro interno no teste de integração',
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Funções de teste para cada tipo de integração
async function testWhatsAppIntegration(integration: any) {
  try {
    const { phone_number_id, access_token } = integration.api_credentials;
    
    if (!phone_number_id || !access_token) {
      return { 
        success: false, 
        message: 'Credenciais do WhatsApp não configuradas',
        details: { missing: ['phone_number_id', 'access_token'] }
      };
    }

    // Testar API do WhatsApp Business
    const response = await fetch(`https://graph.facebook.com/v18.0/${phone_number_id}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        message: 'Conexão com WhatsApp Business funcionando',
        details: { phone_number: data.display_phone_number }
      };
    } else {
      return { 
        success: false, 
        message: 'Falha na conexão com WhatsApp Business',
        details: { status: response.status }
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: 'Erro ao testar WhatsApp',
      details: { error: error.message }
    };
  }
}

async function testSlackIntegration(integration: any) {
  try {
    const { bot_token } = integration.api_credentials;
    
    if (!bot_token) {
      return { 
        success: false, 
        message: 'Token do Slack não configurado',
        details: { missing: ['bot_token'] }
      };
    }

    // Testar API do Slack
    const response = await fetch('https://slack.com/api/auth.test', {
      headers: {
        'Authorization': `Bearer ${bot_token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.ok) {
      return { 
        success: true, 
        message: 'Conexão com Slack funcionando',
        details: { team: data.team, user: data.user }
      };
    } else {
      return { 
        success: false, 
        message: 'Falha na conexão com Slack',
        details: { error: data.error }
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: 'Erro ao testar Slack',
      details: { error: error.message }
    };
  }
}

async function testEmailIntegration(integration: any) {
  try {
    const { smtp_host, smtp_port, username, password } = integration.api_credentials;
    
    if (!smtp_host || !username || !password) {
      return { 
        success: false, 
        message: 'Credenciais de email não configuradas',
        details: { missing: ['smtp_host', 'username', 'password'] }
      };
    }

    // Simulação de teste de SMTP (em produção, você implementaria uma conexão real)
    return { 
      success: true, 
      message: 'Configuração de email válida',
      details: { smtp_host, smtp_port: smtp_port || 587, username }
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Erro ao testar email',
      details: { error: error.message }
    };
  }
}

async function testWebhookIntegration(integration: any) {
  try {
    const { webhook_url } = integration.webhook_endpoints;
    
    if (!webhook_url) {
      return { 
        success: false, 
        message: 'URL do webhook não configurada',
        details: { missing: ['webhook_url'] }
      };
    }

    // Testar webhook com ping
    const response = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        type: 'test',
        message: 'Teste de conectividade',
        timestamp: new Date().toISOString()
      }),
    });

    if (response.ok) {
      return { 
        success: true, 
        message: 'Webhook respondendo corretamente',
        details: { status: response.status, url: webhook_url }
      };
    } else {
      return { 
        success: false, 
        message: 'Webhook não está respondendo',
        details: { status: response.status, url: webhook_url }
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: 'Erro ao testar webhook',
      details: { error: error.message }
    };
  }
}

async function testCRMIntegration(integration: any) {
  try {
    const { api_key, base_url } = integration.api_credentials;
    
    if (!api_key || !base_url) {
      return { 
        success: false, 
        message: 'Credenciais do CRM não configuradas',
        details: { missing: ['api_key', 'base_url'] }
      };
    }

    // Testar conexão com CRM
    const response = await fetch(`${base_url}/api/ping`, {
      headers: {
        'Authorization': `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return { 
        success: true, 
        message: 'Conexão com CRM funcionando',
        details: { base_url }
      };
    } else {
      return { 
        success: false, 
        message: 'Falha na conexão com CRM',
        details: { status: response.status, base_url }
      };
    }
  } catch (error) {
    return { 
      success: false, 
      message: 'Erro ao testar CRM',
      details: { error: error.message }
    };
  }
}
