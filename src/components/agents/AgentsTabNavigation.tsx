
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Settings, 
  Workflow, 
  Link, 
  Play, 
  FileText, 
  BarChart3, 
  GraduationCap 
} from "lucide-react";

const AgentsTabNavigation = () => {
  return (
    <TabsList className="grid w-full grid-cols-8 bg-gray-900/90 border border-gray-700 backdrop-blur-sm">
      <TabsTrigger 
        value="chat" 
        className="flex items-center gap-2 data-[state=active]:bg-3amg-orange data-[state=active]:text-white text-gray-300 hover:text-white"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </TabsTrigger>
      <TabsTrigger 
        value="configurations" 
        className="flex items-center gap-2 data-[state=active]:bg-3amg-orange data-[state=active]:text-white text-gray-300 hover:text-white"
      >
        <Settings className="h-4 w-4" />
        Configurações
      </TabsTrigger>
      <TabsTrigger 
        value="workflows" 
        className="flex items-center gap-2 data-[state=active]:bg-3amg-orange data-[state=active]:text-white text-gray-300 hover:text-white"
      >
        <Workflow className="h-4 w-4" />
        Workflows N8n
      </TabsTrigger>
      <TabsTrigger 
        value="integrations" 
        className="flex items-center gap-2 data-[state=active]:bg-3amg-orange data-[state=active]:text-white text-gray-300 hover:text-white"
      >
        <Link className="h-4 w-4" />
        Integrações
      </TabsTrigger>
      <TabsTrigger 
        value="executions" 
        className="flex items-center gap-2 data-[state=active]:bg-3amg-orange data-[state=active]:text-white text-gray-300 hover:text-white"
      >
        <Play className="h-4 w-4" />
        Execuções
      </TabsTrigger>
      <TabsTrigger 
        value="logs" 
        className="flex items-center gap-2 data-[state=active]:bg-3amg-orange data-[state=active]:text-white text-gray-300 hover:text-white"
      >
        <FileText className="h-4 w-4" />
        Logs
      </TabsTrigger>
      <TabsTrigger 
        value="metrics" 
        className="flex items-center gap-2 data-[state=active]:bg-3amg-orange data-[state=active]:text-white text-gray-300 hover:text-white"
      >
        <BarChart3 className="h-4 w-4" />
        Métricas
      </TabsTrigger>
      <TabsTrigger 
        value="training" 
        className="flex items-center gap-2 data-[state=active]:bg-3amg-orange data-[state=active]:text-white text-gray-300 hover:text-white"
      >
        <GraduationCap className="h-4 w-4" />
        Treinamento
      </TabsTrigger>
    </TabsList>
  );
};

export default AgentsTabNavigation;
