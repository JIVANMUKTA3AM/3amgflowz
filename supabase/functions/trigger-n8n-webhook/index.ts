
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
    const { event_type, user_id, timestamp, olt_data } = await req.json()

    console.log('Triggering n8n webhook with data:', {
      event_type,
      user_id,
      timestamp,
      olt_data
    })

    // N8n webhook URL (você deve substituir pela URL real do seu webhook n8n)
    const n8nWebhookUrl = 'https://your-n8n-instance.com/webhook/olt-configuration'
    
    const webhookPayload = {
      event_type,
      user_id,
      timestamp,
      olt_configuration: {
        id: olt_data.id,
        name: olt_data.name,
        brand: olt_data.brand,
        model: olt_data.model,
        ip_address: olt_data.ip_address,
        snmp_community: olt_data.snmp_community,
        port: olt_data.port,
        is_active: olt_data.is_active
      }
    }

    // Send data to n8n webhook
    const response = await fetch(n8nWebhookUrl, {
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'N8n webhook triggered successfully',
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
    console.error('Error triggering n8n webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
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
