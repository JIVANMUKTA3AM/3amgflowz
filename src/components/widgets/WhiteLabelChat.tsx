import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, X, MessageCircle } from 'lucide-react';
import { useAgentRoute } from '@/hooks/useAgentRoute';
import { useAgentExecute } from '@/hooks/useAgentExecute';

interface WhiteLabelChatProps {
  tenantId: string;
  canal?: string;
  position?: 'bottom-right' | 'bottom-left';
  brandColor?: string;
  brandName?: string;
}

interface Message {
  id: string;
  tipo: 'user' | 'agent';
  conteudo: string;
  setor?: string;
  timestamp: Date;
}

export const WhiteLabelChat = ({
  tenantId,
  canal = 'webchat',
  position = 'bottom-right',
  brandColor = '#8B5CF6',
  brandName = 'Atendimento'
}: WhiteLabelChatProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentSetor, setCurrentSetor] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { routeMessage, isLoading: isRouting } = useAgentRoute();
  const { executeAction, isLoading: isExecuting } = useAgentExecute();

  const isLoading = isRouting || isExecuting;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mensagem de boas-vindas
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        tipo: 'agent',
        conteudo: `Olá! Bem-vindo ao ${brandName}. Como posso ajudar você hoje?`,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length, brandName]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      tipo: 'user',
      conteudo: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Fase 1: Roteamento
    const routeResult = await routeMessage({
      tenant_id: tenantId,
      canal,
      mensagem: inputValue,
      contexto: {
        session_id: `webchat_${Date.now()}`,
        setor_atual: currentSetor
      }
    });

    if (!routeResult) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        tipo: 'agent',
        conteudo: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date()
      }]);
      return;
    }

    setCurrentSetor(routeResult.setor_destino);

    // Fase 2: Execução
    const executeResult = await executeAction({
      tenant_id: tenantId,
      setor: routeResult.setor_destino,
      acao: 'responder',
      parametros: {
        mensagem_original: inputValue,
        intencao: routeResult.intencao,
        ...routeResult.payload
      },
      tipo_agente: 'externo'
    });

    if (executeResult) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        tipo: 'agent',
        conteudo: executeResult.resposta,
        setor: routeResult.setor_destino,
        timestamp: new Date()
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      {!isOpen ? (
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:scale-110 transition-transform"
          style={{ backgroundColor: brandColor }}
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="w-[380px] h-[600px] shadow-2xl flex flex-col">
          {/* Header */}
          <div 
            className="p-4 rounded-t-lg text-white flex items-center justify-between"
            style={{ backgroundColor: brandColor }}
          >
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">{brandName}</h3>
                <p className="text-xs opacity-90">Atendimento via IA</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.tipo === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.tipo === 'agent' && (
                    <div className="flex-shrink-0">
                      <div 
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: brandColor }}
                      >
                        <Bot className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[75%] rounded-lg p-3 ${
                      message.tipo === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.setor && (
                      <Badge variant="outline" className="mb-2 text-xs">
                        {message.setor}
                      </Badge>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.conteudo}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>

                  {message.tipo === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <CardContent className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                style={{ backgroundColor: brandColor }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by 3AMG Flowz
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
