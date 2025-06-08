
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AgentConfiguration } from "@/hooks/useAgentConfigurations";
import { toast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  response_time?: number;
  tokens_used?: number;
}

interface AgentChatProps {
  configurations: AgentConfiguration[];
}

const AgentChat = ({ configurations }: AgentChatProps) => {
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConfigurations = configurations.filter(config => config.is_active);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('agent-chat', {
        body: {
          agent_configuration_id: selectedAgent,
          user_message: userMessage.content,
          session_id: sessionId,
        },
      });

      if (error) throw error;

      const agentMessage: Message = {
        id: `agent_${Date.now()}`,
        type: 'agent',
        content: data.agent_response,
        timestamp: new Date(),
        response_time: data.response_time_ms,
        tokens_used: data.tokens_used,
      };

      setMessages(prev => [...prev, agentMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        type: 'agent',
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectedConfig = configurations.find(config => config.id === selectedAgent);

  const formatTime = (ms?: number) => {
    if (!ms) return "";
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Chat com Agente IA</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecione um agente" />
                </SelectTrigger>
                <SelectContent>
                  {activeConfigurations.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      <div className="flex items-center gap-2">
                        <span>{config.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {config.model}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {selectedConfig && (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>Agente:</strong> {selectedConfig.name} | 
              <strong> Modelo:</strong> {selectedConfig.model} | 
              <strong> Temperatura:</strong> {selectedConfig.temperature}
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <ScrollArea className="h-96 w-full border rounded-lg p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Bot className="mx-auto h-12 w-12 mb-4" />
                    <p>Selecione um agente e comece uma conversa!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-600 text-white'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        
                        <div className={`space-y-1 ${
                          message.type === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            {message.content}
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{message.timestamp.toLocaleTimeString('pt-BR')}</span>
                            {message.response_time && (
                              <Badge variant="outline" className="text-xs">
                                {formatTime(message.response_time)}
                              </Badge>
                            )}
                            {message.tokens_used && (
                              <Badge variant="outline" className="text-xs">
                                {message.tokens_used} tokens
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-100 text-gray-900 p-3 rounded-lg flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processando...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedAgent ? "Digite sua mensagem..." : "Selecione um agente primeiro"}
                disabled={!selectedAgent || isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!selectedAgent || !inputMessage.trim() || isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Enviar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentChat;
