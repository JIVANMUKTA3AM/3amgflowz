
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
      <DialogContent className="sm:max-w-[425px] bg-gray-900/95 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-3amg-orange">Escolha o método de pagamento</DialogTitle>
          <DialogDescription className="text-gray-300">
            Fatura: {invoice.description}<br />
            Valor: <span className="text-3amg-orange font-medium">{formatCurrency(invoice.amount)}</span>
          </DialogDescription>
        </DialogHeader>
        
        <PaymentMethodSelector onSelect={onProcessPayment} isLoading={isLoading} />
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
