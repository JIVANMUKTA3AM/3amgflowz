import { useEffect } from "react";
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

interface InteractionFormData {
  client_id: string;
  interaction_type: string;
  subject?: string;
  description?: string;
  duration_minutes?: number;
  outcome?: string;
  next_action?: string;
  next_action_date?: string;
}

interface InteractionFormProps {
  isOpen: boolean;
  onClose: () => void;
  interactionId?: string | null;
}

const interactionTypes = [
  { id: 'call', name: 'Ligação' },
  { id: 'email', name: 'Email' },
  { id: 'meeting', name: 'Reunião' },
  { id: 'message', name: 'Mensagem' },
  { id: 'visit', name: 'Visita' },
  { id: 'other', name: 'Outro' },
];

const outcomes = [
  'Positivo',
  'Neutro',
  'Negativo',
  'Agendado Follow-up',
  'Proposta Enviada',
  'Não Atendeu',
  'Interessado',
  'Não Interessado',
];

const InteractionForm = ({ isOpen, onClose, interactionId }: InteractionFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<InteractionFormData>({
    defaultValues: {
      interaction_type: 'call',
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

  // Buscar dados da interação para edição
  const { data: interactionData } = useQuery({
    queryKey: ['interaction', interactionId],
    queryFn: async () => {
      if (!interactionId) return null;
      
      const { data, error } = await supabase
        .from('client_interactions')
        .select('*')
        .eq('id', interactionId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!interactionId && isOpen,
  });

  // Preencher formulário com dados da interação
  useEffect(() => {
    if (interactionData) {
      reset({
        client_id: interactionData.client_id,
        interaction_type: interactionData.interaction_type,
        subject: interactionData.subject || '',
        description: interactionData.description || '',
        duration_minutes: interactionData.duration_minutes || undefined,
        outcome: interactionData.outcome || '',
        next_action: interactionData.next_action || '',
        next_action_date: interactionData.next_action_date 
          ? new Date(interactionData.next_action_date).toISOString().split('T')[0]
          : '',
      });
    } else {
      reset({
        interaction_type: 'call',
      });
    }
  }, [interactionData, reset]);

  const createInteractionMutation = useMutation({
    mutationFn: async (data: InteractionFormData) => {
      const interactionPayload = {
        ...data,
        user_id: user?.id,
        duration_minutes: data.duration_minutes || null,
        next_action_date: data.next_action_date || null,
      };

      if (interactionId) {
        const { error } = await supabase
          .from('client_interactions')
          .update(interactionPayload)
          .eq('id', interactionId)
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('client_interactions')
          .insert(interactionPayload);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-interactions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['crm-metrics', user?.id] });
      toast({
        title: interactionId ? "Interação atualizada" : "Interação registrada",
        description: interactionId 
          ? "Interação foi atualizada com sucesso." 
          : "Interação foi registrada com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Erro ao salvar interação:", error);
      toast({
        title: "Erro ao salvar interação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InteractionFormData) => {
    createInteractionMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {interactionId ? "Editar Interação" : "Nova Interação"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="interaction_type">Tipo de Interação *</Label>
              <Select
                value={watch("interaction_type")}
                onValueChange={(value) => setValue("interaction_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {interactionTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                {...register("subject")}
                placeholder="Assunto da interação"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duração (minutos)</Label>
              <Input
                id="duration_minutes"
                type="number"
                min="0"
                {...register("duration_minutes", { valueAsNumber: true })}
                placeholder="Ex: 30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="outcome">Resultado</Label>
              <Select
                value={watch("outcome") || ""}
                onValueChange={(value) => setValue("outcome", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o resultado" />
                </SelectTrigger>
                <SelectContent>
                  {outcomes.map((outcome) => (
                    <SelectItem key={outcome} value={outcome}>
                      {outcome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descreva os detalhes da interação..."
              rows={4}
            />
          </div>

          {/* Próxima Ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="next_action">Próxima Ação</Label>
              <Input
                id="next_action"
                {...register("next_action")}
                placeholder="Ex: Enviar proposta"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_action_date">Data da Próxima Ação</Label>
              <Input
                id="next_action_date"
                type="date"
                {...register("next_action_date")}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createInteractionMutation.isPending}
            >
              {createInteractionMutation.isPending 
                ? "Salvando..." 
                : interactionId ? "Atualizar" : "Registrar Interação"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InteractionForm;