
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Copy, QrCode } from "lucide-react";

interface PixPaymentProps {
  qrCodeUrl: string | null;
  copyText: string | null;
}

const PixPayment = ({ qrCodeUrl, copyText }: PixPaymentProps) => {
  const copyToClipboard = () => {
    if (!copyText) {
      toast({
        title: "Erro",
        description: "Código PIX não disponível",
        variant: "destructive",
      });
      return;
    }
    
    navigator.clipboard.writeText(copyText).then(() => {
      toast({
        title: "Código PIX copiado!",
        description: "Cole no seu aplicativo de banco para pagar.",
      });
    }).catch(err => {
      console.error('Erro ao copiar texto:', err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código PIX",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Elemento onde o Stripe monta o componente */}
      <div id="payment-element" className="w-full"></div>
      
      {/* QR Code */}
      {qrCodeUrl ? (
        <div className="bg-gray-900/90 border border-gray-700 p-4 rounded-lg shadow-sm backdrop-blur-sm">
          <img 
            src={qrCodeUrl} 
            alt="QR Code PIX" 
            className="max-w-xs mx-auto"
          />
        </div>
      ) : (
        <div className="bg-gray-900/90 border border-gray-700 p-8 rounded-lg flex flex-col items-center backdrop-blur-sm">
          <QrCode className="h-16 w-16 text-3amg-orange mb-2" />
          <p className="text-gray-300 text-sm">Carregando QR Code...</p>
        </div>
      )}
      
      {/* Botão para copiar código */}
      <Button 
        className="w-full flex items-center gap-2 bg-gradient-3amg hover:opacity-90 text-white" 
        onClick={copyToClipboard}
        disabled={!copyText}
      >
        <Copy className="h-4 w-4" />
        {copyText ? "Copiar Código PIX" : "Carregando código..."}
      </Button>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-3amg-orange font-medium">Como pagar:</p>
        <ol className="text-xs text-gray-300 space-y-1 text-left">
          <li>1. Abra o app do seu banco</li>
          <li>2. Escolha a opção PIX</li>
          <li>3. Escaneie o QR code ou cole o código copiado</li>
          <li>4. Confirme o pagamento</li>
        </ol>
        <p className="text-xs text-gray-400 mt-3">
          O pagamento será confirmado automaticamente em alguns segundos
        </p>
      </div>
    </div>
  );
};

export default PixPayment;
