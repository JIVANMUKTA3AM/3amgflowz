
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, Zap, Search, Filter } from "lucide-react";
import { AgentConversation, AgentConfiguration } from "@/hooks/useAgentConfigurations";

interface ConversationLogsProps {
  conversations: AgentConversation[];
  configurations: AgentConfiguration[];
}

const ConversationLogs = ({ conversations, configurations }: ConversationLogsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.user_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.agent_response.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgent = selectedAgent === "all" || conv.agent_configuration_id === selectedAgent;
    const matchesDate = selectedDate === "all" || 
                       new Date(conv.created_at).toDateString() === new Date(selectedDate).toDateString();
    
    return matchesSearch && matchesAgent && matchesDate;
  });

  const formatResponseTime = (ms?: number) => {
    if (!ms) return "N/A";
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  const getAgentName = (configId: string) => {
    const config = configurations.find(c => c.id === configId);
    return config?.name || "Agente Desconhecido";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedAgent} onValueChange={setSelectedAgent}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filtrar por agente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Agentes</SelectItem>
            {configurations.map((config) => (
              <SelectItem key={config.id} value={config.id}>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </div>

      <div className="space-y-4">
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma conversa encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <Card key={conversation.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getAgentName(conversation.agent_configuration_id)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(conversation.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {conversation.response_time_ms && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatResponseTime(conversation.response_time_ms)}
                      </div>
                    )}
                    {conversation.tokens_used && (
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {conversation.tokens_used} tokens
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Usuário:</div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    {conversation.user_message}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Agente:</div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {conversation.agent_response}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationLogs;
