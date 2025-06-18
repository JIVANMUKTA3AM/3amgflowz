
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAgentTasks } from "@/hooks/useAgentTasks";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle, Plus, Filter, Phone, Mail, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const GeralDashboard = () => {
  const { user } = useAuth();
  const { atendimentos, loadingAtendimentos, createAtendimento, isCreating } = useAgentTasks('geral');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newAtendimento, setNewAtendimento] = useState({
    cliente_nome: '',
    cliente_contato: '',
    tipo_atendimento: '',
    descricao: '',
    prioridade: 'media' as const,
  });

  const handleCreateAtendimento = () => {
    if (!user?.id) return;
    
    createAtendimento({
      ...newAtendimento,
      agent_id: user.id,
      status: 'pendente',
      data_abertura: new Date().toISOString(),
    });
    
    setNewAtendimento({
      cliente_nome: '',
      cliente_contato: '',
      tipo_atendimento: '',
      descricao: '',
      prioridade: 'media',
    });
    setIsCreateDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: 'bg-yellow-500',
      em_andamento: 'bg-blue-500',
      concluida: 'bg-green-500',
      cancelada: 'bg-red-500',
      pausada: 'bg-gray-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getPriorityColor = (prioridade: string) => {
    const colors = {
      baixa: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800'
    };
    return colors[prioridade as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (tipo: string) => {
    const icons = {
      duvida: HelpCircle,
      reclamacao: Mail,
      suporte: Phone,
      informacao: MessageCircle
    };
    const Icon = icons[tipo as keyof typeof icons] || MessageCircle;
    return <Icon className="h-4 w-4" />;
  };

  const filteredAtendimentos = atendimentos?.filter(atendimento => 
    filterStatus === 'all' || atendimento.status === filterStatus
  ) || [];

  const pendingCount = atendimentos?.filter(a => a.status === 'pendente').length || 0;
  const inProgressCount = atendimentos?.filter(a => a.status === 'em_andamento').length || 0;
  const completedCount = atendimentos?.filter(a => a.status === 'concluida').length || 0;

  const duvidaCount = atendimentos?.filter(a => a.tipo_atendimento === 'duvida').length || 0;
  const reclamacaoCount = atendimentos?.filter(a => a.tipo_atendimento === 'reclamacao').length || 0;
  const suporteCount = atendimentos?.filter(a => a.tipo_atendimento === 'suporte').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel de Atendimento</h1>
            <p className="text-gray-600">Gerencie atendimentos e suporte aos clientes</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Atendimento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Atendimento</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente_nome">Nome do Cliente</Label>
                <Input
                  id="cliente_nome"
                  value={newAtendimento.cliente_nome}
                  onChange={(e) => setNewAtendimento({...newAtendimento, cliente_nome: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="cliente_contato">Contato</Label>
                <Input
                  id="cliente_contato"
                  value={newAtendimento.cliente_contato}
                  onChange={(e) => setNewAtendimento({...newAtendimento, cliente_contato: e.target.value})}
                  placeholder="Telefone ou email"
                />
              </div>
              <div>
                <Label htmlFor="tipo_atendimento">Tipo de Atendimento</Label>
                <Select value={newAtendimento.tipo_atendimento} onValueChange={(value) => setNewAtendimento({...newAtendimento, tipo_atendimento: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="duvida">Dúvida</SelectItem>
                    <SelectItem value="reclamacao">Reclamação</SelectItem>
                    <SelectItem value="suporte">Suporte Técnico</SelectItem>
                    <SelectItem value="informacao">Informação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={newAtendimento.prioridade} onValueChange={(value) => setNewAtendimento({...newAtendimento, prioridade: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={newAtendimento.descricao}
                  onChange={(e) => setNewAtendimento({...newAtendimento, descricao: e.target.value})}
                  placeholder="Descreva o atendimento..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateAtendimento} disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar Atendimento'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Atendimento</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolvidos</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <Mail className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{atendimentos?.length || 0}</p>
              </div>
              <HelpCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown por tipo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dúvidas</p>
                <p className="text-xl font-bold">{duvidaCount}</p>
              </div>
              <HelpCircle className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reclamações</p>
                <p className="text-xl font-bold">{reclamacaoCount}</p>
              </div>
              <Mail className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suporte</p>
                <p className="text-xl font-bold">{suporteCount}</p>
              </div>
              <Phone className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de atendimentos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Atendimentos
            </CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="em_andamento">Em Atendimento</SelectItem>
                <SelectItem value="concluida">Resolvidos</SelectItem>
                <SelectItem value="cancelada">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loadingAtendimentos ? (
            <div className="text-center py-8">Carregando atendimentos...</div>
          ) : filteredAtendimentos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum atendimento encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAtendimentos.map((atendimento) => (
                <div key={atendimento.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {getTypeIcon(atendimento.tipo_atendimento)}
                          <h3 className="font-semibold">{atendimento.cliente_nome}</h3>
                        </div>
                        <Badge className={getStatusColor(atendimento.status)}>
                          {atendimento.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(atendimento.prioridade)}>
                          {atendimento.prioridade}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{atendimento.descricao}</p>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Tipo:</span> {atendimento.tipo_atendimento} • 
                        <span className="font-medium ml-2">Criado:</span> {new Date(atendimento.created_at).toLocaleDateString()}
                        {atendimento.cliente_contato && (
                          <>
                            <span className="font-medium ml-2">Contato:</span> {atendimento.cliente_contato}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GeralDashboard;
