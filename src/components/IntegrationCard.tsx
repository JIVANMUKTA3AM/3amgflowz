
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ExternalLink } from "lucide-react";
import { AgentIntegration, IntegrationConfig, saveIntegrationConfig, testIntegrationConnection } from "@/services/integrations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type IntegrationCardProps = {
  integration: AgentIntegration;
  existingConfig?: IntegrationConfig | null;
  onStatusChange: (connected: boolean) => void;
};

const IntegrationCard = ({ integration, existingConfig, onStatusChange }: IntegrationCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [config, setConfig] = useState<IntegrationConfig>(
    existingConfig || {
      type: integration.serviceType,
      isConnected: false,
    }
  );

  const handleInputChange = (field: string, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Validar campos obrigatórios
      const missingFields = integration.configFields
        .filter((field) => field.required && !config[field.name as keyof IntegrationConfig])
        .map((field) => field.label);

      if (missingFields.length > 0) {
        toast({
          title: "Campos obrigatórios",
          description: `Por favor, preencha os seguintes campos: ${missingFields.join(", ")}`,
          variant: "destructive",
        });
        return;
      }

      const success = await saveIntegrationConfig(integration.agentType, config);
      
      if (success) {
        toast({
          title: "Configuração salva",
          description: `A integração com ${integration.serviceName} foi configurada com sucesso.`,
        });
        onStatusChange(config.isConnected);
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível salvar a configuração.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar configuração:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a configuração.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const isConnected = await testIntegrationConnection(integration.serviceType, config);
      
      setConfig((prev) => ({ ...prev, isConnected }));
      
      if (isConnected) {
        toast({
          title: "Conexão bem-sucedida",
          description: `A conexão com ${integration.serviceName} foi estabelecida com sucesso.`,
        });
        onStatusChange(true);
      } else {
        toast({
          title: "Falha na conexão",
          description: "Não foi possível estabelecer conexão. Verifique suas credenciais.",
          variant: "destructive",
        });
        onStatusChange(false);
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao testar a conexão.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{integration.serviceName}</CardTitle>
            <CardDescription>{integration.description}</CardDescription>
          </div>
          {config.isConnected && (
            <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              <Check className="h-3 w-3" />
              <span>Conectado</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {integration.configFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={`${integration.agentType}-${field.name}`}>{field.label}</Label>
            <Input
              id={`${integration.agentType}-${field.name}`}
              type={field.type}
              value={(config[field.name as keyof IntegrationConfig] as string) || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={`Digite ${field.label.toLowerCase()}`}
              required={field.required}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleTestConnection}
          disabled={isTesting || isLoading}
        >
          {isTesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Testar Conexão
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading || isTesting}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Salvar Configuração
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IntegrationCard;
