
import { Card, CardContent } from "@/components/ui/card";
import { Bot, MessageCircle, Link, Zap } from "lucide-react";

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
  successfulExecutions
}: AgentsSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Bot className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Agentes Ativos</p>
              <p className="text-2xl font-bold text-gray-900">{activeAgents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <MessageCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Conversas</p>
              <p className="text-2xl font-bold text-gray-900">{totalConversations}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Link className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Integrações Ativas</p>
              <p className="text-2xl font-bold text-gray-900">{activeIntegrations}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Execuções Bem-sucedidas</p>
              <p className="text-2xl font-bold text-gray-900">{successfulExecutions}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentsSummaryCards;
