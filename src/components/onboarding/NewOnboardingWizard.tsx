
import { useState } from "react";
import ChannelAgentSelection from "./ChannelAgentSelection";
import ProviderRegistration from "./ProviderRegistration";
import IntegrationConfiguration from "./IntegrationConfiguration";
import { useProviderOnboarding } from "@/hooks/useProviderOnboarding";
import type { OnboardingData, ProviderData, IntegrationData } from "@/hooks/useProviderOnboarding";

const NewOnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const { completeOnboarding, isLoading } = useProviderOnboarding();
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedChannels: [],
    selectedAgents: [],
    providerData: {
      name: '',
      cnpj_id: '',
      contact: ''
    },
    integrationData: {
      snmp_enabled: false,
      api_enabled: false,
      snmp_config: {
        olt_brand: '',
        olt_model: '',
        olt_ip: '',
        snmp_version: 'v2c',
        snmp_cred: 'public',
        snmp_port: '161',
        timeout: '5000'
      },
      api_config: {
        api_base_url: '',
        api_token: '',
        api_endpoints: []
      },
      mode: 'manual'
    }
  });

  const handleChannelsChange = (channels: string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      selectedChannels: channels
    }));
  };

  const handleAgentsChange = (agents: string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      selectedAgents: agents
    }));
  };

  const handleProviderDataChange = (data: ProviderData) => {
    setOnboardingData(prev => ({
      ...prev,
      providerData: data
    }));
  };

  const handleIntegrationDataChange = (data: IntegrationData) => {
    setOnboardingData(prev => ({
      ...prev,
      integrationData: data
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding(onboardingData);
      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
    }
  };

  return (
    <>
      {step === 1 && (
        <ChannelAgentSelection
          selectedChannels={onboardingData.selectedChannels}
          selectedAgents={onboardingData.selectedAgents}
          onChannelsChange={handleChannelsChange}
          onAgentsChange={handleAgentsChange}
          onNext={handleNext}
        />
      )}

      {step === 2 && (
        <ProviderRegistration
          providerData={onboardingData.providerData}
          onProviderDataChange={handleProviderDataChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {step === 3 && (
        <IntegrationConfiguration
          integrationData={onboardingData.integrationData}
          onIntegrationDataChange={handleIntegrationDataChange}
          onNext={handleComplete}
          onPrevious={handlePrevious}
        />
      )}
    </>
  );
};

export default NewOnboardingWizard;
