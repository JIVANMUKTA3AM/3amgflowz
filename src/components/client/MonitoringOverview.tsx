import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Router, Activity, Signal, Network, TrendingUp, AlertTriangle } from "lucide-react";

const MonitoringOverview = () => {
  const navigate = useNavigate();

  const monitoringOptions = [
    {
      id: "olt-dashboard",
      title: "Dashboard OLT",
      description: "Monitore suas OLTs em tempo real com métricas detalhadas",
      icon: Router,
      route: "/dashboard-olt",
      metrics: {
        total: 12,
        online: 10,
        offline: 2
      },
      gradient: "bg-gradient-to-br from-primary/20 to-primary/5"
    },
    {
      id: "snmp-monitoring", 
      title: "Monitoramento SNMP",
      description: "Console avançado para operações SNMP e monitoramento de equipamentos",
      icon: Network,
      route: "/monitoramento-snmp",
      metrics: {
        devices: 45,
        queries: 1230,
        errors: 3
      },
      gradient: "bg-gradient-to-br from-success/20 to-success/5"
    }
  ];

  return (
    <Card className="bg-gray-800/80 border-gray-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Monitoramento de Rede
        </CardTitle>
        <CardDescription className="text-gray-400">
          Acesse ferramentas de monitoramento para acompanhar a saúde da sua infraestrutura
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {monitoringOptions.map((option) => {
          const IconComponent = option.icon;
          
          return (
            <Card 
              key={option.id} 
              className={`${option.gradient} border-gray-600 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}
              onClick={() => navigate(option.route)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {option.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        {option.id === "olt-dashboard" && (
                          <>
                            <div className="flex items-center gap-1">
                              <Signal className="h-3 w-3 text-success" />
                              <span className="text-xs text-gray-300">
                                {option.metrics.online} Online
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-warning" />
                              <span className="text-xs text-gray-300">
                                {option.metrics.offline} Offline
                              </span>
                            </div>
                          </>
                        )}
                        {option.id === "snmp-monitoring" && (
                          <>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-primary" />
                              <span className="text-xs text-gray-300">
                                {option.metrics.queries} Consultas
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Acessar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default MonitoringOverview;