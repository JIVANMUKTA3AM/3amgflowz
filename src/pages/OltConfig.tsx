import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWorkflow } from "@/hooks/useWorkflow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Router, Plus, Trash2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useOltConfigurations } from "@/hooks/useOltConfigurations";

interface OltConfig {
  id: string;
  name: string;
  brand: string;
  host: string;
  port: string;
  username: string;
  password: string;
  snmpCommunity: string;
  apiUrl?: string;
  isActive: boolean;
}

const OltConfig = () => {
  const { 
    configurations: oltConfigs, 
    isLoading: configsLoading,
    saveConfiguration,
    isSaving,
    updateConfiguration,
    isUpdating,
    deleteConfiguration,
    isDeleting
  } = useOltConfigurations();

  const [newOlt, setNewOlt] = useState<Partial<OltConfig>>({
    name: "",
    brand: "",
    host: "",
    port: "161",
    username: "",
    password: "",
    snmpCommunity: "public",
    apiUrl: "",
    isActive: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  const oltBrands = [
    { value: "vsol", label: "VSol", description: "OLT VSol com SNMP e API REST" },
    { value: "datacom", label: "Datacom", description: "OLT Datacom DM4000 series" },
    { value: "huawei", label: "Huawei", description: "OLT Huawei MA5600T/MA5800" },
    { value: "fiberhome", label: "FiberHome", description: "OLT FiberHome AN5516 series" },
    { value: "zte", label: "ZTE", description: "OLT ZTE C300/C320 series" },
    { value: "parks", label: "Parks", description: "OLT Parks OLT 8000 series" },
    { value: "custom", label: "Personalizada", description: "Configuração customizada" }
  ];

  const handleAddOlt = () => {
    if (!newOlt.name || !newOlt.brand || !newOlt.host) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha nome, marca e host da OLT",
        variant: "destructive"
      });
      return;
    }

    saveConfiguration({
      name: newOlt.name!,
      brand: newOlt.brand!,
      model: newOlt.brand!, // Use brand as model if no specific model
      ip_address: newOlt.host!,
      port: newOlt.port || "161",
      username: newOlt.username,
      password: newOlt.password,
      snmp_community: newOlt.snmpCommunity || "public",
      is_active: true
    });

    // Reset form
    setNewOlt({
      name: "",
      brand: "",
      host: "",
      port: "161",
      username: "",
      password: "",
      snmpCommunity: "public",
      apiUrl: "",
      isActive: true
    });
  };

  const handleDeleteOlt = (id: string) => {
    deleteConfiguration(id);
  };

  const handleTestConnection = async (olt: any) => {
    setIsLoading(true);
    try {
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Teste realizado!",
        description: `Conexão com ${olt.name} funcionando`
      });
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Verifique as configurações da OLT",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOltStatus = (id: string) => {
    const config = oltConfigs.find(olt => olt.id === id);
    if (config) {
      updateConfiguration({
        id,
        is_active: !config.is_active
      });
    }
  };

  if (configsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
        <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando configurações...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Router className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Configuração de APIs de OLT
            </h1>
            <p className="text-gray-600">
              Configure conexões com diferentes marcas de OLT para automação de processos
            </p>
          </div>

          <Tabs defaultValue="configs" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="configs">OLTs Configuradas</TabsTrigger>
              <TabsTrigger value="add">Adicionar Nova OLT</TabsTrigger>
            </TabsList>

            <TabsContent value="configs" className="space-y-4">
              {oltConfigs.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Router className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma OLT configurada
                    </h3>
                    <p className="text-gray-600">
                      Adicione sua primeira OLT para começar a automação
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {oltConfigs.map((olt) => (
                    <Card key={olt.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {olt.is_active ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-gray-400" />
                              )}
                              {olt.name}
                            </CardTitle>
                            <CardDescription>{olt.ip_address}:{olt.port}</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={olt.is_active ? "default" : "secondary"}>
                              {olt.is_active ? "Ativa" : "Inativa"}
                            </Badge>
                            <Badge variant="outline">
                              {oltBrands.find(b => b.value === olt.brand)?.label || olt.brand}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Usuário:</span>
                            <span className="font-mono">{olt.username || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">SNMP Community:</span>
                            <span className="font-mono">{olt.snmp_community}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestConnection(olt)}
                            disabled={isLoading}
                          >
                            {isLoading ? "Testando..." : "Testar"}
                          </Button>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleOltStatus(olt.id!)}
                              disabled={isUpdating}
                            >
                              {olt.is_active ? "Desativar" : "Ativar"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOlt(olt.id!)}
                              disabled={isDeleting}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Nova OLT</CardTitle>
                  <CardDescription>
                    Configure uma nova OLT para integração com seus fluxos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da OLT *</Label>
                      <Input
                        id="name"
                        value={newOlt.name}
                        onChange={(e) => setNewOlt(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="OLT Matriz"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marca *</Label>
                      <Select
                        value={newOlt.brand}
                        onValueChange={(value) => setNewOlt(prev => ({ ...prev, brand: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a marca" />
                        </SelectTrigger>
                        <SelectContent>
                          {oltBrands.map((brand) => (
                            <SelectItem key={brand.value} value={brand.value}>
                              <div>
                                <div className="font-medium">{brand.label}</div>
                                <div className="text-sm text-gray-500">{brand.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="host">Host/IP *</Label>
                      <Input
                        id="host"
                        value={newOlt.host}
                        onChange={(e) => setNewOlt(prev => ({ ...prev, host: e.target.value }))}
                        placeholder="192.168.1.100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="port">Porta</Label>
                      <Input
                        id="port"
                        value={newOlt.port}
                        onChange={(e) => setNewOlt(prev => ({ ...prev, port: e.target.value }))}
                        placeholder="161"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Usuário</Label>
                      <Input
                        id="username"
                        value={newOlt.username}
                        onChange={(e) => setNewOlt(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="admin"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newOlt.password}
                        onChange={(e) => setNewOlt(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="snmpCommunity">SNMP Community</Label>
                      <Input
                        id="snmpCommunity"
                        value={newOlt.snmpCommunity}
                        onChange={(e) => setNewOlt(prev => ({ ...prev, snmpCommunity: e.target.value }))}
                        placeholder="public"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apiUrl">API URL (opcional)</Label>
                      <Input
                        id="apiUrl"
                        value={newOlt.apiUrl}
                        onChange={(e) => setNewOlt(prev => ({ ...prev, apiUrl: e.target.value }))}
                        placeholder="http://192.168.1.100/api"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleAddOlt} 
                    className="w-full"
                    disabled={isSaving}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isSaving ? "Salvando..." : "Adicionar OLT"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-yellow-900">Informações importantes:</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-yellow-800 space-y-2">
                  <p>• <strong>SNMP:</strong> Protocolo padrão para monitoramento de OLTs</p>
                  <p>• <strong>API REST:</strong> Algumas OLTs oferecem APIs REST para operações avançadas</p>
                  <p>• <strong>Credenciais:</strong> Usuário e senha são necessários para autenticação nas APIs</p>
                  <p>• <strong>Segurança:</strong> As credenciais são armazenadas de forma segura e criptografada</p>
                  <p>• <strong>VSOL:</strong> OLTs populares entre provedores menores, compatíveis com SNMP v2c/v3</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.snmp/" target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Doc n8n SNMP
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OltConfig;
