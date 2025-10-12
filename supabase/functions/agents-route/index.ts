import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouteRequest {
  tenant_id: string;
  canal: string;
  mensagem: string;
  contexto?: Record<string, any>;
}

interface RouteResponse {
  setor_destino: 'triagem' | 'tecnico' | 'comercial' | 'financeiro';
  intencao: string;
  confianca: number;
  payload: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { tenant_id, canal, mensagem, contexto }: RouteRequest = await req.json();

    console.log('🔀 Route request:', { tenant_id, canal, mensagem: mensagem.substring(0, 50) });

    // Validar tenant_id
    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenant_id)
      .eq('ativo', true)
      .single();

    if (tenantError || !tenant) {
      return new Response(
        JSON.stringify({ error: 'Tenant não encontrado ou inativo' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar rotas configuradas para o tenant
    const { data: routes } = await supabase
      .from('agent_routes')
      .select('*')
      .eq('tenant_id', tenant_id)
      .eq('ativo', true)
      .order('prioridade', { ascending: false });

    // Buscar configuração de agente de triagem
    const { data: triagemAgent } = await supabase
      .from('agent_profiles')
      .select('*')
      .eq('tenant_id', tenant_id)
      .eq('setor', 'triagem')
      .eq('tipo', 'externo')
      .eq('ativo', true)
      .single();

    // Prompt de roteamento usando Gemini
    const systemPrompt = `Você é um agente de triagem para ${tenant.nome}.

Analise a mensagem do cliente e determine qual setor deve atender:

SETORES DISPONÍVEIS:
- tecnico: Problemas de conexão, internet lenta, equipamentos, sinais OLT/ONT, configurações técnicas
- comercial: Planos, preços, upgrades, contratação, promoções, ofertas
- financeiro: Pagamentos, faturas, boletos, 2ª via, débitos, negociação

REGRAS:
1. Retorne APENAS um JSON válido no formato: {"setor": "nome_setor", "intencao": "descrição", "confianca": 0.0-1.0, "parametros": {}}
2. confianca deve ser 0.0 a 1.0 (use 0.8+ para alta certeza, 0.5-0.7 para média, <0.5 para baixa)
3. Se não tiver certeza, use setor "triagem" com confianca < 0.5
4. Extraia informações relevantes em "parametros" (ex: numero_cliente, problema, valor)

CONTEXTO ADICIONAL:
${contexto ? JSON.stringify(contexto) : 'Nenhum contexto adicional'}

ROTAS CONFIGURADAS:
${routes?.map(r => `- De ${r.de_setor} para ${r.para_setor}: ${JSON.stringify(r.regra)}`).join('\n') || 'Nenhuma rota customizada'}`;

    const userMessage = `MENSAGEM DO CLIENTE (via ${canal}):\n${mensagem}`;

    // Chamar Gemini para classificação
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: userMessage }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error('Erro ao chamar Gemini API');
    }

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    console.log('🤖 Gemini response:', responseText);

    // Extrair JSON da resposta
    let routeResult: RouteResponse;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
      
      routeResult = {
        setor_destino: parsed.setor || 'triagem',
        intencao: parsed.intencao || 'Classificação pendente',
        confianca: parsed.confianca || 0.5,
        payload: {
          mensagem_original: mensagem,
          canal,
          contexto,
          parametros: parsed.parametros || {},
          timestamp: new Date().toISOString(),
        }
      };
    } catch (parseError) {
      console.error('Erro ao parsear resposta:', parseError);
      routeResult = {
        setor_destino: 'triagem',
        intencao: 'Erro na classificação - encaminhado para triagem',
        confianca: 0.3,
        payload: {
          mensagem_original: mensagem,
          canal,
          contexto,
          erro: 'Falha no parse da resposta do Gemini',
          timestamp: new Date().toISOString(),
        }
      };
    }

    // Log da decisão de roteamento
    await supabase.from('audit_logs').insert({
      tenant_id,
      acao: 'agent_route',
      payload: {
        canal,
        mensagem: mensagem.substring(0, 200),
        resultado: routeResult,
      }
    });

    console.log('✅ Roteamento concluído:', routeResult);

    return new Response(
      JSON.stringify(routeResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erro em agents-route:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        setor_destino: 'triagem',
        intencao: 'Erro no roteamento',
        confianca: 0,
        payload: {}
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
