
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Zap, Smartphone, Mail, Database, MessageSquare, Edit, TestTube } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAgentIntegrations } from "@/hooks/useAgentIntegrations";

interface AgentIntegrationsProps {
  integrations: any[];
  onEdit?: (integration: any) => void;
}

const AgentIntegrations = ({ integrations, onEdit }: AgentIntegrationsProps) => {
  const { testIntegration, isTesting } = useAgentIntegrations();

  const getIntegrationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'whatsapp': return <Smartphone className="w-4 h-4 text-green-600" />;
      case 'slack': return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'email': return <Mail className="w-4 h-4 text-blue-600" />;
      case 'database': return <Database className="w-4 h-4 text-gray-600" />;
      case 'crm': return <Zap className="w-4 h-4 text-orange-600" />;
      default: return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-500" : "bg-gray-500";
  };

  const handleTest = (integrationId: string) => {
    testIntegration(integrationId);
  };

  if (!integrations || integrations.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Database className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma integração configurada
          </h3>
          <p className="text-gray-600">
            Configure integrações para conectar seus agentes com serviços externos.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        {integrations.length} integração{integrations.length !== 1 ? 'ões' : ''} configurada{integrations.length !== 1 ? 's' : ''}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIntegrationIcon(integration.integration_type)}
                  <CardTitle className="text-base">{integration.integration_name}</CardTitle>
                </div>
                <Badge className={getStatusColor(integration.is_active)}>
                  {integration.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                Agente: {integration.agent_configurations?.name}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs space-y-1">
                  <p><span className="text-gray-600">Tipo:</span> {integration.integration_type}</p>
                  {integration.last_sync_at && (
                    <p>
                      <span className="text-gray-600">Última sincronização:</span>{' '}
                      {formatDistanceToNow(new Date(integration.last_sync_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {onEdit && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => onEdit(integration)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleTest(integration.id)}
                    disabled={isTesting}
                    className="flex-1"
                  >
                    <TestTube className="w-3 h-3 mr-1" />
                    Testar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgentIntegrations;
