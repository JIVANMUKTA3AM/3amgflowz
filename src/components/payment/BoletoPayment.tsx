
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, FileText } from "lucide-react";

interface BoletoPaymentProps {
  boletoUrl: string | null;
}

const BoletoPayment = ({ boletoUrl }: BoletoPaymentProps) => {
  const downloadBoleto = () => {
    if (!boletoUrl) {
      toast({
        title: "Erro",
        description: "Boleto não disponível para download",
        variant: "destructive",
      });
      return;
    }
    
    // Abrir boleto em nova aba
    window.open(boletoUrl, '_blank');
    
    toast({
      title: "Boleto aberto!",
      description: "O boleto foi aberto em uma nova aba para download.",
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Elemento onde o Stripe monta o componente */}
      <div id="payment-element" className="w-full"></div>
      
      {/* Ícone do Boleto */}
      <div className="bg-white p-6 border rounded-lg shadow-sm flex flex-col items-center">
        <FileText className="h-16 w-16 text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Boleto Bancário</h3>
        <p className="text-sm text-gray-600 text-center mb-4">
          Clique no botão abaixo para baixar seu boleto
        </p>
      </div>
      
      {/* Botão para baixar boleto */}
      <Button 
        className="w-full flex items-center gap-2" 
        onClick={downloadBoleto}
        disabled={!boletoUrl}
      >
        <Download className="h-4 w-4" />
        {boletoUrl ? "Baixar Boleto" : "Gerando boleto..."}
      </Button>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 font-medium">Como pagar:</p>
        <ol className="text-xs text-gray-500 space-y-1 text-left">
          <li>1. Baixe o boleto clicando no botão acima</li>
          <li>2. Imprima o boleto ou use o código de barras</li>
          <li>3. Pague no banco, lotérica ou app bancário</li>
          <li>4. O pagamento será confirmado em até 3 dias úteis</li>
        </ol>
        <p className="text-xs text-gray-400 mt-3">
          Vencimento: 3 dias após a geração
        </p>
      </div>
    </div>
  );
};

export default BoletoPayment;
