import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Phone
} from "lucide-react";

const ClientDashboardOptions = () => {
  const navigate = useNavigate();

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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Visão do Cliente</h1>
        <p className="text-gray-300">Acesse todas as ferramentas e dashboards da sua conta</p>
      </div>

      {/* Dashboard Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardOptions.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <Card 
              key={option.id}
              className="bg-gray-900/80 backdrop-blur-sm border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              onClick={option.action}
            >
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors">
                    <IconComponent className="h-6 w-6 text-3amg-orange" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      option.action();
                    }}
                  >
                    Acessar
                  </Button>
                </div>
                <CardTitle className="text-lg font-semibold text-white group-hover:text-3amg-purple transition-colors">
                  {option.title}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {option.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {Object.entries(option.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="font-semibold text-white">{value}</div>
                      <div className="text-xs text-gray-400 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-1 text-xs text-green-400 font-medium">
                    <Activity className="h-3 w-3" />
                    Sistema funcionando
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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