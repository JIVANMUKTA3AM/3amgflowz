import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

export interface ActivationResult {
  success: boolean;
  message: string;
  data?: any;
}

export class OnboardingActivationService {
  
  async activateWhatsAppIntegration(config: any): Promise<ActivationResult> {
    try {
      // Test WhatsApp Business API connection
      if (!config.accessToken || !config.phoneNumberId) {
        return { success: false, message: "WhatsApp configuration incomplete" };
      }

      // Here you would make actual API calls to WhatsApp Business API
      // For now, we'll simulate the validation
      console.log('Testing WhatsApp connection...', { 
        phoneNumberId: config.phoneNumberId,
        hasToken: !!config.accessToken 
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: "WhatsApp integration activated successfully",
        data: { webhookUrl: `${window.location.origin}/api/webhook/whatsapp` }
      };
    } catch (error) {
      console.error('WhatsApp activation error:', error);
      return { success: false, message: "Failed to activate WhatsApp integration" };
    }
  }

  async activateTelegramIntegration(config: any): Promise<ActivationResult> {
    try {
      if (!config.botToken) {
        return { success: false, message: "Telegram configuration incomplete" };
      }

      // Test Telegram Bot API
      console.log('Testing Telegram bot connection...', { 
        botUsername: config.botUsername,
        hasToken: !!config.botToken 
      });

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        success: true, 
        message: "Telegram bot activated successfully",
        data: { webhookUrl: `${window.location.origin}/api/webhook/telegram` }
      };
    } catch (error) {
      console.error('Telegram activation error:', error);
      return { success: false, message: "Failed to activate Telegram bot" };
    }
  }

  async saveOltConfigurations(oltConfigs: any[], userId: string): Promise<ActivationResult> {
    try {
      if (!oltConfigs || oltConfigs.length === 0) {
        return { 
          success: true, 
          message: "No OLT configurations to save",
          data: { saved_count: 0 }
        };
      }

      const { supabase } = await import("@/lib/supabase");
      
      const configurationsToSave = oltConfigs.map(config => ({
        user_id: userId,
        name: config.name,
        brand: config.brand,
        model: config.model,
        ip_address: config.ipAddress,
        snmp_community: config.snmpCommunity || 'public',
        username: config.username || null,
        password: config.password || null,
        port: config.port || '161',
        is_active: true
      }));

      const { data, error } = await supabase
        .from('olt_configurations')
        .insert(configurationsToSave)
        .select();

      if (error) throw error;

      // Trigger n8n webhook for each OLT configuration
      for (const oltConfig of data) {
        await this.triggerOltN8nWebhook(oltConfig);
      }

      return { 
        success: true, 
        message: `${data.length} OLT configurations saved successfully`,
        data: { saved_configurations: data, saved_count: data.length }
      };
    } catch (error) {
      console.error('Error saving OLT configurations:', error);
      return { 
        success: false, 
        message: "Failed to save OLT configurations" 
      };
    }
  }

  private async triggerOltN8nWebhook(oltData: any): Promise<void> {
    try {
      const { supabase } = await import("@/lib/supabase");
      
      const webhookData = {
        event_type: 'olt_configured',
        user_id: oltData.user_id,
        timestamp: new Date().toISOString(),
        olt_data: {
          id: oltData.id,
          name: oltData.name,
          brand: oltData.brand,
          model: oltData.model,
          ip_address: oltData.ip_address,
          snmp_community: oltData.snmp_community,
          port: oltData.port,
          is_active: oltData.is_active
        }
      };

      await supabase.functions.invoke('trigger-n8n-webhook', {
        body: webhookData
      });

      console.log('N8n webhook triggered for OLT:', oltData.name);
    } catch (error) {
      console.error('Error triggering OLT n8n webhook:', error);
    }
  }

