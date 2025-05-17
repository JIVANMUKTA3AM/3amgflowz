
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

type WebhookConfigProps = {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
}

const WebhookConfig = ({ webhookUrl, setWebhookUrl }: WebhookConfigProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Configuração de Webhook</h3>
      <div className="mb-4">
        <label htmlFor="webhook" className="block text-sm font-medium text-gray-700 mb-1">
          URL do Webhook n8n
        </label>
        <input
          id="webhook"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://seu-n8n.com/webhook/abc123"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Cole a URL do seu webhook do n8n para conectar com este sistema
        </p>
      </div>
      <Button
        onClick={() => toast({ title: "Webhook Configurado", description: "Conexão com n8n estabelecida" })}
        className="w-full"
        disabled={!webhookUrl}
      >
        Salvar Configuração
      </Button>
    </div>
  );
};

export default WebhookConfig;
