
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Bot, 
  Smartphone, 
  MessageSquare, 
  Headphones, 
  Wrench, 
  DollarSign,
  Zap,
  Clock,
  CheckCircle,
  Copy
} from "lucide-react";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import { useAgentWorkflows } from "@/hooks/useAgentWorkflows";
import { toast } from "@/components/ui/use-toast";

const workflowTemplates = [
  {
    id: 'atendimento-whatsapp',
    name: 'Atendimento WhatsApp',
    description: 'Resposta automática no WhatsApp para suporte técnico',
    icon: Smartphone,
    category: 'Atendimento',
    agentType: 'atendimento',
    triggers: ['Nova mensagem WhatsApp', 'Palavra-chave específica'],
    actions: ['Classificar problema', 'Enviar resposta automática', 'Escalar para técnico'],
    estimatedTime: '2-3 min',
    webhookTemplate: 'https://n8n.seudominio.com/webhook/whatsapp-atendimento'
  },
  {
    id: 'suporte-tecnico',
    name: 'Suporte Técnico SNMP',
    description: 'Diagnóstico automático de problemas na rede',
    icon: Wrench,
    category: 'Técnico',
    agentType: 'suporte_tecnico',
    triggers: ['Alerta SNMP', 'Ticket aberto', 'Cliente reporta problema'],
    actions: ['Verificar status OLT', 'Diagnosticar ONT', 'Gerar relatório'],
    estimatedTime: '1-2 min',
    webhookTemplate: 'https://n8n.seudominio.com/webhook/suporte-tecnico'
  },
  {
    id: 'vendas-comercial',
    name: 'Vendas e Comercial',
    description: 'Qualificação de leads e propostas comerciais',
    icon: DollarSign,
    category: 'Comercial',
    agentType: 'comercial',
    triggers: ['Novo lead', 'Interesse em plano', 'Solicitação de orçamento'],
    actions: ['Qualificar lead', 'Enviar proposta', 'Agendar visita'],
    estimatedTime: '3-5 min',
    webhookTemplate: 'https://n8n.seudominio.com/webhook/vendas'
  },
  {
    id: 'cobranca-financeiro',
    name: 'Cobrança e Financeiro',
    description: 'Gestão automática de cobranças e pagamentos',
    icon: Clock,
    category: 'Financeiro',
    agentType: 'atendimento',
    triggers: ['Fatura vencida', 'Pagamento confirmado', 'Negociação'],
    actions: ['Enviar lembrete', 'Oferecer parcelamento', 'Atualizar status'],
    estimatedTime: '1-2 min',
    webhookTemplate: 'https://n8n.seudominio.com/webhook/cobranca'
  }
];

const QuickWorkflowSetup = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [workflowData, setWorkflowData] = useState({
    name: "",
    webhookUrl: "",
    agentId: "",
    autoActivate: true,
    description: ""
  });

  const { configurations } = useAgentConfigurations();
  const { createWorkflow, isCreatingWorkflow } = useAgentWorkflows();

  const handleTemplateSelect = (templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setWorkflowData({
        name: template.name,
        webhookUrl: template.webhookTemplate,
        agentId: "",
        autoActivate: true,
        description: template.description
      });
      setShowCustomConfig(true);
    }
  };

  const handleCreateWorkflow = () => {
    if (!workflowData.agentId || !workflowData.webhookUrl) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um agente e configure a URL do webhook.",
        variant: "destructive",
      });
      return;
    }

    createWorkflow({
      agent_configuration_id: workflowData.agentId,
      workflow_name: workflowData.name,
      workflow_type: "n8n",
      webhook_url: workflowData.webhookUrl,
      is_active: workflowData.autoActivate,
      configuration: {
        template_id: selectedTemplate,
        auto_created: true,
        provider_focused: true
      }
    });

    // Reset form
    setSelectedTemplate("");
    setShowCustomConfig(false);
    setWorkflowData({
      name: "",
      webhookUrl: "",
      agentId: "",
      autoActivate: true,
      description: ""
    });
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada!",
      description: "URL do webhook copiada para a área de transferência.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Setup Rápido de Workflows
        </h2>
        <p className="text-gray-600">
          Configure rapidamente workflows para seus agentes atenderem provedores
        </p>
      </div>

      {!showCustomConfig ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflowTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <template.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Setup</div>
                    <div className="font-medium text-green-600">{template.estimatedTime}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-700">Triggers:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.triggers.slice(0, 2).map((trigger, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                      {template.triggers.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.triggers.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs font-medium text-gray-700">Ações:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.actions.slice(0, 2).map((action, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                      {template.actions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.actions.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Configurar Workflow: {workflowData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agent">Agente Responsável</Label>
                <Select value={workflowData.agentId} onValueChange={(value) => 
                  setWorkflowData(prev => ({ ...prev, agentId: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o agente" />
                  </SelectTrigger>
                  <SelectContent>
                    {configurations?.map((config) => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.name} ({config.agent_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="name">Nome do Workflow</Label>
                <Input
                  id="name"
                  value={workflowData.name}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome personalizado"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="webhook">URL do Webhook N8N</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook"
                  value={workflowData.webhookUrl}
                  onChange={(e) => setWorkflowData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  placeholder="https://n8n.seudominio.com/webhook/..."
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyWebhookUrl(workflowData.webhookUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Configure esta URL no seu N8N como webhook trigger
              </p>
            </div>

            <div>
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={workflowData.description}
                onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva como este workflow irá funcionar..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-activate"
                  checked={workflowData.autoActivate}
                  onCheckedChange={(checked) => 
                    setWorkflowData(prev => ({ ...prev, autoActivate: checked }))
                  }
                />
                <Label htmlFor="auto-activate">Ativar automaticamente</Label>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCustomConfig(false)}
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleCreateWorkflow}
                  disabled={isCreatingWorkflow}
                  className="flex items-center gap-2"
                >
                  {isCreatingWorkflow ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Criar Workflow
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instruções rápidas */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Como Funciona
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>Escolha um template</strong> específico para o tipo de atendimento</p>
            <p>• <strong>Configure o agente</strong> que irá processar as solicitações</p>
            <p>• <strong>Defina o webhook N8N</strong> que receberá os triggers</p>
            <p>• <strong>Ative o workflow</strong> e comece a atender automaticamente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickWorkflowSetup;
