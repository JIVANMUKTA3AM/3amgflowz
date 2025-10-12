import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket } from 'lucide-react';

interface TenantTicketsPanelProps {
  tenantId: string;
}

export const TenantTicketsPanel = ({ tenantId }: TenantTicketsPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Tickets de Atendimento
        </CardTitle>
        <CardDescription>
          Visualize e gerencie tickets de suporte
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
