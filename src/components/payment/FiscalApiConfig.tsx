import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFiscalNotes } from "@/hooks/useFiscalNotes";
import { FileText, Save } from "lucide-react";

export default function FiscalApiConfig() {
  const { apiConfigs, saveConfig, isSavingConfig } = useFiscalNotes();
  const [provider, setProvider] = useState<'nfeio' | 'enotas' | 'other'>('nfeio');
  const [apiToken, setApiToken] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  const existingConfig = apiConfigs.find(c => c.provider === provider);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiToken.trim()) {
      return;
    }

    saveConfig({
      provider,
      api_token: apiToken,
      api_url: apiUrl || null,
      is_active: true,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-gray-900/90 via-purple-950/40 to-gray-900/90 border-purple-500/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <FileText className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-white">Configuração API Fiscal</CardTitle>
            <CardDescription className="text-gray-400">
              Configure sua integração com serviços de emissão de notas fiscais
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-gray-300">Provedor</Label>
            <Select value={provider} onValueChange={(v: any) => setProvider(v)}>
              <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                <SelectValue placeholder="Selecione o provedor" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="nfeio" className="text-white">NFE.io</SelectItem>
                <SelectItem value="enotas" className="text-white">eNotas</SelectItem>
                <SelectItem value="other" className="text-white">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiToken" className="text-gray-300">
              Token da API <span className="text-red-400">*</span>
            </Label>
            <Input
              id="apiToken"
              type="password"
              placeholder="Cole seu token de API aqui"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
              required
            />
            {existingConfig && (
              <p className="text-xs text-green-400">✓ Token configurado para {provider}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiUrl" className="text-gray-300">URL da API (opcional)</Label>
            <Input
              id="apiUrl"
              type="url"
              placeholder="https://api.exemplo.com/v1"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-500">
              Deixe em branco para usar a URL padrão do provedor
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSavingConfig || !apiToken.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSavingConfig ? 'Salvando...' : 'Salvar Configuração'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
