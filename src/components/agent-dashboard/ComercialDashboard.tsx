
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAgentTasks } from "@/hooks/useAgentTasks";
import { useAuth } from "@/contexts/AuthContext";
import { DollarSign, Plus, Filter, TrendingUp, Users, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const ComercialDashboard = () => {
  const { user } = useAuth();
  const { propostas, loadingPropostas, createProposta, isCreating } = useAgentTasks('comercial');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newProposta, setNewProposta] = useState({
    cliente_nome: '',
    cliente_email: '',
    cliente_telefone: '',
    plano_interesse: '',
    valor_proposto: 0,
    prioridade: 'media' as const,
  });

  const handleCreateProposta = () => {
    if (!user?.id) return;
    
    createProposta({
      ...newProposta,
      agent_id: user.id,
      status: 'pendente',
      data_abertura: new Date().toISOString(),
    });
    
    setNewProposta({
      cliente_nome: '',
      cliente_email: '',
      cliente_telefone: '',
      plano_interesse: '',
      valor_proposto: 0,
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

  const filteredPropostas = propostas?.filter(proposta => 
    filterStatus === 'all' || proposta.status === filterStatus
  ) || [];

  const pendingCount = propostas?.filter(p => p.status === 'pendente').length || 0;
  const inProgressCount = propostas?.filter(p => p.status === 'em_andamento').length || 0;
  const completedCount = propostas?.filter(p => p.status === 'concluida').length || 0;
  const totalValue = propostas?.reduce((sum, p) => sum + (p.valor_proposto || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Comercial</h1>
            <p className="text-gray-600">Gerencie propostas e vendas</p>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Proposta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Criar Nova Proposta Comercial</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente_nome">Nome do Cliente</Label>
                <Input
                  id="cliente_nome"
                  value={newProposta.cliente_nome}
                  onChange={(e) => setNewProposta({...newProposta, cliente_nome: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="cliente_email">Email</Label>
                <Input
                  id="cliente_email"
                  type="email"
                  value={newProposta.cliente_email}
                  onChange={(e) => setNewProposta({...newProposta, cliente_email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="cliente_telefone">Telefone</Label>
                <Input
                  id="cliente_telefone"
                  value={newProposta.cliente_telefone}
                  onChange={(e) => setNewProposta({...newProposta, cliente_telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="plano_interesse">Plano de Interesse</Label>
                <Select value={newProposta.plano_interesse} onValueChange={(value) => setNewProposta({...newProposta, plano_interesse: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Básico - 100MB</SelectItem>
                    <SelectItem value="intermediario">Intermediário - 300MB</SelectItem>
                    <SelectItem value="avancado">Avançado - 600MB</SelectItem>
                    <SelectItem value="premium">Premium - 1GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="valor_proposto">Valor Proposto (R$)</Label>
                <Input
                  id="valor_proposto"
                  type="number"
                  value={newProposta.valor_proposto}
                  onChange={(e) => setNewProposta({...newProposta, valor_proposto: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={newProposta.prioridade} onValueChange={(value) => setNewProposta({...newProposta, prioridade: value as any})}>
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
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateProposta} disabled={isCreating}>
                {isCreating ? 'Criando...' : 'Criar Proposta'}
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
                <p className="text-sm text-gray-600">Propostas Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <Target className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Negociação</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vendas Fechadas</p>
                <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de propostas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Propostas Comerciais
            </CardTitle>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="em_andamento">Em Negociação</SelectItem>
                <SelectItem value="concluida">Fechadas</SelectItem>
                <SelectItem value="cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loadingPropostas ? (
            <div className="text-center py-8">Carregando propostas...</div>
          ) : filteredPropostas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma proposta encontrada
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPropostas.map((proposta) => (
                <div key={proposta.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{proposta.cliente_nome}</h3>
                        <Badge className={getStatusColor(proposta.status)}>
                          {proposta.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(proposta.prioridade)}>
                          {proposta.prioridade}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Plano:</span> {proposta.plano_interesse}</p>
                        <p><span className="font-medium">Valor:</span> R$ {(proposta.valor_proposto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        {proposta.cliente_email && (
                          <p><span className="font-medium">Email:</span> {proposta.cliente_email}</p>
                        )}
                        {proposta.cliente_telefone && (
                          <p><span className="font-medium">Tel:</span> {proposta.cliente_telefone}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        <span className="font-medium">Criado:</span> {new Date(proposta.created_at).toLocaleDateString()}
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

export default ComercialDashboard;
