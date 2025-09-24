import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, DollarSign, TrendingUp, Eye } from 'lucide-react';
import { PlanForm } from '@/components/comercial/PlanForm';
import { PlansTable } from '@/components/comercial/PlansTable';
import { useProviderPlans, ProviderPlan } from '@/hooks/useProviderPlans';
import { Badge } from '@/components/ui/badge';

export default function GestaoComercial() {
  const { plans, providers, isLoading, createPlan, updatePlan, deletePlan } = useProviderPlans();
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ProviderPlan | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  const filteredPlans = selectedProvider === 'all' 
    ? plans 
    : plans.filter(plan => plan.provedor_id === selectedProvider);

  const activePlans = filteredPlans.filter(plan => plan.ativo);
  const totalPlans = filteredPlans.length;
  const averagePrice = filteredPlans.length > 0 
    ? filteredPlans.reduce((sum, plan) => sum + plan.preco, 0) / filteredPlans.length 
    : 0;

  const handleCreatePlan = async (planData: Omit<ProviderPlan, 'id' | 'created_at' | 'updated_at'>) => {
    await createPlan(planData);
    setShowPlanForm(false);
  };

  const handleUpdatePlan = async (planData: Omit<ProviderPlan, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingPlan) {
      await updatePlan(editingPlan.id, planData);
      setEditingPlan(null);
      setShowPlanForm(false);
    }
  };

  const handleEditPlan = (plan: ProviderPlan) => {
    setEditingPlan(plan);
    setShowPlanForm(true);
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    await updatePlan(id, { ativo: active });
  };

  const getAPIEndpoint = (providerId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/functions/v1/comercial-plans/${providerId}/planos`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestão Comercial
          </h1>
          <p className="text-muted-foreground">
            Gerencie planos de internet para seus provedores e integre com agentes comerciais
          </p>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="api">Integração API</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPlans}</div>
                  <p className="text-xs text-muted-foreground">
                    {activePlans.length} ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Preço Médio</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(averagePrice)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Média dos planos cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Provedores</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{providers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Cadastrados no sistema
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por provedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os provedores</SelectItem>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={() => setShowPlanForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Plano
              </Button>
            </div>

            {/* Plans Table */}
            <Card>
              <CardHeader>
                <CardTitle>Planos Cadastrados</CardTitle>
                <CardDescription>
                  Gerencie todos os planos de internet dos seus provedores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Carregando...</div>
                ) : (
                  <PlansTable
                    plans={filteredPlans}
                    onEdit={handleEditPlan}
                    onDelete={deletePlan}
                    onToggleActive={handleToggleActive}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Integração com Agentes Comerciais
                </CardTitle>
                <CardDescription>
                  Endpoints REST para integração com n8n e agentes de IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Endpoint Principal</h4>
                  <code className="bg-muted p-2 rounded text-sm block">
                    GET /functions/v1/comercial-plans/{'<'}provider_id{'>'}/planos
                  </code>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Exemplo de Resposta</h4>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`{
  "provedor": "NetFibra",
  "planos": [
    {
      "nome": "300 Mb",
      "preco": 99.90,
      "promocao": "Primeiro mês grátis"
    },
    {
      "nome": "500 Mb", 
      "preco": 149.90,
      "promocao": "Wi-Fi 6 incluso"
    }
  ],
  "condicoes": {
    "carencia": "12 meses",
    "instalacao": "Consulte condições"
  }
}`}
                  </pre>
                </div>

                {providers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">URLs por Provedor</h4>
                    <div className="space-y-2">
                      {providers.map((provider) => (
                        <div key={provider.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <span className="font-medium">{provider.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {plans.filter(p => p.provedor_id === provider.id && p.ativo).length} planos ativos
                            </Badge>
                          </div>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {getAPIEndpoint(provider.id)}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                    💡 Como usar no n8n
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Configure um nó HTTP Request no n8n apontando para o endpoint do provedor. 
                    O agente comercial usará esses dados para apresentar planos atualizados automaticamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Plan Form Modal */}
        <PlanForm
          isOpen={showPlanForm}
          onClose={() => {
            setShowPlanForm(false);
            setEditingPlan(null);
          }}
          onSave={editingPlan ? handleUpdatePlan : handleCreatePlan}
          providers={providers}
          editingPlan={editingPlan}
        />
      </main>

      <Footer />
    </div>
  );
}