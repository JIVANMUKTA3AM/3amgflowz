
import { Badge } from "@/components/ui/badge";

interface InvoiceStatusBadgeProps {
  status: string;
}

const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Pago</Badge>;
    case "pending":
      return <Badge variant="outline" className="border-3amg-orange/50 text-3amg-orange bg-3amg-orange/10">Pendente</Badge>;
    case "canceled":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelado</Badge>;
    case "expired":
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Vencido</Badge>;
    default:
      return <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-800/50">{status}</Badge>;
  }
};

export default InvoiceStatusBadge;
