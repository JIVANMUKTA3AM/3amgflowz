
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, CheckCircle, XCircle, Users, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface Agent {
  id: string;
  type: string;
  name: string;
  is_active?: boolean;
}

const AgentesResumo = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState(0);
  const navigate = useNavigate();

  // Função para mapear os nomes dos agentes
  const getAgentDisplayName = (type: string) => {
    switch (type) {
      case 'atendimento':
        return 'Agente de Atendimento';
      case 'comercial':
        return 'Agente Comercial';
      case 'suporte_tecnico':
        return 'Agente de Suporte Técnico';
      default:
        return type;
    }
  };

  useEffect(() => {
    const loadAgentsStatus = async () => {
      try {
        setIsLoading(true);
        const { data: agentsData, error: agentsError } = await supabase
          .from("agents")
          .select("id, type, name")
          .order("base_price");

        if (agentsError) throw agentsError;

        const { data: userAgentsData, error: userAgentsError } = await supabase
          .from("user_agents")
          .select("agent_type, is_active");

        if (userAgentsError) throw userAgentsError;

        const mappedAgents = agentsData.map((agent) => {
          const userAgent = userAgentsData?.find(
            (ua) => ua.agent_type === agent.type
          );
          return {
            ...agent,
            is_active: userAgent ? userAgent.is_active : false,
          };
        });

        setAgents(mappedAgents);
        setActiveCount(
          mappedAgents.filter((agent) => agent.is_active).length
        );
      } catch (error) {
        console.error("Erro ao carregar status dos agentes:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar informações dos agentes.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentsStatus();
  }, []);

  const toggleAgent = async (agent: Agent) => {
    setIsSaving(agent.id);
    try {
      const isActivating = !agent.is_active;
      
      if (isActivating) {
        const { error } = await supabase.from("user_agents").upsert({
          agent_type: agent.type,
          is_active: true,
        });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_agents")
          .update({ is_active: false })
          .eq("agent_type", agent.type);

        if (error) throw error;
      }

      // Atualizar estado local
      setAgents((prevAgents) =>
        prevAgents.map((a) =>
          a.id === agent.id ? { ...a, is_active: !a.is_active } : a
        )
      );
      
      const newActiveCount = isActivating 
        ? activeCount + 1 
        : activeCount - 1;
      
      setActiveCount(newActiveCount);

      toast({
        title: isActivating ? "Agente ativado" : "Agente desativado",
        description: `${getAgentDisplayName(agent.type)} foi ${isActivating ? "ativado" : "desativado"} com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao alterar status do agente:", error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar o status do agente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(null);
    }
  };

  const handleGerenciarClick = () => {
    navigate("/agentes");
  };

  return (
    <Card className="h-full bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in hover:scale-[1.02]">
      <CardHeader className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-t-lg"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-3amg rounded-full flex items-center justify-center shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl bg-gradient-3amg bg-clip-text text-transparent">Meus Agentes</CardTitle>
              <CardDescription className="text-gray-600">
                Gerencie os agentes ativos em sua conta
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 border border-purple-200/50">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm font-semibold text-gray-700">{activeCount}/{agents.length}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="text-sm text-gray-500">Carregando agentes...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progresso de Ativação</span>
                <span className="text-sm text-purple-600 font-semibold">
                  {Math.round((activeCount / agents.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-3amg h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${(activeCount / agents.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Agents List */}
            <div className="space-y-3">
              {agents.map((agent, index) => (
                <div 
                  key={agent.id} 
                  className="group flex items-center justify-between p-3 rounded-lg border border-gray-200/60 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:border-purple-300/60 transition-all duration-300 hover:shadow-md animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {agent.is_active ? (
                        <CheckCircle className="w-5 h-5 text-green-500 drop-shadow-sm" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      {agent.is_active && (
                        <div className="absolute inset-0 w-5 h-5 bg-green-400 rounded-full animate-ping opacity-20"></div>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
                        {getAgentDisplayName(agent.type)}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={agent.is_active ? "default" : "outline"} 
                          className={`text-xs ${
                            agent.is_active 
                              ? "bg-green-100 text-green-700 border-green-300" 
                              : "bg-gray-100 text-gray-500 border-gray-300"
                          }`}
                        >
                          {agent.is_active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSaving === agent.id && (
                      <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                    )}
                    <Switch
                      id={`agent-switch-mini-${agent.id}`}
                      checked={agent.is_active}
                      disabled={isSaving === agent.id}
                      onCheckedChange={() => toggleAgent(agent)}
                      className="data-[state=checked]:bg-gradient-3amg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="relative">
        <Button 
          className="w-full bg-gradient-3amg hover:bg-gradient-3amg-light text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]" 
          onClick={handleGerenciarClick}
        >
          <Users className="w-4 h-4 mr-2" />
          Gerenciar Agentes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentesResumo;
