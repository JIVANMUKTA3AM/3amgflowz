import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Settings } from 'lucide-react';
import { Tenant } from '@/hooks/useTenants';

interface TenantInfoPanelProps {
  tenant: Tenant;
}

export const TenantInfoPanel = ({ tenant }: TenantInfoPanelProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações do Provedor
          </CardTitle>
          <CardDescription>
            Dados cadastrais e configurações gerais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nome</label>
            <p className="text-lg font-semibold">{tenant.nome}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
            <p className="font-mono">{tenant.cnpj}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="mt-1">
              <Badge variant={tenant.ativo ? 'default' : 'destructive'}>
                {tenant.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">ID do Tenant</label>
            <p className="text-xs font-mono text-muted-foreground break-all">{tenant.id}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações
          </CardTitle>
          <CardDescription>
            Configurações avançadas do provedor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Contato</label>
            <pre className="mt-1 text-xs bg-muted p-3 rounded-md overflow-auto">
              {JSON.stringify(tenant.contato, null, 2)}
            </pre>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Configurações Gerais</label>
            <pre className="mt-1 text-xs bg-muted p-3 rounded-md overflow-auto max-h-32">
              {JSON.stringify(tenant.configuracoes, null, 2)}
            </pre>
          </div>

          <Button variant="outline" className="w-full">
            <Settings className="h-4 w-4 mr-2" />
            Editar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
