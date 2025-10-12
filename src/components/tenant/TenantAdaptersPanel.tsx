import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonitorDot } from 'lucide-react';

interface TenantAdaptersPanelProps {
  tenantId: string;
}

export const TenantAdaptersPanel = ({ tenantId }: TenantAdaptersPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MonitorDot className="h-5 w-5" />
          Adapters de Integração
        </CardTitle>
        <CardDescription>
          Configure integrações com sistemas de cobrança e monitoramento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          Em desenvolvimento...
        </p>
      </CardContent>
    </Card>
  );
};
