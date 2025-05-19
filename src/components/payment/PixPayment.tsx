
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface PixPaymentProps {
  qrCodeUrl: string | null;
  copyText: string | null;
}

const PixPayment = ({ qrCodeUrl, copyText }: PixPaymentProps) => {
  const copyToClipboard = () => {
    if (!copyText) return;
    
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

  if (!qrCodeUrl) {
    return <div id="payment-element" className="mb-4"></div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white p-4 border rounded-lg mb-4">
        <img 
          src={qrCodeUrl} 
          alt="QR Code PIX" 
          className="max-w-xs"
        />
      </div>
      <Button 
        className="w-full mb-4" 
        onClick={copyToClipboard}
      >
        Copiar Código PIX
      </Button>
      <p className="text-sm text-gray-500 text-center">
        Abra o app do seu banco, escolha PIX, e escaneie o QR code 
        ou cole o código copiado
      </p>
    </div>
  );
};

export default PixPayment;
