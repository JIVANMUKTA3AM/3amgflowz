
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export type IntegrationConfig = {
  type: string;
  apiKey?: string;
  webhookUrl?: string;
  accountId?: string;
  isConnected: boolean;
};

export type AgentIntegration = {
  agentType: "atendimento" | "comercial" | "suporte_tecnico";
  serviceName: string;
  serviceType: "whatsapp" | "crm" | "ticket";
  description: string;
  isConnected: boolean;
  configFields: Array<{
    name: string;
    label: string;
    type: "text" | "password" | "url";
    required: boolean;
  }>;
};

export const agentIntegrations: AgentIntegration[] = [
  {
    agentType: "atendimento",
    serviceName: "WhatsApp Business",
    serviceType: "whatsapp",
    description: "Integre seu Agente de Atendimento com o WhatsApp Business para responder mensagens automaticamente.",
    isConnected: false,
    configFields: [
      { name: "apiKey", label: "API Key", type: "password", required: true },
      { name: "accountId", label: "ID da Conta", type: "text", required: true },
      { name: "webhookUrl", label: "URL do Webhook", type: "url", required: true }
    ]
  },
  {
    agentType: "comercial",
    serviceName: "CRM Vendas",
    serviceType: "crm",
    description: "Conecte seu Agente Comercial ao CRM para automatizar o processo de vendas e acompanhamento de leads.",
    isConnected: false,
    configFields: [
      { name: "apiKey", label: "API Key", type: "password", required: true },
      { name: "webhookUrl", label: "URL do Webhook", type: "url", required: true }
    ]
  },
  {
    agentType: "suporte_tecnico",
    serviceName: "Sistema de Tickets",
    serviceType: "ticket",
    description: "Integre seu Agente de Suporte Técnico com o sistema de tickets para resolução automática de problemas.",
    isConnected: false,
    configFields: [
      { name: "apiKey", label: "API Key", type: "password", required: true },
      { name: "accountId", label: "ID da Conta", type: "text", required: true },
      { name: "webhookUrl", label: "URL do Webhook", type: "url", required: true }
    ]
  }
];

// Salvar configuração de integração
export async function saveIntegrationConfig(agentType: string, config: IntegrationConfig): Promise<boolean> {
  try {
    // Converter para o formato esperado pelo banco de dados
    const integrationData = {
      agent_type: agentType,
      config: config
    };
    
    const { error } = await supabase
      .from('agent_integrations')
      .upsert(integrationData, { onConflict: 'agent_type' });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar configuração de integração:", error);
    return false;
  }
}

// Buscar configuração de integração
export async function getIntegrationConfig(agentType: string): Promise<IntegrationConfig | null> {
  try {
    const { data, error } = await supabase
      .from('agent_integrations')
      .select('config')
      .eq('agent_type', agentType)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Registro não encontrado, retornar null
        return null;
      }
      throw error;
    }
    
    return data?.config as IntegrationConfig;
  } catch (error) {
    console.error("Erro ao buscar configuração de integração:", error);
    return null;
  }
}

// Testar conexão com o serviço externo
export async function testIntegrationConnection(serviceType: string, config: IntegrationConfig): Promise<boolean> {
  // Esta é uma função simulada para testar a conexão
  // Em um cenário real, você faria uma chamada para o serviço externo
  
  try {
    // Simulação de uma chamada a API externa
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular sucesso se tiver apiKey e webhookUrl
    if (config.apiKey && config.webhookUrl) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return false;
  }
}
