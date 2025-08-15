
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircle, Link, CheckCircle } from "lucide-react";

interface AgentsSummaryCardsProps {
  activeAgents: number;
  totalConversations: number;
  activeIntegrations: number;
  successfulExecutions: number;
}

const AgentsSummaryCards = ({
  activeAgents,
  totalConversations,
  activeIntegrations,
  successfulExecutions,
}: AgentsSummaryCardsProps) => {
  const cards = [
    {
      title: "Agentes Ativos",
      value: activeAgents,
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: "Total de Conversas",
      value: totalConversations,
      icon: MessageCircle,
      color: "text-green-400",
    },
    {
      title: "Integrações Ativas",
      value: activeIntegrations,
      icon: Link,
      color: "text-purple-400",
    },
    {
      title: "Execuções Bem-sucedidas",
      value: successfulExecutions,
      icon: CheckCircle,
      color: "text-3amg-orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className="bg-gray-900/90 border-gray-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {card.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{card.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AgentsSummaryCards;
