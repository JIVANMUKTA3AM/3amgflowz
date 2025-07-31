
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ProviderData {
  name: string;
  cnpj_id: string;
  contact: string;
}

export interface SNMPConfig {
  olt_brand: string;
  olt_model: string;
  olt_ip: string;
  snmp_version: string;
  snmp_cred: string;
  snmp_port: string;
  timeout: string;
}

export interface APIConfig {
  api_base_url: string;
  api_token: string;
  api_endpoints: string[];
}

export interface IntegrationData {
  snmp_enabled: boolean;
  api_enabled: boolean;
  snmp_config: SNMPConfig;
  api_config: APIConfig;
  mode: 'snmp' | 'rest_api' | 'manual';
}

export interface OnboardingData {
  selectedChannels: string[];
  selectedAgents: string[];
  providerData: ProviderData;
  integrationData: IntegrationData;
}

export const useProviderOnboarding = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const saveProvider = async (providerData: ProviderData) => {
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('providers')
      .insert({
        user_id: user.id,
        name: providerData.name,
        cnpj_id: providerData.cnpj_id,
        contact: providerData.contact
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const saveIntegration = async (providerId: string, integrationData: IntegrationData) => {
    if (!user) throw new Error('User not authenticated');
    
    const credentials = integrationData.mode === 'snmp' 
      ? {
          ip: integrationData.snmp_config.olt_ip,
          brand: integrationData.snmp_config.olt_brand,
          model: integrationData.snmp_config.olt_model,
          version: integrationData.snmp_config.snmp_version,
          communityOrUser: integrationData.snmp_config.snmp_cred,
          port: integrationData.snmp_config.snmp_port,
          timeout: integrationData.snmp_config.timeout
        }
      : integrationData.mode === 'rest_api'
      ? {
          baseUrl: integrationData.api_config.api_base_url,
          token: integrationData.api_config.api_token,
          endpoints: integrationData.api_config.api_endpoints
        }
      : {};

    const { data, error } = await supabase
      .from('provider_integrations')
      .insert({
        provider_id: providerId,
        integration_type: integrationData.mode,
        mode: integrationData.mode,
        credentials,
        polling_interval_secs: 300,
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  const completeOnboarding = async (onboardingData: OnboardingData) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    
    try {
      // 1. Salvar dados do provedor
      const provider = await saveProvider(onboardingData.providerData);
      
      // 2. Salvar configurações de integração
      if (onboardingData.integrationData.mode !== 'manual') {
        await saveIntegration(provider.id, onboardingData.integrationData);
      }
      
      // 3. Trigger n8n webhook (automático via trigger do banco)
      await supabase.functions.invoke('trigger-n8n-webhook', {
        body: {
          event_type: 'provider_created',
          user_id: user.id,
          provider_id: provider.id,
          channels: onboardingData.selectedChannels,
          agents: onboardingData.selectedAgents,
          mode: onboardingData.integrationData.mode
        }
      });

      toast({
        title: "Onboarding concluído!",
        description: "Seu provedor foi configurado com sucesso.",
      });

      return provider;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erro no onboarding",
        description: "Não foi possível completar a configuração. Tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    completeOnboarding,
    isLoading
  };
};
