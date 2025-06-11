
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot, Upload, Download, Play, TrendingUp, FileText, MessageSquare } from "lucide-react";
import { useAgentConfigurations } from "@/hooks/useAgentConfigurations";
import { toast } from "@/components/ui/use-toast";

const AgentTrainingSystem = () => {
  const { configurations, conversations } = useAgentConfigurations();
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [trainingData, setTrainingData] = useState<string>('');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [feedbackData, setFeedbackData] = useState<Array<{
    conversation_id: string;
    user_message: string;
    agent_response: string;
    feedback: 'positive' | 'negative' | 'neutral';
    improvement_note: string;
  }>>([]);

  // Simular dados de feedback de conversas
  useEffect(() => {
    if (conversations && conversations.length > 0) {
      const mockFeedback = conversations.slice(0, 10).map(conv => ({
        conversation_id: conv.id,
        user_message: conv.user_message,
        agent_response: conv.agent_response,
        feedback: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as any,
        improvement_note: ''
      }));
      setFeedbackData(mockFeedback);
    }
  }, [conversations]);

  const handleTrainAgent = async () => {
    if (!selectedAgent || !trainingData.trim()) {
      toast({
        title: "Dados incompletos",
        description: "Selecione um agente e adicione dados de treinamento.",
        variant: "destructive",
      });
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    // Simular processo de treinamento
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast({
            title: "Treinamento concluído!",
            description: "O agente foi treinado com os novos dados.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleExportConversations = () => {
    const conversationsForAgent = conversations?.filter(
      conv => conv.agent_configuration_id === selectedAgent
    );

    if (!conversationsForAgent?.length) {
      toast({
        title: "Nenhuma conversa encontrada",
        description: "Não há conversas para exportar para este agente.",
        variant: "destructive",
      });
      return;
    }

    const exportData = conversationsForAgent.map(conv => ({
      user_message: conv.user_message,
      agent_response: conv.agent_response,
      created_at: conv.created_at,
      response_time_ms: conv.response_time_ms,
      tokens_used: conv.tokens_used
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversas-agente-${selectedAgent}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Conversas exportadas!",
      description: "As conversas foram baixadas com sucesso.",
    });
  };

  const updateFeedback = (index: number, field: string, value: any) => {
    const newFeedbackData = [...feedbackData];
    newFeedbackData[index] = { ...newFeedbackData[index], [field]: value };
    setFeedbackData(newFeedbackData);
  };

  const selectedAgentConfig = configurations?.find(config => config.id === selectedAgent);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sistema de Treinamento de Agentes</h2>
        <Badge variant="outline" className="gap-2">
          <Bot className="w-4 h-4" />
          IA Avançada
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dados de Treinamento</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversas Analisadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackData.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackData.length > 0 
                    ? Math.round((feedbackData.filter(f => f.feedback === 'positive').length / feedbackData.length) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Agentes Treinados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {configurations?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="training" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="training">Treinamento</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="optimization">Otimização</TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Treinar Agente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="agent-select">Selecionar Agente</Label>
                <select
                  id="agent-select"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Selecione um agente</option>
                  {configurations?.map((config) => (
                    <option key={config.id} value={config.id}>
                      {config.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAgentConfig && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Configuração Atual</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Tipo:</strong> {selectedAgentConfig.agent_type}</div>
                    <div><strong>Modelo:</strong> {selectedAgentConfig.model}</div>
                    <div><strong>Temperatura:</strong> {selectedAgentConfig.temperature}</div>
                    <div><strong>Max Tokens:</strong> {selectedAgentConfig.max_tokens}</div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="training-data">Dados de Treinamento</Label>
                <Textarea
                  id="training-data"
                  value={trainingData}
                  onChange={(e) => setTrainingData(e.target.value)}
                  placeholder="Cole aqui os dados de treinamento no formato:&#10;&#10;Usuário: Como posso fazer um pedido?&#10;Assistente: Para fazer um pedido, acesse nosso site...&#10;&#10;Usuário: Qual o prazo de entrega?&#10;Assistente: O prazo de entrega é de 3 a 5 dias úteis..."
                  rows={10}
                />
              </div>

              {isTraining && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso do treinamento</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleTrainAgent}
                  disabled={isTraining || !selectedAgent}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isTraining ? 'Treinando...' : 'Iniciar Treinamento'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleExportConversations}
                  disabled={!selectedAgent}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Conversas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Feedback das Conversas</CardTitle>
            </CardHeader>
            <CardContent>
              {feedbackData.length > 0 ? (
                <div className="space-y-4">
                  {feedbackData.map((item, index) => (
                    <div key={item.conversation_id} className="border rounded-lg p-4">
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Mensagem do Usuário</Label>
                          <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                            {item.user_message}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Resposta do Agente</Label>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {item.agent_response}
                          </p>
                        </div>

                        <div className="flex gap-4 items-center">
                          <div>
                            <Label className="text-sm font-medium">Feedback</Label>
                            <select
                              value={item.feedback}
                              onChange={(e) => updateFeedback(index, 'feedback', e.target.value)}
                              className="ml-2 p-1 border rounded text-sm"
                            >
                              <option value="neutral">Neutro</option>
                              <option value="positive">Positivo</option>
                              <option value="negative">Negativo</option>
                            </select>
                          </div>
                          
                          <Badge 
                            variant={
                              item.feedback === 'positive' ? 'default' : 
                              item.feedback === 'negative' ? 'destructive' : 'secondary'
                            }
                          >
                            {item.feedback === 'positive' ? '👍 Positivo' : 
                             item.feedback === 'negative' ? '👎 Negativo' : '🤷 Neutro'}
                          </Badge>
                        </div>

                        <div>
                          <Label htmlFor={`note-${index}`} className="text-sm font-medium">
                            Nota de Melhoria
                          </Label>
                          <Input
                            id={`note-${index}`}
                            value={item.improvement_note}
                            onChange={(e) => updateFeedback(index, 'improvement_note', e.target.value)}
                            placeholder="Como esta resposta pode ser melhorada?"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma conversa disponível para análise de feedback.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Otimização Automática</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center py-8">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Otimização Inteligente</h3>
                  <p className="text-gray-600 mb-4">
                    Sistema de otimização automática baseado em feedback e métricas de performance.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Ajuste de Temperatura</h4>
                      <p className="text-gray-700">
                        Ajusta automaticamente a criatividade das respostas baseado no feedback dos usuários.
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Otimização de Prompts</h4>
                      <p className="text-gray-700">
                        Refina os prompts dos agentes para melhorar a qualidade das respostas.
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Análise de Sentimento</h4>
                      <p className="text-gray-700">
                        Analisa o sentimento das conversas para identificar áreas de melhoria.
                      </p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">A/B Testing</h4>
                      <p className="text-gray-700">
                        Testa diferentes configurações para encontrar a melhor performance.
                      </p>
                    </div>
                  </div>
                  <Button className="mt-6" disabled>
                    <Bot className="w-4 h-4 mr-2" />
                    Iniciar Otimização (Em Breve)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentTrainingSystem;
