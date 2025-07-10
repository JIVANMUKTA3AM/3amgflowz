import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock
} from "lucide-react";
import InteractionForm from "./InteractionForm";

interface Interaction {
  id: string;
  client_id: string;
  interaction_type: string;
  subject?: string;
  description?: string;
  duration_minutes?: number;
  outcome?: string;
  next_action?: string;
  next_action_date?: string;
  created_at: string;
  clients: {
    name: string;
    company_name?: string;
  };
}

const interactionTypes = [
  { id: 'call', name: 'Ligação', icon: Phone },
  { id: 'email', name: 'Email', icon: Mail },
  { id: 'meeting', name: 'Reunião', icon: Calendar },
  { id: 'message', name: 'Mensagem', icon: MessageSquare },
];

const InteractionHistory = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInteractionId, setSelectedInteractionId] = useState<string | null>(null);

  const { data: interactions = [], isLoading } = useQuery({
    queryKey: ['client-interactions', user?.id, searchTerm],
    queryFn: async () => {
      if (!user?.id) return [];

      let query = supabase
        .from('client_interactions')
        .select(`
          *,
          clients (
            name,
            company_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`subject.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Interaction[];
    },
    enabled: !!user?.id,
  });

  const deleteInteractionMutation = useMutation({
    mutationFn: async (interactionId: string) => {
      const { error } = await supabase
        .from('client_interactions')
        .delete()
        .eq('id', interactionId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-interactions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['crm-metrics', user?.id] });
      toast({
        title: "Interação removida",
        description: "Interação foi removida com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao remover interação:", error);
      toast({
        title: "Erro ao remover interação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const getInteractionIcon = (type: string) => {
    const interaction = interactionTypes.find(i => i.id === type);
    return interaction ? interaction.icon : MessageSquare;
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-800';
      case 'email':
        return 'bg-green-100 text-green-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      case 'message':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInteractionName = (type: string) => {
    const interaction = interactionTypes.find(i => i.id === type);
    return interaction ? interaction.name : type;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando interações...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Histórico de Interações</CardTitle>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Interação
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar interações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {interactions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhuma interação encontrada
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Tente alterar os termos da busca" : "Comece registrando sua primeira interação"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Resultado</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Próxima Ação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {interactions.map((interaction) => {
                  const Icon = getInteractionIcon(interaction.interaction_type);
                  return (
                    <TableRow key={interaction.id}>
                      <TableCell>
                        <Badge className={getInteractionColor(interaction.interaction_type)}>
                          <Icon className="h-3 w-3 mr-1" />
                          {getInteractionName(interaction.interaction_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{interaction.clients.name}</div>
                          {interaction.clients.company_name && (
                            <div className="text-sm text-muted-foreground">
                              {interaction.clients.company_name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {interaction.subject && (
                            <div className="font-medium">{interaction.subject}</div>
                          )}
                          {interaction.description && (
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {interaction.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {interaction.outcome && (
                          <Badge variant="outline">
                            {interaction.outcome}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {interaction.duration_minutes && (
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            {interaction.duration_minutes}min
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {interaction.next_action && (
                          <div>
                            <div className="text-sm font-medium">{interaction.next_action}</div>
                            {interaction.next_action_date && (
                              <div className="text-xs text-muted-foreground">
                                {new Date(interaction.next_action_date).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(interaction.created_at).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(interaction.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedInteractionId(interaction.id);
                                setIsFormOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteInteractionMutation.mutate(interaction.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <InteractionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedInteractionId(null);
        }}
        interactionId={selectedInteractionId}
      />
    </div>
  );
};

export default InteractionHistory;