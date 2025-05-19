
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { formatCurrency } from "@/utils/formatters";
import type { Invoice } from "@/hooks/useInvoices";

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onProcessPayment: (method: string) => void;
  isLoading: boolean;
}

const PaymentModal = ({ 
  isOpen, 
  onOpenChange, 
  invoice, 
  onProcessPayment, 
  isLoading 
}: PaymentModalProps) => {
  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Escolha o método de pagamento</DialogTitle>
          <DialogDescription>
            Fatura: {invoice.description}<br />
            Valor: {formatCurrency(invoice.amount)}
          </DialogDescription>
        </DialogHeader>
        
        <PaymentMethodSelector onSelect={onProcessPayment} isLoading={isLoading} />
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
