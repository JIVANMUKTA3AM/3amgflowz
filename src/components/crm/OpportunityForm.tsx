import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface OpportunityFormData {
  opportunity_name: string;
  client_id: string;
  stage: string;
  value?: number;
  probability?: number;
  expected_close_date?: string;
  source?: string;
  notes?: string;
}

interface OpportunityFormProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId?: string | null;
}

const stages = [
  { id: 'lead', name: 'Lead' },
  { id: 'qualification', name: 'Qualificação' },
  { id: 'proposal', name: 'Proposta' },
  { id: 'negotiation', name: 'Negociação' },
  { id: 'closed_won', name: 'Fechado - Ganho' },
  { id: 'closed_lost', name: 'Fechado - Perdido' },
];

const sources = [
  'Website',
  'Indicação',
  'Telefone',
  'Email',
  'Redes Sociais',
  'Evento',
  'Outro',
];

const OpportunityForm = ({ isOpen, onClose, opportunityId }: OpportunityFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<OpportunityFormData>({
    defaultValues: {
      stage: 'lead',
    }
  });

  // Buscar clientes para o select
  const { data: clients = [] } = useQuery({
    queryKey: ['clients', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('clients')
        .select('id, name, company_name')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id && isOpen,
  });

  // Buscar dados da oportunidade para edição
  const { data: opportunityData } = useQuery({
    queryKey: ['opportunity', opportunityId],
    queryFn: async () => {
      if (!opportunityId) return null;
      
      const { data, error } = await supabase
        .from('sales_pipeline')
        .select('*')
        .eq('id', opportunityId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!opportunityId && isOpen,
  });

  // Preencher formulário com dados da oportunidade
  useEffect(() => {
    if (opportunityData) {
      reset({
        opportunity_name: opportunityData.opportunity_name,
        client_id: opportunityData.client_id,
        stage: opportunityData.stage,
        value: opportunityData.value || undefined,
        probability: opportunityData.probability || undefined,
        expected_close_date: opportunityData.expected_close_date 
          ? new Date(opportunityData.expected_close_date).toISOString().split('T')[0]
          : undefined,
        source: opportunityData.source || undefined,
        notes: opportunityData.notes || undefined,
      });
    } else {
      reset({
        stage: 'lead',
      });
    }
  }, [opportunityData, reset]);

  const createOpportunityMutation = useMutation({
    mutationFn: async (data: OpportunityFormData) => {
      const opportunityPayload = {
        ...data,
        user_id: user?.id,
        value: data.value || null,
        probability: data.probability || null,
        expected_close_date: data.expected_close_date || null,
      };

      if (opportunityId) {
        const { error } = await supabase
          .from('sales_pipeline')
          .update(opportunityPayload)
          .eq('id', opportunityId)
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sales_pipeline')
          .insert(opportunityPayload);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-pipeline', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['crm-metrics', user?.id] });
      toast({
        title: opportunityId ? "Oportunidade atualizada" : "Oportunidade criada",
        description: opportunityId 
          ? "Oportunidade foi atualizada com sucesso." 
          : "Oportunidade foi criada com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Erro ao salvar oportunidade:", error);
      toast({
        title: "Erro ao salvar oportunidade",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const deleteOpportunityMutation = useMutation({
    mutationFn: async () => {
      if (!opportunityId) return;
      
      const { error } = await supabase
        .from('sales_pipeline')
        .delete()
        .eq('id', opportunityId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-pipeline', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['crm-metrics', user?.id] });
      toast({
        title: "Oportunidade removida",
        description: "Oportunidade foi removida com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Erro ao remover oportunidade:", error);
      toast({
        title: "Erro ao remover oportunidade",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OpportunityFormData) => {
    createOpportunityMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {opportunityId ? "Editar Oportunidade" : "Nova Oportunidade"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="opportunity_name">Nome da Oportunidade *</Label>
              <Input
                id="opportunity_name"
                {...register("opportunity_name", { required: "Nome é obrigatório" })}
                placeholder="Ex: Venda de sistema para ABC Corp"
              />
              {errors.opportunity_name && (
                <p className="text-sm text-destructive">{errors.opportunity_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_id">Cliente *</Label>
              <Select
                value={watch("client_id")}
                onValueChange={(value) => setValue("client_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} {client.company_name && `- ${client.company_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.client_id && (
                <p className="text-sm text-destructive">Cliente é obrigatório</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Estágio *</Label>
              <Select
                value={watch("stage")}
                onValueChange={(value) => setValue("stage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estágio" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                {...register("value", { valueAsNumber: true })}
                placeholder="0,00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Probabilidade (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                {...register("probability", { valueAsNumber: true })}
                placeholder="50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_close_date">Data Esperada de Fechamento</Label>
              <Input
                id="expected_close_date"
                type="date"
                {...register("expected_close_date")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Fonte</Label>
              <Select
                value={watch("source") || ""}
                onValueChange={(value) => setValue("source", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fonte" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Adicione observações sobre esta oportunidade..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-between pt-4">
            <div>
              {opportunityId && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={() => deleteOpportunityMutation.mutate()}
                  disabled={deleteOpportunityMutation.isPending}
                >
                  {deleteOpportunityMutation.isPending ? "Removendo..." : "Remover"}
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createOpportunityMutation.isPending}
              >
                {createOpportunityMutation.isPending 
                  ? "Salvando..." 
                  : opportunityId ? "Atualizar" : "Criar Oportunidade"
                }
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OpportunityForm;