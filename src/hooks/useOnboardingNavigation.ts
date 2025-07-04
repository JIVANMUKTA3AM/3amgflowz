
import { useState, useEffect } from 'react';
import { useOnboardingConfig } from './useOnboardingConfig';

export const useOnboardingNavigation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { config, isLoading } = useOnboardingConfig();

  // Auto-detect step based on configuration completeness
  useEffect(() => {
    if (!config || isLoading) return;

    // If onboarding is completed, redirect to dashboard
    if (config.is_completed) {
      window.location.href = '/client-dashboard';
      return;
    }

    // Determine current step based on what's configured
    if (!config.selected_services || config.selected_services.length === 0) {
      setCurrentStep(1); // Service Selection
    } else if (needsIntegrationConfig(config)) {
      setCurrentStep(2); // Integrations Config
    } else if (needsAgentConfig(config)) {
      setCurrentStep(3); // Agent Configuration
    } else if (needsOLTConfig(config)) {
      setCurrentStep(4); // OLT Configuration
    } else {
      setCurrentStep(5); // Review and Activate
    }
  }, [config, isLoading]);

  const needsIntegrationConfig = (config: any) => {
    const services = config.selected_services || [];
    
    if (services.includes('whatsapp') && !config.whatsapp_config?.accessToken) {
      return true;
    }
    
    if (services.includes('telegram') && !config.telegram_config?.botToken) {
      return true;
    }
    
    return false;
  };

  const needsAgentConfig = (config: any) => {
    const services = config.selected_services || [];
    const agentServices = services.filter((s: string) => 
      ['atendimento', 'comercial', 'suporte_tecnico'].includes(s)
    );
    
    return agentServices.some((service: string) => {
      const agentConfig = config.agent_configs?.[service];
      return !agentConfig?.name || !agentConfig?.prompt;
    });
  };

  const needsOLTConfig = (config: any) => {
    const services = config.selected_services || [];
    return services.includes('olt') && (!config.olt_configs || config.olt_configs.length === 0);
  };

  return {
    currentStep,
    setCurrentStep,
    isLoading
  };
};
