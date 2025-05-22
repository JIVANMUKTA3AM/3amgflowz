
import { Check, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type IntegrationStatusChipProps = {
  isConnected: boolean | undefined;
};

const IntegrationStatusChip = ({ isConnected }: IntegrationStatusChipProps) => {
  if (isConnected === undefined) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-700 flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        <span>Não verificado</span>
      </Badge>
    );
  }

  return isConnected ? (
    <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center gap-1">
      <Check className="h-3 w-3" />
      <span>Conectado</span>
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center gap-1">
      <X className="h-3 w-3" />
      <span>Desconectado</span>
    </Badge>
  );
};

export default IntegrationStatusChip;
