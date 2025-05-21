
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
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
  const [activeCount, setActiveCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAgentsStatus = async () => {
      try {
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
      } finally {
        setIsLoading(false);
      }
    };

    loadAgentsStatus();
  }, []);

  const handleGerenciarClick = () => {
    navigate("/agentes");
  };

  return (
    <Card>
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
          <div className="space-y-2">
            <div className="flex justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {activeCount} de {agents.length} agentes ativos
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {agents.map((agent) => (
                <Badge
                  key={agent.id}
                  variant={agent.is_active ? "default" : "outline"}
                  className="justify-center py-2"
                >
                  {agent.name.split(" ")[1]}
                </Badge>
              ))}
            </div>
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
