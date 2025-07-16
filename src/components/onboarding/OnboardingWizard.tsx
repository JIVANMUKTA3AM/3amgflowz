
import { useState } from "react";
import ServiceSelection from "./ServiceSelection";
import SubscriberCountStep from "./SubscriberCountStep";
import IntegrationsConfig from "./IntegrationsConfig";
import AgentConfiguration from "./AgentConfiguration";
import OLTConfiguration from "./OLTConfiguration";
import ReviewAndActivate from "./ReviewAndActivate";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/hooks/use-toast";

export interface OnboardingData {
  selectedServices: string[];
  numeroAssinantes: number;
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
  const { role } = useUserRole();
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedServices: [],
    numeroAssinantes: 0,
    agentConfigs: {},
    oltConfigs: []
  });

  const { saveConfig, completeOnboarding, isSaving, isCompleting } = useOnboardingConfig();

  const handleNext = () => {
    // Auto-save configuration on each step
    saveConfig({
      selected_services: onboardingData.selectedServices,
      numero_assinantes: onboardingData.numeroAssinantes,
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
        numero_assinantes: onboardingData.numeroAssinantes,
        agent_configs: onboardingData.agentConfigs,
        whatsapp_config: onboardingData.whatsappConfig,
        olt_configs: onboardingData.oltConfigs || [],
        is_completed: true
      });
      
      toast({
        title: "Onboarding Concluído!",
        description: role === 'admin' 
          ? "Teste concluído com sucesso! Os dados foram salvos para demonstração."
          : "Suas configurações foram ativadas com sucesso.",
      });

      // Redirecionar baseado no tipo de usuário
      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/subscription';
        }
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
        <SubscriberCountStep
          subscriberCount={onboardingData.numeroAssinantes}
          onSubscriberCountChange={(count) => handleUpdate({ numeroAssinantes: count })}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {step === 3 && (
        <IntegrationsConfig
          selectedServices={onboardingData.selectedServices}
          onboardingData={onboardingData}
          onUpdate={handleUpdate}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {step === 4 && (
        <AgentConfiguration
          selectedServices={onboardingData.selectedServices}
          agentConfigs={onboardingData.agentConfigs}
          onUpdate={(configs) => handleUpdate({ agentConfigs: configs })}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {step === 5 && (
        <OLTConfiguration
          selectedServices={onboardingData.selectedServices}
          oltConfigs={onboardingData.oltConfigs || []}
          onUpdate={(configs) => handleUpdate({ oltConfigs: configs })}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}

      {step === 6 && (
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
