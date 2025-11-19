import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFiscalNotes } from "@/hooks/useFiscalNotes";
import { FileText, Save, TestTube2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function FiscalApiConfig() {
  const { apiConfigs, saveConfig, isSavingConfig, testConnection, isTestingConnection } = useFiscalNotes();
  
  const [provider, setProvider] = useState<'nfeio' | 'enotas' | 'other'>('nfeio');
  const [apiToken, setApiToken] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  
  // Campos fiscais obrigatórios
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState('');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [cnae, setCnae] = useState('');
  const [codigoServico, setCodigoServico] = useState('');
  const [tipoNota, setTipoNota] = useState<'nfe' | 'nfse'>('nfse');
  const [regimeTributario, setRegimeTributario] = useState<'simples_nacional' | 'mei' | 'normal'>('simples_nacional');
  const [serieNota, setSerieNota] = useState('1');
  const [naturezaOperacao, setNaturezaOperacao] = useState('Prestação de serviços');
  
  // Endereço
  const [enderecoRua, setEnderecoRua] = useState('');
  const [enderecoNumero, setEnderecoNumero] = useState('');
  const [enderecoComplemento, setEnderecoComplemento] = useState('');
  const [enderecoBairro, setEnderecoBairro] = useState('');
  const [enderecoCidade, setEnderecoCidade] = useState('');
  const [enderecoEstado, setEnderecoEstado] = useState('');
  const [enderecoCep, setEnderecoCep] = useState('');

  const existingConfig = apiConfigs?.find(c => c.provider === provider);

  // Carregar configuração existente
  useEffect(() => {
    if (existingConfig) {
      setApiToken(existingConfig.api_token || '');
      setApiUrl(existingConfig.api_url || '');
      setCnpj(existingConfig.cnpj || '');
      setRazaoSocial(existingConfig.razao_social || '');
      setNomeFantasia(existingConfig.nome_fantasia || '');
      setInscricaoMunicipal(existingConfig.inscricao_municipal || '');
      setInscricaoEstadual(existingConfig.inscricao_estadual || '');
      setCnae(existingConfig.cnae || '');
      setCodigoServico(existingConfig.codigo_servico || '');
      setTipoNota((existingConfig.tipo_nota as 'nfe' | 'nfse') || 'nfse');
      setRegimeTributario((existingConfig.regime_tributario as any) || 'simples_nacional');
      setSerieNota(existingConfig.serie_nota || '1');
      setNaturezaOperacao(existingConfig.natureza_operacao || 'Prestação de serviços');
      setEnderecoRua(existingConfig.endereco_rua || '');
      setEnderecoNumero(existingConfig.endereco_numero || '');
      setEnderecoComplemento(existingConfig.endereco_complemento || '');
      setEnderecoBairro(existingConfig.endereco_bairro || '');
      setEnderecoCidade(existingConfig.endereco_cidade || '');
      setEnderecoEstado(existingConfig.endereco_estado || '');
      setEnderecoCep(existingConfig.endereco_cep || '');
    }
  }, [existingConfig]);

  const validateCNPJ = (cnpj: string): boolean => {
    const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
    return cleanCNPJ.length === 14;
  };

  const validateCNAE = (cnae: string): boolean => {
    const cleanCNAE = cnae.replace(/[^\d]/g, '');
    return cleanCNAE.length === 7;
  };

  const handleTestConnection = async () => {
    if (!apiToken.trim()) {
      toast({
        title: "Token obrigatório",
        description: "Por favor, informe o token da API",
        variant: "destructive",
      });
      return;
    }

    if (!validateCNPJ(cnpj)) {
      toast({
        title: "CNPJ inválido",
        description: "O CNPJ deve conter 14 dígitos",
        variant: "destructive",
      });
      return;
    }

    await testConnection({ provider, apiToken, apiUrl: apiUrl || null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!apiToken.trim()) {
      toast({
        title: "Token obrigatório",
        description: "Por favor, informe o token da API",
        variant: "destructive",
      });
      return;
    }

    if (!validateCNPJ(cnpj)) {
      toast({
        title: "CNPJ inválido",
        description: "O CNPJ deve conter 14 dígitos",
        variant: "destructive",
      });
      return;
    }

    if (!razaoSocial.trim()) {
      toast({
        title: "Razão Social obrigatória",
        description: "Por favor, informe a Razão Social",
        variant: "destructive",
      });
      return;
    }

    if (tipoNota === 'nfse' && !inscricaoMunicipal.trim()) {
      toast({
        title: "Inscrição Municipal obrigatória",
        description: "Para NFS-e, a Inscrição Municipal é obrigatória",
        variant: "destructive",
      });
      return;
    }

    if (!validateCNAE(cnae)) {
      toast({
        title: "CNAE inválido",
        description: "O CNAE deve estar no formato correto (7 dígitos)",
        variant: "destructive",
      });
      return;
    }

    saveConfig({
      provider,
      api_token: apiToken,
      api_url: apiUrl || null,
      is_active: true,
      cnpj,
      razao_social: razaoSocial,
      nome_fantasia: nomeFantasia,
      inscricao_municipal: inscricaoMunicipal,
      inscricao_estadual: inscricaoEstadual,
      cnae,
      codigo_servico: codigoServico,
      tipo_nota: tipoNota,
      regime_tributario: regimeTributario,
      serie_nota: serieNota,
      natureza_operacao: naturezaOperacao,
      endereco_rua: enderecoRua,
      endereco_numero: enderecoNumero,
      endereco_complemento: enderecoComplemento,
      endereco_bairro: enderecoBairro,
      endereco_cidade: enderecoCidade,
      endereco_estado: enderecoEstado,
      endereco_cep: enderecoCep,
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Provedor e API */}
          <div className="space-y-4 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white">Dados da API</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider" className="text-gray-300">Provedor <span className="text-red-400">*</span></Label>
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
              </div>
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
          </div>

          {/* Dados da Empresa */}
          <div className="space-y-4 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white">Dados da Empresa</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-gray-300">CNPJ <span className="text-red-400">*</span></Label>
                <Input
                  id="cnpj"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razaoSocial" className="text-gray-300">Razão Social <span className="text-red-400">*</span></Label>
                <Input
                  id="razaoSocial"
                  placeholder="Nome empresarial completo"
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomeFantasia" className="text-gray-300">Nome Fantasia</Label>
                <Input
                  id="nomeFantasia"
                  placeholder="Nome comercial"
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricaoMunicipal" className="text-gray-300">
                  Inscrição Municipal {tipoNota === 'nfse' && <span className="text-red-400">*</span>}
                </Label>
                <Input
                  id="inscricaoMunicipal"
                  placeholder="Inscrição Municipal"
                  value={inscricaoMunicipal}
                  onChange={(e) => setInscricaoMunicipal(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  required={tipoNota === 'nfse'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inscricaoEstadual" className="text-gray-300">Inscrição Estadual</Label>
                <Input
                  id="inscricaoEstadual"
                  placeholder="Inscrição Estadual"
                  value={inscricaoEstadual}
                  onChange={(e) => setInscricaoEstadual(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnae" className="text-gray-300">CNAE <span className="text-red-400">*</span></Label>
                <Input
                  id="cnae"
                  placeholder="0000-0/00"
                  value={cnae}
                  onChange={(e) => setCnae(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Configurações Fiscais */}
          <div className="space-y-4 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white">Configurações Fiscais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipoNota" className="text-gray-300">Tipo de Nota <span className="text-red-400">*</span></Label>
                <Select value={tipoNota} onValueChange={(v: any) => setTipoNota(v)}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="nfse" className="text-white">NFS-e (Serviços)</SelectItem>
                    <SelectItem value="nfe" className="text-white">NF-e (Produtos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="regimeTributario" className="text-gray-300">Regime Tributário <span className="text-red-400">*</span></Label>
                <Select value={regimeTributario} onValueChange={(v: any) => setRegimeTributario(v)}>
                  <SelectTrigger className="bg-gray-900/50 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="simples_nacional" className="text-white">Simples Nacional</SelectItem>
                    <SelectItem value="mei" className="text-white">MEI</SelectItem>
                    <SelectItem value="normal" className="text-white">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigoServico" className="text-gray-300">Código de Serviço</Label>
                <Input
                  id="codigoServico"
                  placeholder="Ex: 01.07"
                  value={codigoServico}
                  onChange={(e) => setCodigoServico(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serieNota" className="text-gray-300">Série da Nota</Label>
                <Input
                  id="serieNota"
                  placeholder="1"
                  value={serieNota}
                  onChange={(e) => setSerieNota(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="naturezaOperacao" className="text-gray-300">Natureza da Operação</Label>
                <Input
                  id="naturezaOperacao"
                  placeholder="Prestação de serviços"
                  value={naturezaOperacao}
                  onChange={(e) => setNaturezaOperacao(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white">Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="enderecoRua" className="text-gray-300">Rua</Label>
                <Input
                  id="enderecoRua"
                  placeholder="Nome da rua"
                  value={enderecoRua}
                  onChange={(e) => setEnderecoRua(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enderecoNumero" className="text-gray-300">Número</Label>
                <Input
                  id="enderecoNumero"
                  placeholder="123"
                  value={enderecoNumero}
                  onChange={(e) => setEnderecoNumero(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enderecoComplemento" className="text-gray-300">Complemento</Label>
                <Input
                  id="enderecoComplemento"
                  placeholder="Sala, Andar..."
                  value={enderecoComplemento}
                  onChange={(e) => setEnderecoComplemento(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enderecoBairro" className="text-gray-300">Bairro</Label>
                <Input
                  id="enderecoBairro"
                  placeholder="Nome do bairro"
                  value={enderecoBairro}
                  onChange={(e) => setEnderecoBairro(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enderecoCidade" className="text-gray-300">Cidade</Label>
                <Input
                  id="enderecoCidade"
                  placeholder="Nome da cidade"
                  value={enderecoCidade}
                  onChange={(e) => setEnderecoCidade(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enderecoEstado" className="text-gray-300">Estado</Label>
                <Input
                  id="enderecoEstado"
                  placeholder="SP"
                  maxLength={2}
                  value={enderecoEstado}
                  onChange={(e) => setEnderecoEstado(e.target.value.toUpperCase())}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enderecoCep" className="text-gray-300">CEP</Label>
                <Input
                  id="enderecoCep"
                  placeholder="00000-000"
                  value={enderecoCep}
                  onChange={(e) => setEnderecoCep(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTestingConnection || !apiToken.trim() || !cnpj.trim()}
              className="flex-1 bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800"
            >
              <TestTube2 className="h-4 w-4 mr-2" />
              {isTestingConnection ? 'Testando...' : 'Testar Conexão'}
            </Button>

            <Button
              type="submit"
              disabled={isSavingConfig || !apiToken.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSavingConfig ? 'Salvando...' : 'Salvar Configuração'}
            </Button>
          </div>

          {/* Aviso */}
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <p className="text-sm text-orange-300">
              ⚠️ A emissão de notas fiscais depende dos dados fiscais corretos do provedor. 
              Certifique-se de preencher todos os campos obrigatórios.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
