import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageCircle, 
  BarChart3, 
  Router, 
  Network, 
  Settings, 
  Zap,
  Globe,
  Activity,
  Bot,
  Workflow,
  TrendingUp,
  Users2,
  Phone,
  Server,
  Cable,
  Wifi,
  Plus
} from "lucide-react";
import TechnicalMonitoringDashboard from "./TechnicalMonitoringDashboard";
import { useOltConfigurations } from "@/hooks/useOltConfigurations";

const ClientDashboardOptions = () => {
  const navigate = useNavigate();
  const { configurations: oltConfigs, isLoading: loadingOlts } = useOltConfigurations();

  const dashboardOptions = [
    {
      id: "attendance",
      title: "Painel de Atendimento",
      description: "Gerencie atendimentos e suporte aos clientes",
      icon: Users,
      color: "from-primary/20 to-primary/5",
      metrics: { pendentes: 2, ativos: 0, resolvidos: 0 },
      action: () => navigate("/client-dashboard?tab=attendance")
    },
    {
      id: "agents",
      title: "Agentes de IA",
      description: "Configure e monitore seus assistentes virtuais",
      icon: Bot,
      color: "from-success/20 to-success/5",
      metrics: { ativos: 3, configurados: 4, online: 3 },
      action: () => navigate("/agentes")
    },
    {
      id: "chat",
      title: "Chat ao Vivo",
      description: "Acompanhe conversas em tempo real",
      icon: MessageCircle,
      color: "from-warning/20 to-warning/5",
      metrics: { hoje: 24, mes: 456, ativo: true },
      action: () => navigate("/client-dashboard?tab=chat")
    },
    {
      id: "analytics",
      title: "Analytics & Relatórios",
      description: "Dashboards e métricas detalhadas",
      icon: BarChart3,
      color: "from-purple-500/20 to-purple-500/5",
      metrics: { conversas: 1230, resolucao: "87%", tempo: "2.3s" },
      action: () => navigate("/dashboard")
    },
    {
      id: "olt-monitoring",
      title: "Monitoramento OLT",
      description: "Dashboard para equipamentos OLT em tempo real",
      icon: Router,
      color: "from-blue-500/20 to-blue-500/5",
      metrics: { total: 12, online: 10, offline: 2 },
      action: () => navigate("/dashboard-olt")
    },
    {
      id: "snmp-monitoring",
      title: "Console SNMP",
      description: "Monitoramento avançado de rede e equipamentos",
      icon: Network,
      color: "from-emerald-500/20 to-emerald-500/5",
      metrics: { devices: 45, queries: 1230, errors: 3 },
      action: () => navigate("/monitoramento-snmp")
    },
    {
      id: "integrations",
      title: "Integrações",
      description: "WhatsApp, Telegram, APIs e webhooks",
      icon: Globe,
      color: "from-orange-500/20 to-orange-500/5",
      metrics: { ativas: 5, conectadas: 4, pendentes: 1 },
      action: () => navigate("/integracoes")
    },
    {
      id: "workflows",
      title: "Fluxos de Trabalho",
      description: "Automações e processos personalizados",
      icon: Workflow,
      color: "from-indigo-500/20 to-indigo-500/5",
      metrics: { ativos: 8, execucoes: 156, sucesso: "94%" },
      action: () => navigate("/fluxos")
    },
    {
      id: "crm",
      title: "CRM & Vendas",
      description: "Gestão de clientes e pipeline de vendas",
      icon: Users2,
      color: "from-pink-500/20 to-pink-500/5",
      metrics: { clientes: 234, leads: 45, vendas: "R$ 12.5K" },
      action: () => navigate("/client-dashboard?tab=crm")
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-3amg bg-clip-text text-transparent">
          Dashboard do Cliente
        </h1>
        <p className="text-muted-foreground text-lg">Gerencie tudo em um só lugar</p>
      </div>

      {/* OLT Quick Access - Dynamic based on configurations */}
      {!loadingOlts && oltConfigs && oltConfigs.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-3amg bg-clip-text text-transparent flex items-center gap-3">
                <Server className="h-8 w-8 text-primary" />
                Suas OLTs
              </h2>
              <p className="text-muted-foreground mt-1">
                Acesso rápido às OLTs configuradas no onboarding
              </p>
            </div>
            <Button
              onClick={() => navigate("/olt-config")}
              className="bg-gradient-3amg-orange text-white hover:opacity-90 transition-opacity shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova OLT
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {oltConfigs.map((olt, index) => {
              const gradients = [
                'bg-gradient-3amg-orange',
                'bg-gradient-3amg-purple',
                'bg-gradient-3amg'
              ];
              const borderColors = [
                'border-3amg-orange',
                'border-3amg-purple',
                'border-primary'
              ];
              const gradient = gradients[index % gradients.length];
              const borderColor = borderColors[index % borderColors.length];
              
              return (
                <Card 
                  key={olt.id}
                  className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 ${borderColor} hover:scale-105 bg-card/50 backdrop-blur-sm`}
                  onClick={() => navigate(`/dashboard-olt?oltId=${olt.id}`)}
                >
                  {/* Gradient Background Overlay */}
                  <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                  
                  <CardHeader className="relative pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${gradient} shadow-lg animate-pulse-slow`}>
                        <Server className="h-6 w-6 text-white" />
                      </div>
                      <Badge 
                        variant={olt.is_active ? "default" : "secondary"}
                        className={olt.is_active ? "bg-success text-success-foreground animate-pulse" : ""}
                      >
                        {olt.is_active ? "● Ativa" : "○ Inativa"}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {olt.name}
                    </CardTitle>
                    <CardDescription className="space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Network className="h-3 w-3 text-primary" />
                        <span className="font-medium">{olt.brand}</span> - {olt.model}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Wifi className="h-3 w-3 text-success" />
                        {olt.ip_address}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:border-primary transition-colors">
                        <Cable className="h-4 w-4 mx-auto mb-1 text-primary" />
                        <div className="text-xs text-muted-foreground">Porta</div>
                        <div className="text-sm font-bold">{olt.port || '161'}</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:border-success transition-colors">
                        <Activity className="h-4 w-4 mx-auto mb-1 text-success" />
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div className="text-sm font-bold text-success">Online</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:border-warning transition-colors">
                        <Zap className="h-4 w-4 mx-auto mb-1 text-warning" />
                        <div className="text-xs text-muted-foreground">ONTs</div>
                        <div className="text-sm font-bold">--</div>
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${gradient} text-white hover:opacity-90 transition-all shadow-lg group-hover:shadow-xl`}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Dashboard Completo
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Dashboard Options Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          Outras Funcionalidades
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardOptions.map((option) => {
            const IconComponent = option.icon;
            
            return (
              <Card 
                key={option.id}
                className="bg-card/80 backdrop-blur-sm border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                onClick={option.action}
              >
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        option.action();
                      }}
                    >
                      Acessar
                    </Button>
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {option.title}
                  </CardTitle>
                  <CardDescription>
                    {option.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {Object.entries(option.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-2 rounded bg-muted/50">
                        <div className="font-semibold text-foreground">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-1 text-xs text-success font-medium">
                      <Activity className="h-3 w-3 animate-pulse" />
                      Sistema Ativo
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Technical Monitoring Dashboard */}
      <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-3amg-orange" />
            Monitoramento Técnico Interativo
          </CardTitle>
          <CardDescription className="text-gray-400">
            Dashboard completo para monitoramento de agentes, OLTs, ONTs e infraestrutura técnica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TechnicalMonitoringDashboard />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-3amg-orange" />
            Ações Rápidas
          </CardTitle>
          <CardDescription className="text-gray-300">
            Acesso direto às funcionalidades mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/client-dashboard?tab=chat")}
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm">Novo Chat</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/agentes")}
            >
              <Bot className="h-5 w-5" />
              <span className="text-sm">Config. Agente</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Ver Métricas</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate("/integracoes")}
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm">Configurações</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboardOptions;