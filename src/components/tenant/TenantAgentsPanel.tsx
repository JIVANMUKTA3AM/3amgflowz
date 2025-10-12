import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Power, Settings2 } from 'lucide-react';
import { useTenantAgents } from '@/hooks/useTenantAgents';

interface TenantAgentsPanelProps {
  tenantId: string;
}

const SETOR_LABELS = {
  triagem: 'Triagem',
  tecnico: 'Técnico',
  comercial: 'Comercial',
  financeiro: 'Financeiro'
};

const TIPO_LABELS = {
  externo: 'Externo',
  interno: 'Interno'
};

export const TenantAgentsPanel = ({ tenantId }: TenantAgentsPanelProps) => {
  const { agents, isLoading, updateAgent } = useTenantAgents(tenantId);

  const toggleAgentStatus = (agentId: string, currentStatus: boolean) => {
    updateAgent({
      id: agentId,
      updates: { ativo: !currentStatus }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Carregando agentes...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Agentes Configurados
              </CardTitle>
              <CardDescription>
                Gerencie os agentes de IA do seu provedor
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!agents || agents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Nenhum agente configurado</p>
              <p className="text-sm">Clique em "Novo Agente" para começar</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {agents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{agent.nome}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {SETOR_LABELS[agent.setor]}
                          </Badge>
                          <Badge variant="secondary">
                            {TIPO_LABELS[agent.tipo]}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={agent.ativo ? 'default' : 'outline'}
                        onClick={() => toggleAgentStatus(agent.id, agent.ativo)}
                      >
                        <Power className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Prompt Reference
                      </label>
                      <p className="text-sm font-mono">{agent.prompt_ref}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings2 className="h-3 w-3 mr-1" />
                        Configurar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
