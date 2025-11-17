
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { LoaderCircle, FileText } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { toast } from "@/components/ui/use-toast";
import type { Invoice } from "@/hooks/useInvoices";
import { useFiscalNotes } from "@/hooks/useFiscalNotes";

interface InvoicesTableProps {
  invoices: Invoice[];
  isLoading: boolean;
  onPaymentClick: (invoice: Invoice) => void;
}

const InvoicesTable = ({ invoices, isLoading, onPaymentClick }: InvoicesTableProps) => {
  const { issueNote, isIssuingNote, apiConfigs } = useFiscalNotes();
  
  const hasApiConfig = apiConfigs.length > 0;
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
            <TableHead className="text-center">NF-e</TableHead>
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
              <TableCell className="text-center">
                {invoice.status === 'paid' && hasApiConfig ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                    onClick={() => {
                      const defaultProvider = apiConfigs[0]?.provider || 'nfeio';
                      issueNote({ invoiceId: invoice.id, provider: defaultProvider });
                    }}
                    disabled={isIssuingNote}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Emitir NF-e
                  </Button>
                ) : invoice.status === 'paid' && !hasApiConfig ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    className="border-gray-600 text-gray-500"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Configure API
                  </Button>
                ) : (
                  <span className="text-sm text-gray-600">-</span>
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
