
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export type IntegrationConfig = {
  type: string;
  apiKey?: string;
  webhookUrl?: string;
  accountId?: string;
  clientId?: string;
  clientSecret?: string;
  spreadsheetId?: string;
  workspaceId?: string;
  channelId?: string;
  botToken?: string;
  isConnected: boolean;
};

export type AgentIntegration = {
  agentType: "atendimento" | "comercial" | "suporte_tecnico";
  serviceName: string;
  serviceType: "google_sheets" | "crm" | "slack";
  description: string;
  isConnected: boolean;
  configFields: Array<{
    name: string;
    label: string;
    type: "text" | "password" | "url";
    required: boolean;
    placeholder?: string;
  }>;
};

export const agentIntegrations: AgentIntegration[] = [
  {
    agentType: "atendimento",
    serviceName: "Google Sheets",
    serviceType: "google_sheets",
    description: "Integre o Agente de Atendimento com Google Sheets para registrar automaticamente todas as interações e criar relatórios de atendimento.",
    isConnected: false,
    configFields: [
      { 
        name: "clientId", 
        label: "Client ID", 
        type: "text", 
        required: true,
        placeholder: "seu-client-id.googleusercontent.com"
      },
      { 
        name: "clientSecret", 
        label: "Client Secret", 
        type: "password", 
        required: true,
        placeholder: "GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
      },
      { 
        name: "spreadsheetId", 
        label: "ID da Planilha", 
        type: "text", 
        required: true,
        placeholder: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
      },
      { 
        name: "webhookUrl", 
        label: "URL do Webhook n8n", 
        type: "url", 
        required: true,
        placeholder: "https://seu-n8n.com/webhook/google-sheets"
      }
    ]
  },
  {
    agentType: "comercial",
    serviceName: "CRM Vendas",
    serviceType: "crm",
    description: "Conecte o Agente Comercial ao seu CRM para automatizar o processo de vendas, criar leads e acompanhar oportunidades de negócio.",
    isConnected: false,
    configFields: [
      { 
        name: "apiKey", 
        label: "API Key do CRM", 
        type: "password", 
        required: true,
        placeholder: "sk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
      },
      { 
        name: "accountId", 
        label: "ID da Conta", 
        type: "text", 
        required: true,
        placeholder: "acc_1234567890"
      },
      { 
        name: "webhookUrl", 
        label: "URL do Webhook n8n", 
        type: "url", 
        required: true,
        placeholder: "https://seu-n8n.com/webhook/crm"
      }
    ]
  },
  {
    agentType: "suporte_tecnico",
    serviceName: "Slack",
    serviceType: "slack",
    description: "Integre o Agente de Suporte Técnico com Slack para notificações automáticas de tickets e comunicação em tempo real com a equipe.",
    isConnected: false,
    configFields: [
      { 
        name: "botToken", 
        label: "Bot Token", 
        type: "password", 
        required: true,
        placeholder: "xoxb-xxxxxxxxxxxxxxx-xxxxxxxxxxxxxxx"
      },
      { 
        name: "workspaceId", 
        label: "ID do Workspace", 
        type: "text", 
        required: true,
        placeholder: "T1234567890"
      },
      { 
        name: "channelId", 
        label: "ID do Canal", 
        type: "text", 
        required: true,
        placeholder: "C1234567890"
      },
      { 
        name: "webhookUrl", 
        label: "URL do Webhook n8n", 
        type: "url", 
        required: true,
        placeholder: "https://seu-n8n.com/webhook/slack"
      }
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
  try {
    // Simulação de uma chamada a API externa baseada no tipo de serviço
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    switch (serviceType) {
      case 'google_sheets':
        // Simular validação do Google Sheets
        if (config.clientId && config.clientSecret && config.spreadsheetId) {
          console.log("Testando conexão com Google Sheets...");
          return true;
        }
        break;
        
      case 'crm':
        // Simular validação do CRM
        if (config.apiKey && config.accountId) {
          console.log("Testando conexão com CRM...");
          return true;
        }
        break;
        
      case 'slack':
        // Simular validação do Slack
        if (config.botToken && config.workspaceId && config.channelId) {
          console.log("Testando conexão com Slack...");
          return true;
        }
        break;
        
      default:
        return false;
    }
    
    return false;
  } catch (error) {
    console.error("Erro ao testar conexão:", error);
    return false;
  }
}
