
import { useState } from "react";
import ServiceSelection from "./ServiceSelection";
import IntegrationsConfig from "./IntegrationsConfig";
import AgentConfiguration from "./AgentConfiguration";
import OLTConfiguration from "./OLTConfiguration";
import ReviewAndActivate from "./ReviewAndActivate";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";
import { toast } from "@/hooks/use-toast";

export interface OnboardingData {
  selectedServices: string[];
  whatsappConfig?: {
    phoneNumberId?: string;
    accessToken?: string;
    webhookUrl?: string;
    verifyToken?: string;
  };
  telegramConfig?: {
    botToken?: string;
    botUsername?: string;
    webhookUrl?: string;
  };
  agentConfigs: any;
  oltConfigs?: any[];
}

const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedServices: [],
    agentConfigs: {},
    oltConfigs: []
  });

  const { saveConfig, completeOnboarding, isSaving, isCompleting } = useOnboardingConfig();

  const handleNext = () => {
    // Auto-save configuration on each step
    saveConfig({
      selected_services: onboardingData.selectedServices,
      agent_configs: onboardingData.agentConfigs,
      whatsapp_config: onboardingData.whatsappConfig,
      olt_configs: onboardingData.oltConfigs || [],
      is_completed: false
    });
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleUpdate = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleComplete = async () => {
    try {
      await completeOnboarding({
        selected_services: onboardingData.selectedServices,
        agent_configs: onboardingData.agentConfigs,
        whatsapp_config: onboardingData.whatsappConfig,
        olt_configs: onboardingData.oltConfigs || [],
        is_completed: true
      });
      
      toast({
        title: "Onboarding Concluído!",
        description: "Suas configurações foram ativadas com sucesso.",
      });

      // Redirect to client dashboard
      setTimeout(() => {
        window.location.href = '/client-dashboard';
      }, 2000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Erro na Ativação",
        description: "Houve um erro ao ativar suas automações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {step === 1 && (
        <ServiceSelection
          selectedServices={onboardingData.selectedServices}
          onServicesChange={(services) => handleUpdate({ selectedServices: services })}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {step === 2 && (
        <IntegrationsConfig
          selectedServices={onboardingData.selectedServices}
          onboardingData={onboardingData}
          onUpdate={handleUpdate}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {step === 3 && (
        <AgentConfiguration
          selectedServices={onboardingData.selectedServices}
          agentConfigs={onboardingData.agentConfigs}
          onUpdate={(configs) => handleUpdate({ agentConfigs: configs })}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {step === 4 && (
        <OLTConfiguration
          selectedServices={onboardingData.selectedServices}
          oltConfigs={onboardingData.oltConfigs || []}
          onUpdate={(configs) => handleUpdate({ oltConfigs: configs })}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {step === 5 && (
        <ReviewAndActivate
          onboardingData={onboardingData}
          onPrevious={handlePrevious}
          onComplete={handleComplete}
          isCompleting={isCompleting}
        />
      )}
    </>
  );
};

export default OnboardingWizard;
