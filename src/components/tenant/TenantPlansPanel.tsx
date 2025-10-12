import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface TenantPlansPanelProps {
  tenantId: string;
}

export const TenantPlansPanel = ({ tenantId }: TenantPlansPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Planos Comerciais
        </CardTitle>
        <CardDescription>
          Configure os planos disponíveis para seus clientes
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
