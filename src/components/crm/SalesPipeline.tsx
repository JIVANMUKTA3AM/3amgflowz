import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Plus, DollarSign, Calendar, User, TrendingUp } from "lucide-react";
import OpportunityForm from "./OpportunityForm";

interface Opportunity {
  id: string;
  opportunity_name: string;
  client_id: string;
  stage: string;
  value?: number;
  probability?: number;
  expected_close_date?: string;
  source?: string;
  notes?: string;
  created_at: string;
  clients: {
    name: string;
    company_name?: string;
  };
}

const stages = [
  { id: 'lead', name: 'Lead', color: 'bg-gray-500' },
  { id: 'qualification', name: 'Qualificação', color: 'bg-blue-500' },
  { id: 'proposal', name: 'Proposta', color: 'bg-yellow-500' },
  { id: 'negotiation', name: 'Negociação', color: 'bg-orange-500' },
  { id: 'closed_won', name: 'Fechado - Ganho', color: 'bg-green-500' },
  { id: 'closed_lost', name: 'Fechado - Perdido', color: 'bg-red-500' },
];

const SalesPipeline = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['sales-pipeline', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('sales_pipeline')
        .select(`
          *,
          clients (
            name,
            company_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Opportunity[];
    },
    enabled: !!user?.id,
  });

  const updateStageMutation = useMutation({
    mutationFn: async ({ opportunityId, newStage }: { opportunityId: string; newStage: string }) => {
      const { error } = await supabase
        .from('sales_pipeline')
        .update({ 
          stage: newStage,
          updated_at: new Date().toISOString()
        })
        .eq('id', opportunityId)
        .eq('user_id', user?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-pipeline', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['crm-metrics', user?.id] });
      toast({
        title: "Estágio atualizado",
        description: "A oportunidade foi movida com sucesso.",
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar estágio:", error);
      toast({
        title: "Erro ao atualizar estágio",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const getOpportunitiesByStage = (stageId: string) => {
    return opportunities.filter(opp => opp.stage === stageId);
  };

  const getTotalValueByStage = (stageId: string) => {
    return getOpportunitiesByStage(stageId).reduce((sum, opp) => sum + (opp.value || 0), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleStageChange = (opportunityId: string, newStage: string) => {
    updateStageMutation.mutate({ opportunityId, newStage });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Pipeline de Vendas</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Nova Oportunidade
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, cardIndex) => (
                    <div key={cardIndex} className="h-20 bg-muted rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pipeline de Vendas</h2>
          <p className="text-muted-foreground">
            Gerencie suas oportunidades de venda
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Pipeline Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.id);
          const totalValue = getTotalValueByStage(stage.id);

          return (
            <Card key={stage.id} className="min-h-[400px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    {stage.name}
                  </CardTitle>
                  <Badge variant="secondary">
                    {stageOpportunities.length}
                  </Badge>
                </div>
                {totalValue > 0 && (
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(totalValue)}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {stageOpportunities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma oportunidade</p>
                  </div>
                ) : (
                  stageOpportunities.map((opportunity) => (
                    <Card 
                      key={opportunity.id} 
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedOpportunityId(opportunity.id);
                        setIsFormOpen(true);
                      }}
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm leading-tight">
                          {opportunity.opportunity_name}
                        </h4>
                        
                        <div className="flex items-center text-xs text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          {opportunity.clients.name}
                          {opportunity.clients.company_name && (
                            <span className="ml-1">• {opportunity.clients.company_name}</span>
                          )}
                        </div>

                        {opportunity.value && (
                          <div className="flex items-center text-xs font-medium text-green-600">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {formatCurrency(opportunity.value)}
                          </div>
                        )}

                        {opportunity.expected_close_date && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(opportunity.expected_close_date).toLocaleDateString('pt-BR')}
                          </div>
                        )}

                        {opportunity.probability && (
                          <div className="flex items-center justify-between text-xs">
                            <span>Probabilidade:</span>
                            <Badge variant="outline" className="text-xs">
                              {opportunity.probability}%
                            </Badge>
                          </div>
                        )}

                        {/* Stage selector */}
                        <select
                          value={opportunity.stage}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStageChange(opportunity.id, e.target.value);
                          }}
                          className="w-full text-xs border rounded p-1 mt-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {stages.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Form Modal */}
      <OpportunityForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedOpportunityId(null);
        }}
        opportunityId={selectedOpportunityId}
      />
    </div>
  );
};

export default SalesPipeline;