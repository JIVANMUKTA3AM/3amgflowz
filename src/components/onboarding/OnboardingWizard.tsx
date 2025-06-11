
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import ServiceSelection from "./ServiceSelection";
import IntegrationsConfig from "./IntegrationsConfig";
import OLTConfiguration from "./OLTConfiguration";
import ReviewAndActivate from "./ReviewAndActivate";

export interface OnboardingData {
  selectedServices: string[];
  whatsappConfig?: any;
  crmConfig?: any;
  oltConfigs?: any[];
  webhookConfig?: any;
}

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedServices: [],
    oltConfigs: []
  });

  const steps = [
    { id: 1, title: "Serviços", description: "Escolha os serviços que deseja ativar" },
    { id: 2, title: "Integrações", description: "Configure as APIs dos serviços" },
    { id: 3, title: "OLTs", description: "Configure suas OLTs (se aplicável)" },
    { id: 4, title: "Ativação", description: "Revisar e ativar automações" }
  ];

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedServices={onboardingData.selectedServices}
            onUpdate={(services) => updateOnboardingData({ selectedServices: services })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <IntegrationsConfig
            selectedServices={onboardingData.selectedServices}
            onboardingData={onboardingData}
            onUpdate={updateOnboardingData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <OLTConfiguration
            selectedServices={onboardingData.selectedServices}
            oltConfigs={onboardingData.oltConfigs || []}
            onUpdate={(configs) => updateOnboardingData({ oltConfigs: configs })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <ReviewAndActivate
            onboardingData={onboardingData}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-3amg-purple/10 via-white to-3amg-blue/10 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-3amg bg-clip-text text-transparent mb-4">
            Bem-vindo à 3AMG!
          </h1>
          <p className="text-xl text-gray-600">
            Vamos configurar sua plataforma em alguns passos simples
          </p>
        </div>

        {/* Progress */}
        <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Etapa {currentStep} de {totalSteps}
              </span>
              <span className="text-sm font-medium text-3amg-purple">
                {Math.round(progress)}% concluído
              </span>
            </div>
            <Progress value={progress} className="mb-6" />
            
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-300 ${
                    completedSteps.includes(step.id) 
                      ? 'bg-green-500 text-white' 
                      : currentStep === step.id 
                        ? 'bg-gradient-3amg text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {completedSteps.includes(step.id) ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500 max-w-20">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {renderStepContent()}
      </div>
    </div>
  );
};

export default OnboardingWizard;
