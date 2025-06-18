
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface TicketTecnico {
  id: string;
  agent_id: string;
  cliente_nome: string;
  cliente_telefone?: string;
  cliente_endereco?: string;
  tipo_servico: string;
  descricao: string;
  status: string;
  prioridade: string;
  data_abertura: string;
  data_conclusao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface PropostaComercial {
  id: string;
  agent_id: string;
  cliente_nome: string;
  cliente_email?: string;
  cliente_telefone?: string;
  plano_interesse: string;
  valor_proposto?: number;
  status: string;
  prioridade: string;
  data_abertura: string;
  data_conclusao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface AtendimentoGeral {
  id: string;
  agent_id: string;
  cliente_nome: string;
  cliente_contato?: string;
  tipo_atendimento: string;
  descricao: string;
  status: string;
  prioridade: string;
  data_abertura: string;
  data_conclusao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export const useAgentTasks = (userRole: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Tickets Técnicos
  const { data: tickets, isLoading: loadingTickets } = useQuery({
    queryKey: ['tickets-tecnicos', user?.id],
    queryFn: async () => {
      if (!user?.id || userRole !== 'tecnico') return [];
      
      const { data, error } = await supabase
        .from('tickets_tecnicos')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TicketTecnico[];
    },
    enabled: !!user?.id && userRole === 'tecnico',
  });

  // Propostas Comerciais
  const { data: propostas, isLoading: loadingPropostas } = useQuery({
    queryKey: ['propostas-comerciais', user?.id],
    queryFn: async () => {
      if (!user?.id || userRole !== 'comercial') return [];
      
      const { data, error } = await supabase
        .from('propostas_comerciais')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PropostaComercial[];
    },
    enabled: !!user?.id && userRole === 'comercial',
  });

  // Atendimentos Gerais
  const { data: atendimentos, isLoading: loadingAtendimentos } = useQuery({
    queryKey: ['atendimentos-gerais', user?.id],
    queryFn: async () => {
      if (!user?.id || userRole !== 'geral') return [];
      
      const { data, error } = await supabase
        .from('atendimentos_gerais')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AtendimentoGeral[];
    },
    enabled: !!user?.id && userRole === 'geral',
  });

  // Criar ticket técnico
  const createTicketMutation = useMutation({
    mutationFn: async (ticket: Omit<TicketTecnico, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('tickets_tecnicos')
        .insert(ticket)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets-tecnicos', user?.id] });
      toast({
        title: "Ticket criado!",
        description: "Novo ticket técnico foi criado com sucesso.",
      });
    },
  });

  // Criar proposta comercial
  const createPropostaMutation = useMutation({
    mutationFn: async (proposta: Omit<PropostaComercial, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('propostas_comerciais')
        .insert(proposta)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas-comerciais', user?.id] });
      toast({
        title: "Proposta criada!",
        description: "Nova proposta comercial foi criada com sucesso.",
      });
    },
  });

  // Criar atendimento geral
  const createAtendimentoMutation = useMutation({
    mutationFn: async (atendimento: Omit<AtendimentoGeral, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('atendimentos_gerais')
        .insert(atendimento)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['atendimentos-gerais', user?.id] });
      toast({
        title: "Atendimento criado!",
        description: "Novo atendimento foi criado com sucesso.",
      });
    },
  });

  return {
    tickets,
    propostas,
    atendimentos,
    loadingTickets,
    loadingPropostas,
    loadingAtendimentos,
    createTicket: createTicketMutation.mutate,
    createProposta: createPropostaMutation.mutate,
    createAtendimento: createAtendimentoMutation.mutate,
    isCreating: createTicketMutation.isPending || createPropostaMutation.isPending || createAtendimentoMutation.isPending,
  };
};
