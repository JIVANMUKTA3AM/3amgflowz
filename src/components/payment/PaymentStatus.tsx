
import { Check, LoaderCircle } from "lucide-react";

interface PaymentStatusProps {
  isLoading: boolean;
  isPaid: boolean;
}

const PaymentStatus = ({ isLoading, isPaid }: PaymentStatusProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 bg-gray-900/90 rounded-xl border border-gray-700">
        <LoaderCircle className="h-12 w-12 animate-spin text-3amg-orange mb-4" />
        <p className="text-gray-300">Carregando informações de pagamento...</p>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="flex flex-col items-center justify-center py-8 bg-gray-900/90 rounded-xl border border-gray-700">
        <div className="bg-green-500/20 p-4 rounded-full mb-4 border border-green-500/30">
          <Check className="h-16 w-16 text-green-400" />
        </div>
        <h3 className="text-xl font-medium mb-2 text-white">Pagamento aprovado!</h3>
        <p className="text-gray-300 text-center mb-4">
          O pagamento foi confirmado e sua fatura foi atualizada.
        </p>
      </div>
    );
  }

  return null;
};

export default PaymentStatus;
