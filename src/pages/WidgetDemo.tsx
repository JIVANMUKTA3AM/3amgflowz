import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhiteLabelChat } from '@/components/widgets/WhiteLabelChat';
import { Code, Eye, Settings, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const WidgetDemo = () => {
  const [tenantId, setTenantId] = useState('');
  const [brandName, setBrandName] = useState('Meu Provedor');
  const [brandColor, setBrandColor] = useState('#8B5CF6');
  const [showWidget, setShowWidget] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedCode = `<!-- Widget 3AMG Flowz -->
<script>
  window.flowzConfig = {
    tenantId: '${tenantId || 'SEU_TENANT_ID'}',
    brandName: '${brandName}',
    brandColor: '${brandColor}',
    position: 'bottom-right'
  };
</script>
<script src="https://cdn.3amgflowz.com/widget.js"></script>`;

  const reactCode = `import { WhiteLabelChat } from '@/components/widgets/WhiteLabelChat';

function App() {
  return (
    <WhiteLabelChat 
      tenantId="${tenantId || 'SEU_TENANT_ID'}"
      brandName="${brandName}"
      brandColor="${brandColor}"
      position="bottom-right"
    />
  );
}`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Código copiado!",
      description: "Cole no seu site para ativar o widget",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Widget White-Label</h1>
          <p className="text-muted-foreground">
            Configure e incorpore o chat de IA no site do seu provedor
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Configuração */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuração
                </CardTitle>
                <CardDescription>
                  Personalize o widget para seu provedor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tenant-id">Tenant ID</Label>
                  <Input
                    id="tenant-id"
                    placeholder="Digite o ID do seu provedor"
                    value={tenantId}
                    onChange={(e) => setTenantId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Encontre em Painel Tenant → Informações
                  </p>
                </div>

                <div>
                  <Label htmlFor="brand-name">Nome da Marca</Label>
                  <Input
                    id="brand-name"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="brand-color">Cor Principal</Label>
                  <div className="flex gap-2">
                    <Input
                      id="brand-color"
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-20 h-10"
                    />
                    <Input
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => setShowWidget(!showWidget)}
                  className="w-full"
                  variant={showWidget ? 'destructive' : 'default'}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showWidget ? 'Esconder Preview' : 'Mostrar Preview'}
                </Button>
              </CardContent>
            </Card>

            {/* Código de Incorporação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Código de Incorporação
                </CardTitle>
                <CardDescription>
                  Cole no HTML do seu site
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="html">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="html">HTML</TabsTrigger>
                    <TabsTrigger value="react">React</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="html" className="space-y-2">
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">
                      <code>{embedCode}</code>
                    </pre>
                    <Button 
                      onClick={() => handleCopy(embedCode)}
                      variant="outline" 
                      className="w-full"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? 'Copiado!' : 'Copiar Código'}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="react" className="space-y-2">
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">
                      <code>{reactCode}</code>
                    </pre>
                    <Button 
                      onClick={() => handleCopy(reactCode)}
                      variant="outline" 
                      className="w-full"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? 'Copiado!' : 'Copiar Código'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
                <CardDescription>
                  Visualização do widget configurado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border-2 border-dashed rounded-lg p-8 min-h-[500px] bg-muted/30">
                  {!tenantId ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground text-center">
                        Configure o Tenant ID para ver o preview
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p className="mb-4">
                        O widget aparecerá no canto inferior direito
                      </p>
                      <p className="text-sm">
                        Clique em "Mostrar Preview" para testar
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

      {/* Widget Demo */}
      {showWidget && tenantId && (
        <WhiteLabelChat
          tenantId={tenantId}
          brandName={brandName}
          brandColor={brandColor}
          position="bottom-right"
        />
      )}
    </div>
  );
};

export default WidgetDemo;
