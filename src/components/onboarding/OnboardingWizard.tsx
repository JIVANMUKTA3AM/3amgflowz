
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import ServiceSelection from "./ServiceSelection";
import AgentConfiguration from "./AgentConfiguration";
import IntegrationsSetup from "./IntegrationsSetup";
import FinalActivation from "./FinalActivation";

export interface OnboardingData {
  selectedServices: string[];
  agentConfigs: {
    atendimento?: any;
    tecnico?: any;
    comercial?: any;
  };
  integrations: {
    whatsapp?: any;
    oltConfig?: any[];
  };
}

const OnboardingWizard = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    selectedServices: [],
    agentConfigs: {},
    integrations: {}
  });

  const steps = [
    { id: 1, title: "Serviços", description: "Escolha os agentes que deseja ativar" },
    { id: 2, title: "Configuração", description: "Configure seus agentes de IA" },
    { id: 3, title: "Integrações", description: "Configure WhatsApp e OLTs" },
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

  const handleComplete = async () => {
    try {
      // Atualizar perfil para marcar onboarding como completo
      await updateProfile({
        agent_settings: {
          ...profile?.agent_settings,
          onboarding_completed: true,
          configured_services: onboardingData.selectedServices,
          setup_date: new Date().toISOString()
        }
      });

      // Redirecionar para dashboard do cliente
      navigate("/client-dashboard");
    } catch (error) {
      console.error("Erro ao completar onboarding:", error);
    }
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
          <AgentConfiguration
            selectedServices={onboardingData.selectedServices}
            agentConfigs={onboardingData.agentConfigs}
            onUpdate={(configs) => updateOnboardingData({ agentConfigs: configs })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <IntegrationsSetup
            selectedServices={onboardingData.selectedServices}
            integrations={onboardingData.integrations}
            onUpdate={(integrations) => updateOnboardingData({ integrations })}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <FinalActivation
            onboardingData={onboardingData}
            onComplete={handleComplete}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Bem-vindo ao AgentFlow!
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
              <span className="text-sm font-medium text-blue-600">
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
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
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
