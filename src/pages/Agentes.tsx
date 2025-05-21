
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface Agent {
  id: string;
  type: "atendimento" | "comercial" | "suporte_tecnico";
  name: string;
  description: string;
  base_price: number;
  features: string[];
  is_active?: boolean;
}

const Agentes = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);

  // Carregar os agentes disponíveis e o status de ativação do usuário
  useEffect(() => {
    const loadAgents = async () => {
      setIsLoading(true);
      try {
        // Buscar todos os agentes disponíveis
        const { data: agentsData, error: agentsError } = await supabase
          .from("agents")
          .select("*")
          .order("base_price");

        if (agentsError) throw agentsError;

        // Buscar os agentes que o usuário já ativou
        const { data: userAgentsData, error: userAgentsError } = await supabase
          .from("user_agents")
          .select("agent_type, is_active");

        if (userAgentsError) throw userAgentsError;

        // Mapear os dados dos agentes com o status de ativação do usuário
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
      } catch (error) {
        console.error("Erro ao carregar agentes:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os agentes disponíveis.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, []);

  // Função para ativar/desativar um agente
  const toggleAgent = async (agent: Agent) => {
    setIsSaving(agent.id);
    try {
      const isActivating = !agent.is_active;
      
      if (isActivating) {
        // Inserir/atualizar registro na tabela user_agents
        const { error } = await supabase.from("user_agents").upsert({
          agent_type: agent.type,
          is_active: true,
        });

        if (error) throw error;
      } else {
        // Atualizar para is_active = false
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

      toast({
        title: "Sucesso",
        description: isActivating
          ? `Agente ${agent.name} ativado com sucesso.`
          : `Agente ${agent.name} desativado com sucesso.`,
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

  // Função para formatar o preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price / 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meus Agentes</h1>
          <p className="text-gray-600">
            Gerencie os agentes ativos em sua conta. Ative ou desative conforme sua necessidade.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{agent.name}</CardTitle>
                    <Badge variant={agent.is_active ? "outline" : "secondary"}>
                      {agent.is_active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <CardDescription>{formatPrice(agent.base_price)}/mês</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="mb-4">{agent.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Funcionalidades:</h4>
                    <ul className="space-y-1">
                      {agent.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature.replace(/_/g, " ")}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between bg-slate-50">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`agent-switch-${agent.id}`}
                      checked={agent.is_active}
                      disabled={isSaving === agent.id}
                      onCheckedChange={() => toggleAgent(agent)}
                    />
                    <label htmlFor={`agent-switch-${agent.id}`}>
                      {agent.is_active ? "Ativado" : "Desativado"}
                    </label>
                  </div>
                  <Button
                    variant={agent.is_active ? "destructive" : "default"}
                    size="sm"
                    disabled={isSaving === agent.id}
                    onClick={() => toggleAgent(agent)}
                  >
                    {isSaving === agent.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : agent.is_active ? (
                      <XCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {agent.is_active ? "Desativar" : "Ativar"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Agentes;
