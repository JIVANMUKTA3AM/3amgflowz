
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAgentTasks } from "@/hooks/useAgentTasks";
import { useAuth } from "@/contexts/AuthContext";
import { Wrench, Plus, Filter, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const TecnicoDashboard = () => {
  const { user } = useAuth();
  const { tickets, loadingTickets, createTicket, isCreating } = useAgentTasks('tecnico');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newTicket, setNewTicket] = useState({
    cliente_nome: '',
    cliente_telefone: '',
    cliente_endereco: '',
    tipo_servico: '',
    descricao: '',
    prioridade: 'media' as const,
  });

  const handleCreateTicket = () => {
    if (!user?.id) return;
    
    createTicket({
      ...newTicket,
      agent_id: user.id,
      status: 'pendente',
      data_abertura: new Date().toISOString(),
    });
    
    setNewTicket({
      cliente_nome: '',
      cliente_telefone: '',
      cliente_endereco: '',
      tipo_servico: '',
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

  const filteredTickets = tickets?.filter(ticket => 
    filterStatus === 'all' || ticket.status === filterStatus
  ) || [];

  const pendingCount = tickets?.filter(t => t.status === 'pendente').length || 0;
  const inProgressCount = tickets?.filter(t => t.status === 'em_andamento').length || 0;
  const completedCount = tickets?.filter(t => t.status === 'concluida').length || 0;

  return (
    <div className="space-y-6">
      {/* Header com métricas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Técnico</h1>
            <p className="text-gray-600">Gerencie instalações e tickets técnicos</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Ticket Técnico</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente_nome">Nome do Cliente</Label>
                <Input
                  id="cliente_nome"
                  value={newTicket.cliente_nome}
                  onChange={(e) => setNewTicket({...newTicket, cliente_nome: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="cliente_telefone">Telefone</Label>
                <Input
                  id="cliente_telefone"
                  value={newTicket.cliente_telefone}
                  onChange={(e) => setNewTicket({...newTicket, cliente_telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="cliente_endereco">Endereço</Label>
                <Input
                  id="cliente_endereco"
                  value={newTicket.cliente_endereco}
                  onChange={(e) => setNewTicket({...newTicket, cliente_endereco: e.target.value})}
                  placeholder="Endereço completo"
                />
              </div>
              <div>
                <Label htmlFor="tipo_servico">Tipo de Serviço</Label>
                <Select value={newTicket.tipo_servico} onValueChange={(value) => setNewTicket({...newTicket, tipo_servico: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instalacao">Instalação</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="reparo">Reparo</SelectItem>
                    <SelectItem value="upgrade">Upgrade</SelectItem>
                    <SelectItem value="configuracao_ont">Configuração ONT</SelectItem>
                    <SelectItem value="reset_equipamento">Reset Equipamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={newTicket.prioridade} onValueChange={(value) => setNewTicket({...newTicket, prioridade: value as any})}>
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
                  value={newTicket.descricao}
                  onChange={(e) => setNewTicket({...newTicket, descricao: e.target.value})}
                  placeholder="Descreva o serviço ou problema..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTicket} disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar Ticket'}
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
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{tickets?.length || 0}</p>
              </div>
              <Wrench className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Tickets */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Tickets Técnicos
            </CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluídos</SelectItem>
                <SelectItem value="cancelada">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loadingTickets ? (
            <div className="text-center py-8">Carregando tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum ticket encontrado
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{ticket.cliente_nome}</h3>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(ticket.prioridade)}>
                          {ticket.prioridade}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ticket.descricao}</p>
                      <div className="text-xs text-gray-500">
                        <span className="font-medium">Tipo:</span> {ticket.tipo_servico} • 
                        <span className="font-medium ml-2">Criado:</span> {new Date(ticket.created_at).toLocaleDateString()}
                        {ticket.cliente_telefone && (
                          <>
                            <span className="font-medium ml-2">Tel:</span> {ticket.cliente_telefone}
                          </>
                        )}
                      </div>
                      {ticket.cliente_endereco && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Endereço:</span> {ticket.cliente_endereco}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Executar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nota sobre comandos HTTP */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Execução de Comandos nas OLTs</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>• Os comandos nas OLTs serão executados via <strong>requisições HTTP</strong></p>
          <p>• Configure as APIs das OLTs na seção de configurações</p>
          <p>• Os tickets podem incluir comandos automáticos baseados no tipo de serviço</p>
          <p>• Histórico de execuções ficará registrado em cada ticket</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TecnicoDashboard;
