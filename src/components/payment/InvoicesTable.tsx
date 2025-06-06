
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { LoaderCircle } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";
import type { Invoice } from "@/hooks/useInvoices";

interface InvoicesTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onPaymentClick: (invoice: Invoice) => void;
}

const InvoicesTable = ({ invoices, isLoading, onPaymentClick }: InvoicesTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando faturas...</span>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Você não possui faturas no momento.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.description}</TableCell>
              <TableCell>{formatDate(invoice.due_date)}</TableCell>
              <TableCell>{formatCurrency(invoice.amount)}</TableCell>
              <TableCell><InvoiceStatusBadge status={invoice.status} /></TableCell>
              <TableCell className="text-right">
                {invoice.status === 'pending' ? (
                  <Button 
                    onClick={() => onPaymentClick(invoice)}
                    size="sm"
                  >
                    Pagar Agora
                  </Button>
                ) : invoice.status === 'paid' ? (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast({
                      title: "Fatura já paga",
                      description: `Pago via ${invoice.payment_method} em ${formatDate(invoice.payment_date || '')}`,
                    })}
                  >
                    Comprovante
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled
                  >
                    {invoice.status === 'canceled' ? 'Cancelada' : 'Vencida'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesTable;
