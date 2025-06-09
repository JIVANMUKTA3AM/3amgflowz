
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import { useAgentWorkflows } from "@/hooks/useAgentWorkflows";

interface WorkflowFormProps {
  workflow?: any;
  onSave: () => void;
  onCancel: () => void;
}

const WorkflowForm = ({ workflow, onSave, onCancel }: WorkflowFormProps) => {
  const { configurations } = useAgentConfigurations();
  const { createWorkflow, updateWorkflow, isCreatingWorkflow, isUpdatingWorkflow } = useAgentWorkflows();

  const [formData, setFormData] = useState({
    agent_configuration_id: "",
    workflow_name: "",
    workflow_type: "n8n",
    webhook_url: "",
    webhook_secret: "",
    is_active: true,
    configuration: {}
  });

  useEffect(() => {
    if (workflow) {
      setFormData({
        agent_configuration_id: workflow.agent_configuration_id,
        workflow_name: workflow.workflow_name,
        workflow_type: workflow.workflow_type,
        webhook_url: workflow.webhook_url || "",
        webhook_secret: workflow.webhook_secret || "",
        is_active: workflow.is_active,
        configuration: workflow.configuration || {}
      });
    }
  }, [workflow]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (workflow) {
      updateWorkflow({ id: workflow.id, ...formData });
    } else {
      createWorkflow(formData);
    }
    onSave();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const workflowTypes = [
    { value: "n8n", label: "N8N" },
    { value: "zapier", label: "Zapier" },
    { value: "custom", label: "Personalizado" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {workflow ? "Editar Workflow" : "Novo Workflow"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agent_configuration_id">Agente</Label>
              <Select 
                value={formData.agent_configuration_id} 
                onValueChange={(value) => handleChange("agent_configuration_id", value)}
              >
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
              <Label htmlFor="workflow_type">Tipo de Workflow</Label>
              <Select 
                value={formData.workflow_type} 
                onValueChange={(value) => handleChange("workflow_type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {workflowTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="workflow_name">Nome do Workflow</Label>
            <Input
              id="workflow_name"
              value={formData.workflow_name}
              onChange={(e) => handleChange("workflow_name", e.target.value)}
              placeholder="Ex: Workflow de Atendimento WhatsApp"
              required
            />
          </div>

          <div>
            <Label htmlFor="webhook_url">URL do Webhook</Label>
            <Input
              id="webhook_url"
              value={formData.webhook_url}
              onChange={(e) => handleChange("webhook_url", e.target.value)}
              placeholder="https://seu-n8n.com/webhook/..."
              type="url"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL para disparar o workflow externamente
            </p>
          </div>

          <div>
            <Label htmlFor="webhook_secret">Webhook Secret (Opcional)</Label>
            <Input
              id="webhook_secret"
              value={formData.webhook_secret}
              onChange={(e) => handleChange("webhook_secret", e.target.value)}
              placeholder="Token secreto para validação"
              type="password"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleChange("is_active", e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="is_active">Workflow ativo</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isCreatingWorkflow || isUpdatingWorkflow}
            >
              {isCreatingWorkflow || isUpdatingWorkflow ? "Salvando..." : "Salvar"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkflowForm;
