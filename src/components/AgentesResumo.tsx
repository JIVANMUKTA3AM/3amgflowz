
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
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
        description: `${agent.name} foi ${isActivating ? "ativado" : "desativado"} com sucesso.`,
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Meus Agentes</CardTitle>
        <CardDescription>
          Gerencie os agentes ativos em sua conta.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {activeCount} de {agents.length} agentes ativos
              </span>
            </div>
            
            {agents.map((agent) => (
              <div 
                key={agent.id} 
                className="flex items-center justify-between border-b pb-2 last:border-none"
              >
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={agent.is_active ? "default" : "outline"} 
                    className="w-2 h-2 p-0 rounded-full"
                  />
                  <span>{agent.name.split(" ")[1]}</span>
                </div>
                <Switch
                  id={`agent-switch-mini-${agent.id}`}
                  checked={agent.is_active}
                  disabled={isSaving === agent.id}
                  onCheckedChange={() => toggleAgent(agent)}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleGerenciarClick}>
          Gerenciar Agentes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AgentesResumo;
