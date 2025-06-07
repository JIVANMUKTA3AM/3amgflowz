
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, Edit, Trash2, Activity, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Integration, useIntegrations } from "@/hooks/useIntegrations";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface IntegrationsListProps {
  onEdit: (integration: Integration) => void;
}

const IntegrationsList = ({ onEdit }: IntegrationsListProps) => {
  const { 
    integrations, 
    testIntegration, 
    deleteIntegration, 
    isTesting, 
    isDeleting 
  } = useIntegrations();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      error: "destructive",
      pending: "outline"
    } as const;
    
    const labels = {
      active: "Ativa",
      inactive: "Inativa", 
      error: "Erro",
      pending: "Pendente"
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      webhook: "Webhook",
      api: "API REST",
      n8n: "n8n",
      zapier: "Zapier",
      custom: "Personalizada"
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (!integrations || integrations.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhuma integração configurada
        </h3>
        <p className="text-gray-600 mb-4">
          Comece criando sua primeira integração para conectar com serviços externos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map((integration) => (
        <Card key={integration.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                {getStatusIcon(integration.status)}
                {integration.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{getTypeLabel(integration.type)}</Badge>
                {getStatusBadge(integration.status)}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {integration.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {integration.description}
              </p>
            )}

            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>URL:</span>
                <span className="font-mono truncate max-w-32" title={integration.config.url}>
                  {integration.config.url}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Método:</span>
                <span className="font-mono">{integration.config.method}</span>
              </div>
              {integration.last_sync && (
                <div className="flex justify-between">
                  <span>Última sincronização:</span>
                  <span>
                    {formatDistanceToNow(new Date(integration.last_sync), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </span>
                </div>
              )}
            </div>

            {integration.error_message && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                <strong>Erro:</strong> {integration.error_message}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testIntegration(integration.id)}
                      disabled={isTesting}
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Testar integração</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(integration)}
                >
                  <Edit className="w-3 h-3" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover integração</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja remover a integração "{integration.name}"? 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteIntegration(integration.id)}
                        disabled={isDeleting}
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IntegrationsList;
