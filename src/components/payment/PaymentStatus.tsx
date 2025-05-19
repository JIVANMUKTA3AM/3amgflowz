
import { Check, LoaderCircle } from "lucide-react";

interface PaymentStatusProps {
  isLoading: boolean;
  isPaid: boolean;
}

const PaymentStatus = ({ isLoading, isPaid }: PaymentStatusProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Carregando informações de pagamento...</p>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <Check className="h-16 w-16 text-green-600" />
        </div>
        <h3 className="text-xl font-medium mb-2">Pagamento aprovado!</h3>
        <p className="text-gray-600 text-center mb-4">
          O pagamento foi confirmado e sua fatura foi atualizada.
        </p>
      </div>
    );
  }

  return null;
};

export default PaymentStatus;
