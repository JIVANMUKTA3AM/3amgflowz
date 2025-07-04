
import { useState } from "react";
import ServiceSelection from "./ServiceSelection";
import IntegrationsConfig from "./IntegrationsConfig";

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
  webhookConfig?: {
    url?: string;
    secret?: string;
  };
  agentConfigs: {
    atendimento: boolean;
    comercial: boolean;
    suporte_tecnico: boolean;
  };
  oltConfigs?: any[];
}

const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedServices: [],
    agentConfigs: {
      atendimento: false,
      comercial: false,
      suporte_tecnico: false,
    },
  });

  const handleNext = () => {
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
    </>
  );
};

export default OnboardingWizard;
