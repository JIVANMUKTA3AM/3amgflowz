import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ExecuteRequest {
  tenant_id: string;
  setor: 'triagem' | 'tecnico' | 'comercial' | 'financeiro';
  acao: string;
  parametros: Record<string, any>;
  tipo_agente?: 'externo' | 'interno';
}

interface ExecuteResponse {
  sucesso: boolean;
  resposta: string;
  dados?: Record<string, any>;
  proxima_acao?: string;
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
    const { 
      tenant_id, 
      setor, 
      acao, 
      parametros, 
      tipo_agente = 'externo' 
    }: ExecuteRequest = await req.json();

    console.log('⚡ Execute request:', { tenant_id, setor, acao, tipo_agente });

    // Validar tenant
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

    // Buscar configuração do agente específico
    const { data: agentProfile } = await supabase
      .from('agent_profiles')
      .select('*')
      .eq('tenant_id', tenant_id)
      .eq('setor', setor)
      .eq('tipo', tipo_agente)
      .eq('ativo', true)
      .single();

    if (!agentProfile) {
      return new Response(
        JSON.stringify({ error: `Agente ${setor} (${tipo_agente}) não configurado para este tenant` }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let executeResult: ExecuteResponse;

    // Executar ação baseada no setor
    switch (setor) {
      case 'tecnico':
        executeResult = await executeTecnico(supabase, tenant_id, parametros, tipo_agente, geminiApiKey);
        break;
      
      case 'comercial':
        executeResult = await executeComercial(supabase, tenant_id, parametros, tipo_agente, geminiApiKey);
        break;
      
      case 'financeiro':
        executeResult = await executeFinanceiro(supabase, tenant_id, parametros, tipo_agente, geminiApiKey);
        break;
      
      case 'triagem':
        executeResult = await executeTriagem(supabase, tenant_id, parametros, geminiApiKey);
        break;
      
      default:
        throw new Error(`Setor desconhecido: ${setor}`);
    }

    // Log da execução
    await supabase.from('audit_logs').insert({
      tenant_id,
      acao: `agent_execute_${setor}`,
      payload: {
        tipo_agente,
        acao,
        parametros,
        resultado: executeResult,
      }
    });

    console.log('✅ Execução concluída:', executeResult);

    return new Response(
      JSON.stringify(executeResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erro em agents-execute:', error);
    return new Response(
      JSON.stringify({ 
        sucesso: false,
        resposta: 'Desculpe, ocorreu um erro ao processar sua solicitação.',
        error: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// =====================================================
// EXECUTORES POR SETOR
// =====================================================

async function executeTecnico(
  supabase: any,
  tenant_id: string,
  parametros: any,
  tipo_agente: string,
  geminiApiKey: string
): Promise<ExecuteResponse> {
  console.log('🔧 Executando agente técnico...');

  // Buscar adapters de monitoramento
  const { data: adapters } = await supabase
    .from('monitoring_adapters')
    .select('*')
    .eq('tenant_id', tenant_id)
    .eq('ativo', true);

  const mensagemCliente = parametros.mensagem_original || parametros.mensagem || '';
  
  const systemPrompt = tipo_agente === 'externo'
    ? `Você é um assistente técnico amigável e acessível. Explique problemas técnicos de forma simples para clientes finais.`
    : `Você é um assistente técnico avançado. Forneça análises técnicas detalhadas e comandos específicos.`;

  const contextInfo = adapters?.length 
    ? `Adapters de monitoramento configurados: ${adapters.map(a => a.tipo).join(', ')}`
    : 'Nenhum adapter de monitoramento configurado';

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}

CONTEXTO:
${contextInfo}

PROBLEMA DO CLIENTE:
${mensagemCliente}

Forneça uma resposta ${tipo_agente === 'externo' ? 'clara e amigável' : 'técnica e detalhada'}.`
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 800,
        }
      })
    }
  );

  const geminiData = await geminiResponse.json();
  const resposta = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
    'Desculpe, não consegui processar sua solicitação técnica.';

  return {
    sucesso: true,
    resposta,
    dados: {
      adapters_disponiveis: adapters?.length || 0,
      tipo_agente,
    },
    proxima_acao: tipo_agente === 'externo' ? 'aguardar_feedback' : 'executar_diagnostico'
  };
}

async function executeComercial(
  supabase: any,
  tenant_id: string,
  parametros: any,
  tipo_agente: string,
  geminiApiKey: string
): Promise<ExecuteResponse> {
  console.log('💼 Executando agente comercial...');

  // Buscar planos do tenant
  const { data: plans } = await supabase
    .from('tenant_plans')
    .select('*')
    .eq('tenant_id', tenant_id)
    .eq('ativo', true)
    .order('preco', { ascending: true });

  const mensagemCliente = parametros.mensagem_original || parametros.mensagem || '';

  const planosInfo = plans?.map(p => 
    `- ${p.nome_plano}: R$ ${p.preco}${p.promocao ? ` (Promoção: ${p.promocao})` : ''}`
  ).join('\n') || 'Nenhum plano disponível';

  const systemPrompt = tipo_agente === 'externo'
    ? `Você é um consultor comercial cordial. Apresente os planos de forma atrativa para clientes finais.`
    : `Você é um analista comercial B2B. Forneça análises de planos, margens e estratégias de venda.`;

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}

PLANOS DISPONÍVEIS:
${planosInfo}

SOLICITAÇÃO DO CLIENTE:
${mensagemCliente}

Responda de forma ${tipo_agente === 'externo' ? 'comercial e persuasiva' : 'analítica e estratégica'}.`
          }]
        }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 800,
        }
      })
    }
  );

