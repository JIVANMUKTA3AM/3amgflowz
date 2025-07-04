
import { useState } from "react";
import ServiceSelection from "./ServiceSelection";
import IntegrationsConfig from "./IntegrationsConfig";
import AgentConfiguration from "./AgentConfiguration";
import OLTConfiguration from "./OLTConfiguration";
import ReviewAndActivate from "./ReviewAndActivate";

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
        />
      )}
    </>
  );
};

export default OnboardingWizard;
