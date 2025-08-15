
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, ArrowLeft, Users, CreditCard } from "lucide-react";
import ServiceSelection from "./ServiceSelection";
import ChannelAgentSelection from "./ChannelAgentSelection";
import SubscriberCountStep from "./SubscriberCountStep";
import IntegrationConfiguration from "./IntegrationConfiguration";
import ReviewAndActivate from "./ReviewAndActivate";
import PostOnboardingPayment from "./PostOnboardingPayment";
import FinalActivation from "./FinalActivation";
import { useOnboardingNavigation } from "@/hooks/useOnboardingNavigation";
import { useOnboardingConfig } from "@/hooks/useOnboardingConfig";

const NewOnboardingWizard = () => {
  const { currentStep, nextStep, previousStep, goToStep } = useOnboardingNavigation();
  const { config, saveConfig, completeOnboarding, isSaving, isCompleting } = useOnboardingConfig();
  
  const [selectedServices, setSelectedServices] = useState<string[]>(config?.selected_services || []);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [subscriberCount, setSubscriberCount] = useState(config?.numero_assinantes || 0);
  const [integrationData, setIntegrationData] = useState<any>(config ? {
    whatsapp: config.whatsapp_config,
    olt: config.olt_configs || []
  } : {});
  
  const steps = [
    { id: 1, name: "Serviços", description: "Selecione os serviços desejados", icon: CheckCircle },
    { id: 2, name: "Assinantes", description: "Informe o número de assinantes", icon: Users },
    { id: 3, name: "Canais e Agentes", description: "Configure canais e agentes", icon: CheckCircle },
    { id: 4, name: "Integrações", description: "Configure suas integrações", icon: CheckCircle },
    { id: 5, name: "Revisão", description: "Revise suas configurações", icon: CheckCircle },
    { id: 6, name: "Pagamento", description: "Escolha seu plano", icon: CreditCard },
    { id: 7, name: "Ativação", description: "Active sua conta", icon: CheckCircle }
  ];

  const handleNext = () => {
    // Salvar dados do step atual
    const configData = {
      selected_services: selectedServices,
      numero_assinantes: subscriberCount,
      agent_configs: {
        channels: selectedChannels,
        agents: selectedAgents
      },
      whatsapp_config: integrationData.whatsapp,
      olt_configs: integrationData.olt || [],
      is_completed: false
    };
    
    saveConfig(configData);
    nextStep();
  };

  const handlePaymentComplete = () => {
    // Avançar para ativação final após pagamento
    nextStep();
  };

  const handleComplete = async () => {
    const finalConfig = {
      selected_services: selectedServices,
      numero_assinantes: subscriberCount,
      agent_configs: {
        channels: selectedChannels,
        agents: selectedAgents
      },
      whatsapp_config: integrationData.whatsapp,
      olt_configs: integrationData.olt || [],
      is_completed: true
    };
    
    completeOnboarding(finalConfig);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8 overflow-x-auto">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div 
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id 
                ? 'bg-3amg-orange border-3amg-orange text-white' 
                : 'bg-gray-900 border-gray-600 text-gray-400'
            }`}
          >
            {currentStep > step.id ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          <div className="ml-2 text-sm">
            <div className={`font-medium ${currentStep >= step.id ? 'text-3amg-orange' : 'text-gray-500'}`}>
              {step.name}
            </div>
            <div className="text-gray-400 text-xs">{step.description}</div>
          </div>
          {index < steps.length - 1 && (
            <ArrowRight className="mx-4 w-4 h-4 text-gray-600" />
          )}
        </div>
      ))}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelection
            selectedServices={selectedServices}
            onServicesChange={setSelectedServices}
            onNext={handleNext}
            onPrevious={() => {}}
          />
        );
      
      case 2:
        return (
          <SubscriberCountStep
            subscriberCount={subscriberCount}
            onSubscriberCountChange={setSubscriberCount}
            onNext={handleNext}
            onPrevious={previousStep}
          />
        );
      
      case 3:
        return (
          <ChannelAgentSelection
            selectedChannels={selectedChannels}
            selectedAgents={selectedAgents}
            onChannelsChange={setSelectedChannels}
            onAgentsChange={setSelectedAgents}
            onNext={handleNext}
            onPrevious={previousStep}
          />
        );
      
      case 4:
        return (
          <IntegrationConfiguration
            integrationData={integrationData}
            onIntegrationDataChange={setIntegrationData}
            onNext={handleNext}
            onPrevious={previousStep}
          />
        );
      
      case 5:
        return (
          <ReviewAndActivate
            selectedServices={selectedServices}
            selectedChannels={selectedChannels}
            selectedAgents={selectedAgents}
            subscriberCount={subscriberCount}
            integrationData={integrationData}
            onNext={handleNext}
            onPrevious={previousStep}
          />
        );
      
      case 6:
        return (
          <PostOnboardingPayment
            selectedServices={selectedServices}
            subscriberCount={subscriberCount}
            onPaymentComplete={handlePaymentComplete}
            onPrevious={previousStep}
          />
        );
      
      case 7:
        return (
          <FinalActivation
            onComplete={handleComplete}
            onPrevious={previousStep}
            isCompleting={isCompleting}
          />
        );
      
      default:
        return <div>Step não encontrado</div>;
    }
  };

  return (
    <div className="min-h-screen bg-3amg-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Configuração da sua conta Flow
          </h1>
          <p className="text-lg text-gray-300">
            Vamos configurar sua plataforma de agentes IA em poucos passos
          </p>
        </div>

        {renderStepIndicator()}
        
        <div className="max-w-6xl mx-auto">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default NewOnboardingWizard;
