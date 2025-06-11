
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import AgentChat from "@/components/agents/AgentChat";

interface ChatTabProps {
  configurations: any[];
}

const ChatTab = ({ configurations }: ChatTabProps) => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
        <CardTitle className="text-2xl text-3amg-purple flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Teste seus Agentes
        </CardTitle>
        <CardDescription className="text-gray-600">
          Converse com seus agentes para testar respostas e configurações
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <AgentChat configurations={configurations} />
      </CardContent>
    </Card>
  );
};

export default ChatTab;
