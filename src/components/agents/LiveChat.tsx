import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Loader2, Bot, User, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { AgentConfiguration } from "@/hooks/useAgentConfigurations";

interface ChatMessage {
  id: string;
  message_type: 'user' | 'agent' | 'system';
  content: string;
  sent_at: string;
  metadata?: any;
}

interface LiveChatProps {
  agentConfig: AgentConfiguration;
  sessionId?: string;
}

const LiveChat = ({ agentConfig, sessionId: initialSessionId }: LiveChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(initialSessionId || "");
  const [isConnected, setIsConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Carregar mensagens existentes da sessão
  useEffect(() => {
    if (sessionId && user) {
      loadChatHistory();
    }
  }, [sessionId, user]);

  const loadChatHistory = async () => {
    if (!sessionId || !user) return;

    try {
      // Buscar sessão de chat
      const { data: chatSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (sessionError || !chatSession) {
        console.log('No existing chat session found');
        return;
      }

      // Buscar mensagens da sessão
      const { data: chatMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_session_id', chatSession.id)
        .order('sent_at', { ascending: true });

      if (messagesError) {
        console.error('Error loading chat history:', messagesError);
        return;
      }

      setMessages(chatMessages || []);
      setIsConnected(true);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Adicionar mensagem do usuário na interface imediatamente
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      message_type: 'user',
      content: userMessage,
      sent_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      console.log('Sending message to agent:', { userMessage, agentConfig: agentConfig.id });

      const { data, error } = await supabase.functions.invoke('agent-chat', {
        body: {
          message: userMessage,
          agentConfigId: agentConfig.id,
          sessionId: sessionId || undefined,
          channelType: 'web'
        }
      });

      if (error) {
        throw error;
      }

      console.log('Agent response received:', data);

      if (!data.success) {
        throw new Error(data.error || 'Erro na resposta do agente');
      }

      // Atualizar sessionId se foi criado
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
        setIsConnected(true);
      }

      // Adicionar resposta do agente
      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        message_type: 'agent',
        content: data.response,
        sent_at: new Date().toISOString(),
        metadata: {
          response_time_ms: data.responseTime,
          tokens_used: data.tokensUsed
        }
      };

      // Remover mensagem temporária e adicionar mensagens finais
      setMessages(prev => {
        const withoutTemp = prev.filter(msg => !msg.id.startsWith('temp-'));
        return [
          ...withoutTemp,
          { ...tempUserMessage, id: `user-${Date.now()}` },
          agentMessage
        ];
      });

      toast({
        title: "Resposta recebida",
        description: `${agentConfig.name} respondeu em ${data.responseTime}ms`,
      });

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remover mensagem temporária em caso de erro
      setMessages(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
      
      toast({
        title: "Erro ao enviar mensagem",
        description: error instanceof Error ? error.message : "Tente novamente em alguns instantes",
        variant: "destructive",
      });
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

  const startNewSession = () => {
    setMessages([]);
    setSessionId("");
    setIsConnected(false);
    toast({
      title: "Nova conversa iniciada",
      description: "Histórico limpo. Digite uma mensagem para começar.",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'agent':
        return <Bot className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{agentConfig.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {agentConfig.agent_type.replace('_', ' ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Conectado" : "Desconectado"}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startNewSession}
              disabled={isLoading}
            >
              Nova Conversa
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Inicie uma conversa com {agentConfig.name}</p>
                <p className="text-sm">Digite uma mensagem abaixo para começar</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.message_type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={
                      message.message_type === 'user' 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-orange-100 text-orange-600"
                    }>
                      {getMessageIcon(message.message_type)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 space-y-1 ${
                    message.message_type === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block max-w-[80%] p-3 rounded-lg ${
                      message.message_type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTime(message.sent_at)}</span>
                      {message.metadata?.response_time_ms && (
                        <span>• {message.metadata.response_time_ms}ms</span>
                      )}
                      {message.metadata?.tokens_used && (
                        <span>• {message.metadata.tokens_used} tokens</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-orange-100 text-orange-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-600">{agentConfig.name} está digitando...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Digite sua mensagem para ${agentConfig.name}...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputMessage.trim()}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {sessionId && (
            <p className="text-xs text-muted-foreground mt-2">
              Sessão: {sessionId}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveChat;