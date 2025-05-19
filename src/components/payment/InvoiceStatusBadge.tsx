
import { Badge } from "@/components/ui/badge";

interface InvoiceStatusBadgeProps {
  status: string;
}

const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-500">Pago</Badge>;
    case "pending":
      return <Badge variant="outline" className="border-orange-500 text-orange-500">Pendente</Badge>;
    case "canceled":
      return <Badge variant="destructive">Cancelado</Badge>;
    case "expired":
      return <Badge variant="secondary">Vencido</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default InvoiceStatusBadge;
