import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Phone, Mail, HelpCircle, Plus, AlertTriangle, CheckCircle, Clock, Users, Headphones, Shield, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceMetrics {
  pendentes: number;
  emAtendimento: number;
  resolvidos: number;
  total: number;
  duvidas: number;
  reclamacoes: number;
  suporte: number;
}

interface Ticket {
  id: string;
  name: string;
  type: 'suporte' | 'duvida' | 'reclamacao';
  status: 'pendente' | 'em_atendimento' | 'resolvido';
  priority: 'alta' | 'media' | 'baixa';
  message: string;
  contact: string;
  created: string;
}

const AttendancePanel = () => {
  const [filter, setFilter] = useState("todos");
  
  const metrics: AttendanceMetrics = {
    pendentes: 8,
    emAtendimento: 3,
    resolvidos: 25,
    total: 36,
    duvidas: 12,
    reclamacoes: 6,
    suporte: 18
  };

  // Dados do SLA (Tempo Médio de Resolução em horas)
  const slaData = [
    { periodo: 'Jan', tempoMedio: 2.3, sla: 4 },
    { periodo: 'Fev', tempoMedio: 1.8, sla: 4 },
    { periodo: 'Mar', tempoMedio: 2.1, sla: 4 },
    { periodo: 'Abr', tempoMedio: 1.9, sla: 4 },
    { periodo: 'Mai', tempoMedio: 2.5, sla: 4 },
    { periodo: 'Jun', tempoMedio: 2.0, sla: 4 },
  ];

  const tickets: Ticket[] = [
    {
      id: "1",
      name: "Gustavo",
      type: "suporte",
      status: "pendente",
      priority: "alta",
      message: "minha internet esta travando",
      contact: "4799959230",
      created: "23/06/2023"
    },
    {
      id: "2", 
      name: "Gustavo",
      type: "suporte",
      status: "pendente",
      priority: "alta",
      message: "problemas de conexão",
      contact: "4799959230",
      created: "23/06/2023"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'em_atendimento':
        return <Phone className="h-4 w-4 text-primary" />;
      case 'resolvido':
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'suporte':
        return <Headphones className="h-4 w-4 text-success" />;
      case 'duvida':
        return <HelpCircle className="h-4 w-4 text-primary" />;
      case 'reclamacao':
        return <Shield className="h-4 w-4 text-destructive" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'suporte':
        return 'bg-success/10 border-success/20';
      case 'duvida':
        return 'bg-primary/10 border-primary/20';
      case 'reclamacao':
        return 'bg-destructive/10 border-destructive/20';
      default:
        return 'bg-muted/10 border-muted/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-destructive text-destructive-foreground';
      case 'media':
        return 'bg-warning text-warning-foreground';
      case 'baixa':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg gradient-header flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              Painel de Atendimento
              <div className="w-6 h-6 bg-3amg-purple rounded transform rotate-45 opacity-20"></div>
            </h1>
            <p className="text-muted-foreground">Gerencie atendimentos e suporte aos clientes</p>
          </div>
        </div>
        <Button className="gradient-header hover:opacity-90 text-white border-0">
          <Plus className="h-4 w-4 mr-2" />
          Novo Atendimento
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-foreground">{metrics.pendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Atendimento</p>
                <p className="text-2xl font-bold text-foreground">{metrics.emAtendimento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolvidos</p>
                <p className="text-2xl font-bold text-foreground">{metrics.resolvidos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted/50">
                <HelpCircle className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{metrics.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics com cores específicas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="bg-card border-border hover:shadow-lg transition-shadow gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10 icon-tech">
                <HelpCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dúvidas</p>
                <p className="text-2xl font-bold text-primary">{metrics.duvidas}</p>
                <p className="text-xs text-muted-foreground">Informações técnicas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-shadow gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-destructive/10 icon-tech">
                <Shield className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reclamações</p>
                <p className="text-2xl font-bold text-destructive">{metrics.reclamacoes}</p>
                <p className="text-xs text-muted-foreground">Problemas críticos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-shadow gradient-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-success/10 icon-tech">
                <Headphones className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suporte</p>
                <p className="text-2xl font-bold text-success">{metrics.suporte}</p>
                <p className="text-xs text-muted-foreground">Atendimento técnico</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico SLA */}
      <Card className="bg-card border-border card-dark">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-3amg-orange" />
            <CardTitle className="text-lg font-semibold text-foreground">Tempo Médio de Resolução (SLA)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={slaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="periodo" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="tempoMedio" 
                stroke="#F59E0B" 
                strokeWidth={3}
                name="Tempo Médio (h)"
              />
              <Line 
                type="monotone" 
                dataKey="sla" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Meta SLA (h)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Atendimentos</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
              <SelectItem value="resolvido">Resolvidos</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className={`flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-all ${getTypeColor(ticket.type)}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-background/80">
                  {getTypeIcon(ticket.type)}
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{ticket.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(ticket.status)}
                    <span className="text-xs text-muted-foreground capitalize">{ticket.status.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority.toUpperCase()}
              </div>

              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">{ticket.message}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {ticket.type.charAt(0).toUpperCase() + ticket.type.slice(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {ticket.contact}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ticket.created}
                  </span>
                </div>
              </div>

              <Button size="sm" variant="outline" className="text-xs">
                Atender
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePanel;