
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Settings, Zap, Link, Play, BarChart3 } from "lucide-react";

const AgentsTabNavigation = () => {
  return (
    <TabsList className="grid w-full grid-cols-8 mb-8">
      <TabsTrigger value="chat" className="gap-2">
        <MessageCircle className="h-4 w-4" />
        Chat
      </TabsTrigger>
      <TabsTrigger value="configurations" className="gap-2">
        <Settings className="h-4 w-4" />
        Configurações
      </TabsTrigger>
      <TabsTrigger value="workflows" className="gap-2">
        <Zap className="h-4 w-4" />
        Workflows N8n
      </TabsTrigger>
      <TabsTrigger value="integrations" className="gap-2">
        <Link className="h-4 w-4" />
        Integrações
      </TabsTrigger>
      <TabsTrigger value="executions" className="gap-2">
        <Play className="h-4 w-4" />
        Execuções
      </TabsTrigger>
      <TabsTrigger value="logs" className="gap-2">
        <MessageCircle className="h-4 w-4" />
        Logs
      </TabsTrigger>
      <TabsTrigger value="metrics" className="gap-2">
        <BarChart3 className="h-4 w-4" />
        Métricas
      </TabsTrigger>
      <TabsTrigger value="training" className="gap-2">
        <Play className="h-4 w-4" />
        Treinamento
      </TabsTrigger>
    </TabsList>
  );
};

export default AgentsTabNavigation;
