import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Bot, Route, CreditCard, MonitorDot, Ticket, FileText } from 'lucide-react';
import { useTenants } from '@/hooks/useTenants';
import { TenantAgentsPanel } from '@/components/tenant/TenantAgentsPanel';
import { TenantPlansPanel } from '@/components/tenant/TenantPlansPanel';
import { TenantAdaptersPanel } from '@/components/tenant/TenantAdaptersPanel';
import { TenantTicketsPanel } from '@/components/tenant/TenantTicketsPanel';
import { TenantInfoPanel } from '@/components/tenant/TenantInfoPanel';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { userTenant, isLoading } = useTenants();
  const [activeTab, setActiveTab] = useState('info');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!userTenant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Provedor não encontrado
              </CardTitle>
              <CardDescription>
                Você ainda não está vinculado a nenhum provedor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/onboarding')} className="w-full">
                Criar Meu Provedor
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            {userTenant.nome}
          </h1>
          <p className="text-muted-foreground">
            Painel de configuração multi-tenant
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Provedor</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Agentes</span>
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              <span className="hidden sm:inline">Rotas</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Planos</span>
            </TabsTrigger>
            <TabsTrigger value="adapters" className="flex items-center gap-2">
              <MonitorDot className="h-4 w-4" />
              <span className="hidden sm:inline">Adapters</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              <span className="hidden sm:inline">Tickets</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <TenantInfoPanel tenant={userTenant} />
          </TabsContent>

          <TabsContent value="agents">
            <TenantAgentsPanel tenantId={userTenant.id} />
          </TabsContent>

          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  Rotas de Agentes
                </CardTitle>
                <CardDescription>
                  Configure regras de roteamento entre setores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Em desenvolvimento...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans">
            <TenantPlansPanel tenantId={userTenant.id} />
          </TabsContent>

          <TabsContent value="adapters">
            <TenantAdaptersPanel tenantId={userTenant.id} />
          </TabsContent>

          <TabsContent value="tickets">
            <TenantTicketsPanel tenantId={userTenant.id} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default TenantDashboard;
