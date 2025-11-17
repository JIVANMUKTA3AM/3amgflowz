import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FiscalApiConfig from "@/components/payment/FiscalApiConfig";
import FiscalNotesList from "@/components/payment/FiscalNotesList";
import { Settings, FileText } from "lucide-react";

export default function NotasFiscais() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Notas Fiscais Eletrônicas
          </h1>
          <p className="text-gray-400">
            Gerencie a emissão de NF-e/NFS-e integrado com NFE.io ou eNotas
          </p>
        </div>

        <Tabs defaultValue="notas" className="space-y-6">
          <TabsList className="bg-gray-900/50 border border-gray-700/50">
            <TabsTrigger value="notas" className="data-[state=active]:bg-purple-600">
              <FileText className="h-4 w-4 mr-2" />
              Notas Emitidas
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notas" className="space-y-6">
            <FiscalNotesList />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <FiscalApiConfig />
            
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <h3 className="text-blue-400 font-semibold mb-2">📌 Como configurar:</h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>Escolha seu provedor fiscal (NFE.io, eNotas ou outro)</li>
                <li>Cole o token de API fornecido pelo provedor</li>
                <li>Configure a URL da API (opcional, usa padrão se vazio)</li>
                <li>Após salvar, você poderá emitir notas nas faturas pagas</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
