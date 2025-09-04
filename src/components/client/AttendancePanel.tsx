import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Phone, Mail, HelpCircle, Plus, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";

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
    pendentes: 2,
    emAtendimento: 0,
    resolvidos: 0,
    total: 2,
    duvidas: 0,
    reclamacoes: 0,
    suporte: 2
  };

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
        return <Phone className="h-4 w-4" />;
      case 'duvida':
        return <HelpCircle className="h-4 w-4" />;
      case 'reclamacao':
        return <Mail className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
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
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Painel de Atendimento</h1>
            <p className="text-muted-foreground">Gerencie atendimentos e suporte aos clientes</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
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

      {/* Secondary Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dúvidas</p>
                <p className="text-xl font-bold text-foreground">{metrics.duvidas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Mail className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reclamações</p>
                <p className="text-xl font-bold text-foreground">{metrics.reclamacoes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Phone className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suporte</p>
                <p className="text-xl font-bold text-foreground">{metrics.suporte}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            <div key={ticket.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2">
                {getStatusIcon(ticket.status)}
                <span className="text-sm font-medium text-foreground">{ticket.name}</span>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </div>

              <div className="flex-1">
                <p className="text-sm text-foreground">{ticket.message}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>Tipo: {ticket.type}</span>
                  <span>Contato: {ticket.contact}</span>
                  <span>Criado: {ticket.created}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getTypeIcon(ticket.type)}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePanel;