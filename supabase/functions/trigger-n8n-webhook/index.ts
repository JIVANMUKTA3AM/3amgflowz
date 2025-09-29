
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== TRIGGER N8N WEBHOOK START ===');
    
    const { event_type, user_id, timestamp, olt_data, agent_type } = await req.json()

    console.log('Triggering n8n webhook with data:', {
      event_type,
      user_id,
      timestamp,
      olt_data,
      agent_type
    })

    // N8n webhook URLs específicas para cada agente
    const webhookUrls = {
      'atendimento': Deno.env.get('N8N_WEBHOOK_ATENDIMENTO'),
      'comercial': Deno.env.get('N8N_WEBHOOK_COMERCIAL'),
      'suporte_tecnico': Deno.env.get('N8N_WEBHOOK_SUPORTE_TECNICO')
    }

    // Determinar qual webhook usar baseado no agent_type ou evento
    let webhookUrl = ''
    let targetAgent = agent_type

    // Se não houver agent_type especificado, determinar baseado no evento
    if (!targetAgent) {
      if (event_type === 'novo_ticket' || event_type === 'conclusao_servico') {
        targetAgent = 'suporte_tecnico'
      } else if (event_type === 'venda_concluida' || event_type === 'cliente_cadastrado') {
        targetAgent = 'comercial'
      } else {
        targetAgent = 'atendimento'
      }
    }

    webhookUrl = webhookUrls[targetAgent as keyof typeof webhookUrls] || ''

    if (!webhookUrl) {
      console.log(`No webhook URL configured for agent: ${targetAgent}, using default response`)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `No webhook configured for ${targetAgent}, but request processed`,
          agent_type: targetAgent,
          event_type
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }
    
    const webhookPayload = {
      event_type,
      user_id,
      timestamp,
      agent_type: targetAgent,
      olt_configuration: olt_data ? {
        id: olt_data.id,
        name: olt_data.name,
        brand: olt_data.brand,
        model: olt_data.model,
        ip_address: olt_data.ip_address,
        snmp_community: olt_data.snmp_community,
        port: olt_data.port,
        is_active: olt_data.is_active
      } : null
    }

    console.log(`Sending to ${targetAgent} webhook:`, webhookUrl)

    // Send data to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    })

    if (!response.ok) {
      throw new Error(`N8n webhook failed with status: ${response.status}`)
    }

    const result = await response.json()
    console.log('N8n webhook response:', result)
    console.log('=== TRIGGER N8N WEBHOOK SUCCESS ===')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `N8n webhook ${targetAgent} triggered successfully`,
        agent_type: targetAgent,
        webhook_url: webhookUrl,
        n8n_response: result 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('=== TRIGGER N8N WEBHOOK ERROR ===')
    console.error('Error triggering n8n webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : String(error),
        details: 'Failed to trigger n8n webhook'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