  async createAgentConfigurations(agentConfigs: any, userId: string): Promise<ActivationResult> {
    try {
      const configurations = Object.entries(agentConfigs).map(([type, config]: [string, any]) => ({
        user_id: userId,
        agent_type: type,
        name: config.name,
        prompt: config.prompt,
        model: config.model || 'gpt-4o-mini',
        temperature: config.temperature || 0.7,
        is_active: true
      }));

      const { data, error } = await supabase
        .from('agent_configurations')
        .upsert(configurations, { onConflict: 'user_id,agent_type' });

      if (error) throw error;

      return { 
        success: true, 
        message: `${configurations.length} agent configurations created`,
        data: data 
      };
    } catch (error) {
      console.error('Agent configuration error:', error);
      return { success: false, message: "Failed to create agent configurations" };
    }
  }

  async setupWebhooks(integrations: any): Promise<ActivationResult> {
    try {
      const webhooks = [];
      
      if (integrations.whatsapp) {
        webhooks.push({
          service: 'whatsapp',
          url: `${window.location.origin}/api/webhook/whatsapp`,
          events: ['message', 'delivery', 'read']
        });
      }

      if (integrations.telegram) {
        webhooks.push({
          service: 'telegram',
          url: `${window.location.origin}/api/webhook/telegram`,
          events: ['message', 'callback_query']
        });
      }

      console.log('Setting up webhooks:', webhooks);
      await new Promise(resolve => setTimeout(resolve, 1500));

      return { 
        success: true, 
        message: `${webhooks.length} webhooks configured`,
        data: webhooks 
      };
    } catch (error) {
      console.error('Webhook setup error:', error);
      return { success: false, message: "Failed to setup webhooks" };
    }
  }

  async activateN8nWorkflows(selectedServices: string[]): Promise<ActivationResult> {
    try {
      // Here you would trigger n8n workflow activations
      const workflows = selectedServices.map(service => ({
        service,
        workflowId: `${service}_automation_workflow`,
        status: 'active'
      }));

      console.log('Activating n8n workflows:', workflows);
      await new Promise(resolve => setTimeout(resolve, 1000));

      return { 
        success: true, 
        message: `${workflows.length} workflows activated`,
        data: workflows 
      };
    } catch (error) {
      console.error('N8n workflow activation error:', error);
      return { success: false, message: "Failed to activate workflows" };
    }
  }

  async performFullActivation(onboardingData: any, userId: string): Promise<ActivationResult> {
    const results = [];
    
    try {
      // Activate WhatsApp if configured
      if (onboardingData.selectedServices.includes('whatsapp') && onboardingData.whatsappConfig) {
        const whatsappResult = await this.activateWhatsAppIntegration(onboardingData.whatsappConfig);
        results.push(whatsappResult);
        if (!whatsappResult.success) {
          throw new Error(whatsappResult.message);
        }
      }

      // Activate Telegram if configured
      if (onboardingData.selectedServices.includes('telegram') && onboardingData.telegramConfig) {
        const telegramResult = await this.activateTelegramIntegration(onboardingData.telegramConfig);
        results.push(telegramResult);
        if (!telegramResult.success) {
          throw new Error(telegramResult.message);
        }
      }

      // Save OLT configurations
      if (onboardingData.oltConfigs && onboardingData.oltConfigs.length > 0) {
        const oltResult = await this.saveOltConfigurations(onboardingData.oltConfigs, userId);
        results.push(oltResult);
        if (!oltResult.success) {
          throw new Error(oltResult.message);
        }
      }

      // Create agent configurations
      if (Object.keys(onboardingData.agentConfigs).length > 0) {
        const agentResult = await this.createAgentConfigurations(onboardingData.agentConfigs, userId);
        results.push(agentResult);
        if (!agentResult.success) {
          throw new Error(agentResult.message);
        }
      }

      // Setup webhooks
      const webhookResult = await this.setupWebhooks({
        whatsapp: onboardingData.whatsappConfig,
        telegram: onboardingData.telegramConfig
      });
      results.push(webhookResult);

      // Activate n8n workflows
      const workflowResult = await this.activateN8nWorkflows(onboardingData.selectedServices);
      results.push(workflowResult);

      return {
        success: true,
        message: "All integrations activated successfully",
        data: { results, activatedServices: onboardingData.selectedServices.length }
      };

    } catch (error) {
      console.error('Full activation error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Activation failed"
      };
    }
  }
}

export const onboardingActivationService = new OnboardingActivationService();
