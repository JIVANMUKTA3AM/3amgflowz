
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ServiceSelection from "./ServiceSelection";
import ProviderRegistration from "./ProviderRegistration";
import SubscriberCountStep from "./SubscriberCountStep";
import ChannelAgentSelection from "./ChannelAgentSelection";
import IntegrationsSetup from "./IntegrationsSetup";
import ReviewAndActivate from "./ReviewAndActivate";
import FinalActivation from "./FinalActivation";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";

export interface OnboardingData {
  selectedServices: string[];
  providerData: any;
  subscriberCount: number;
  channelConfigs: any;
  integrations: any;
}

const STEPS = [
  { key: "services", title: "Seleção de Serviços", description: "Escolha os serviços que deseja contratar" },
  { key: "provider", title: "Dados do Provedor", description: "Informações da sua empresa" },
  { key: "subscribers", title: "Número de Assinantes", description: "Quantos clientes você atende" },
  { key: "channels", title: "Canais e Agentes", description: "Configure seus canais de atendimento" },
  { key: "integrations", title: "Integrações", description: "Configure integrações externas" },
  { key: "review", title: "Revisão", description: "Revise suas configurações" },
  { key: "activation", title: "Ativação", description: "Ative seus serviços" },
];

export const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { config, saveConfig, completeOnboarding, isSaving, isCompleting } = useOnboardingConfig();
  const [currentStep, setCurrentStep] = useState(0);

  // State for onboarding data
  const [selectedServices, setSelectedServices] = useState<string[]>(config?.selected_services || []);
  const [providerData, setProviderData] = useState<any>({});
  const [subscriberCount, setSubscriberCount] = useState(config?.numero_assinantes || 0);
  const [channelConfigs, setChannelConfigs] = useState<any>({});
  const [integrations, setIntegrations] = useState<any>({});

  const currentStepKey = STEPS[currentStep]?.key;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      const finalConfig = {
        selected_services: selectedServices,
        numero_assinantes: subscriberCount,
        agent_configs: channelConfigs,
        whatsapp_config: integrations.whatsapp,
        olt_configs: integrations.olt || [],
        is_completed: true
      };
      
      await completeOnboarding(finalConfig);
      // Redirecionar para dashboard após conclusão
      setTimeout(() => {
        navigate('/client-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (currentStepKey) {
      case "services":
        return (
          <ServiceSelection
            selectedServices={selectedServices}
            onServicesChange={(services) => setSelectedServices(services)}
            onNext={handleNext}
            onPrevious={() => {}}
          />
        );
      
      case "provider":
        return (
          <ProviderRegistration
            providerData={providerData}
            onProviderDataChange={(data) => setProviderData(data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      
      case "subscribers":
        return (
          <SubscriberCountStep
            subscriberCount={subscriberCount}
            onSubscriberCountChange={(count) => setSubscriberCount(count)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      
      case "channels":
        return (
          <ChannelAgentSelection
            selectedChannels={channelConfigs.channels || []}
            selectedAgents={channelConfigs.agents || []}
            onChannelsChange={(channels) => setChannelConfigs({...channelConfigs, channels})}
            onAgentsChange={(agents) => setChannelConfigs({...channelConfigs, agents})}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      
      case "integrations":
        return (
          <IntegrationsSetup
            selectedServices={selectedServices}
            integrations={integrations}
            onUpdate={(integrations) => setIntegrations(integrations)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      
      case "review":
        return (
          <ReviewAndActivate
            selectedServices={selectedServices}
            selectedChannels={channelConfigs.channels || []}
            selectedAgents={channelConfigs.agents || []}
            subscriberCount={subscriberCount}
            integrationData={integrations}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      
      case "activation":
        return (
          <FinalActivation
            onComplete={handleComplete}
            onPrevious={handlePrevious}
            isCompleting={isCompleting}
          />
        );
      
      default:
        return <div>Step not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Início
            </Button>
            <div className="text-sm text-gray-600">
              Passo {currentStep + 1} de {STEPS.length}
            </div>
          </div>
          
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {STEPS[currentStep]?.title}
            </h1>
            <p className="text-gray-600">
              {STEPS[currentStep]?.description}
            </p>
          </div>
          
          <Progress value={progressPercentage} className="w-full" />
        </div>

        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
