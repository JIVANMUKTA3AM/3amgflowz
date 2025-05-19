
import { Button } from "@/components/ui/button";

interface BoletoPaymentProps {
  boletoUrl: string | null;
}

const BoletoPayment = ({ boletoUrl }: BoletoPaymentProps) => {
  const printBoleto = () => {
    if (!boletoUrl) return;
    window.open(boletoUrl, '_blank');
  };

  return (
    <div className="flex flex-col">
      <div id="payment-element" className="mb-4">
        {/* Stripe Boleto element will be mounted here */}
      </div>
      
      {boletoUrl && (
        <Button 
          className="w-full mt-4" 
          onClick={printBoleto}
        >
          Imprimir Boleto
        </Button>
      )}
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        Após o pagamento, pode levar até 3 dias úteis para a confirmação.
      </p>
    </div>
  );
};

export default BoletoPayment;
