
import { AlertCircle } from "lucide-react";

const WebhookInfo = () => {
  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-medium text-blue-900 mb-2">
              Como funciona:
            </h4>
            <ul className="text-blue-800 space-y-1">
              <li>• Quando um agente atender um cliente, a resposta será enviada para sua URL</li>
              <li>• Os dados incluem tipo do agente, mensagem do cliente e resolução</li>
              <li>• Você pode integrar com seu CRM, Slack, email ou qualquer sistema</li>
              <li>• Use o botão "Testar" para verificar se está recebendo corretamente</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">
          Exemplo de dados que você receberá:
        </h4>
        <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
{`{
  "agent_type": "atendimento",
  "customer": "João Silva",
  "message": "Minha internet está lenta",
  "resolution": "Problema resolvido. Router reiniciado remotamente.",
  "timestamp": "2024-01-15T10:30:00Z",
  "ticket_id": "TKT-12345"
}`}
        </pre>
      </div>
    </>
  );
};

export default WebhookInfo;
