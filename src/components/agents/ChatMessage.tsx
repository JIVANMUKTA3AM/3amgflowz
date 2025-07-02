
import { Badge } from "@/components/ui/badge";
import { Bot, User, Clock, Zap } from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  response_time?: number;
  tokens_used?: number;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const formatTime = (ms?: number) => {
    if (!ms) return "";
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div
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
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{message.timestamp.toLocaleTimeString('pt-BR')}</span>
            {message.response_time && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(message.response_time)}
              </Badge>
            )}
            {message.tokens_used && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {message.tokens_used} tokens
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