  const geminiData = await geminiResponse.json();
  const resposta = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
    'Desculpe, não consegui processar sua solicitação comercial.';

  return {
    sucesso: true,
    resposta,
    dados: {
      planos_disponiveis: plans?.length || 0,
      planos: plans?.map(p => ({ nome: p.nome_plano, preco: p.preco })) || [],
    },
    proxima_acao: 'oferecer_contratacao'
  };
}

async function executeFinanceiro(
  supabase: any,
  tenant_id: string,
  parametros: any,
  tipo_agente: string,
  geminiApiKey: string
): Promise<ExecuteResponse> {
  console.log('💰 Executando agente financeiro...');

  // Buscar adapters de cobrança
  const { data: adapters } = await supabase
    .from('billing_adapters')
    .select('*')
    .eq('tenant_id', tenant_id)
    .eq('ativo', true);

  const mensagemCliente = parametros.mensagem_original || parametros.mensagem || '';

  const systemPrompt = tipo_agente === 'externo'
    ? `Você é um assistente financeiro cordial. Ajude clientes com pagamentos, boletos e 2ª via sem coletar dados sensíveis.`
    : `Você é um analista financeiro B2B. Forneça relatórios, conciliações e análises financeiras detalhadas.`;

  const adaptersInfo = adapters?.length
    ? `Sistema de cobrança integrado: ${adapters.map(a => a.provedor).join(', ')}`
    : 'Nenhum sistema de cobrança integrado';

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}

SISTEMAS DISPONÍVEIS:
${adaptersInfo}

SOLICITAÇÃO DO CLIENTE:
${mensagemCliente}

${tipo_agente === 'externo' 
  ? 'IMPORTANTE: Não solicite dados de cartão ou informações financeiras sensíveis. Oriente sobre links de pagamento seguros.'
  : 'Forneça análise financeira detalhada.'
}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 800,
        }
      })
    }
  );

  const geminiData = await geminiResponse.json();
  const resposta = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
    'Desculpe, não consegui processar sua solicitação financeira.';

  return {
    sucesso: true,
    resposta,
    dados: {
      adapters_disponiveis: adapters?.length || 0,
      tipo_agente,
    },
    proxima_acao: tipo_agente === 'externo' ? 'enviar_link_pagamento' : 'gerar_relatorio'
  };
}

async function executeTriagem(
  supabase: any,
  tenant_id: string,
  parametros: any,
  geminiApiKey: string
): Promise<ExecuteResponse> {
  console.log('🎯 Executando agente de triagem...');

  const mensagemCliente = parametros.mensagem_original || parametros.mensagem || '';

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Você é um atendente de triagem cordial.

MENSAGEM DO CLIENTE:
${mensagemCliente}

Cumprimente o cliente e pergunte como pode ajudar de forma específica (técnico, comercial ou financeiro).`
          }]
        }],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 400,
        }
      })
    }
  );

  const geminiData = await geminiResponse.json();
  const resposta = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 
    'Olá! Como posso te ajudar hoje?';

  return {
    sucesso: true,
    resposta,
    proxima_acao: 'aguardar_classificacao'
  };
}
