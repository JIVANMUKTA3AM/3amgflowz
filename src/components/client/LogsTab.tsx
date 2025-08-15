
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import ConversationLogs from "@/components/agents/ConversationLogs";

interface LogsTabProps {
  conversations: any[];
  configurations: any[];
}

const LogsTab = ({ conversations, configurations }: LogsTabProps) => {
  return (
    <Card className="border-0 shadow-xl bg-gray-900/90 backdrop-blur-sm border-gray-700">
      <CardHeader className="bg-gradient-to-r from-3amg-orange/10 to-3amg-purple/10 rounded-t-lg">
        <CardTitle className="text-2xl text-3amg-orange flex items-center gap-2">
          <Users className="w-6 h-6" />
          Histórico de Conversas
        </CardTitle>
        <CardDescription className="text-gray-300">
          Veja todas as conversas dos seus clientes com os agentes
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ConversationLogs 
          conversations={conversations} 
          configurations={configurations} 
        />
      </CardContent>
    </Card>
  );
};

export default LogsTab;
