
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface BoletoPaymentProps {
  boletoUrl: string | null;
}

const BoletoPayment = ({ boletoUrl }: BoletoPaymentProps) => {
  const openBoleto = () => {
    if (!boletoUrl) return;
    window.open(boletoUrl, '_blank');
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Elemento onde o Stripe monta o componente */}
      <div id="payment-element" className="w-full"></div>
      
      {/* Informações do Boleto */}
      <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-900">Boleto Bancário</h3>
            <p className="text-sm text-blue-700">Vencimento em 3 dias úteis</p>
          </div>
        </div>
        
        {boletoUrl ? (
          <Button 
            className="w-full flex items-center gap-2" 
            onClick={openBoleto}
          >
            <Download className="h-4 w-4" />
            Baixar/Imprimir Boleto
          </Button>
        ) : (
          <Button 
            className="w-full" 
            disabled
          >
            Gerando boleto...
          </Button>
        )}
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 font-medium">Como pagar:</p>
        <ol className="text-xs text-gray-500 space-y-1 text-left">
          <li>1. Baixe ou imprima o boleto</li>
          <li>2. Pague em qualquer banco, lotérica ou app bancário</li>
          <li>3. Use o código de barras para pagamento digital</li>
        </ol>
        <p className="text-xs text-gray-400 mt-3">
          Após o pagamento, pode levar até 3 dias úteis para confirmação
        </p>
      </div>
    </div>
  );
};

export default BoletoPayment;
