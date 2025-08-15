
import NewOnboardingWizard from "@/components/onboarding/NewOnboardingWizard";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Settings } from "lucide-react";

const Onboarding = () => {
  const { role } = useUserRole();

  return (
    <div className="min-h-screen bg-3amg-dark">
      {role === 'admin' && (
        <div className="bg-3amg-orange/10 border-b border-3amg-orange/20 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-3amg-orange" />
              <span className="text-3amg-orange font-medium">Modo Admin - Teste</span>
              <Badge variant="outline" className="text-3amg-orange border-3amg-orange/30 bg-3amg-orange/10">
                Ambiente de Teste
              </Badge>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {role === 'admin' && (
          <Card className="mb-6 border-3amg-orange/20 bg-gray-900/90">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-3amg-orange" />
                <CardTitle className="text-white">Onboarding - Modo de Teste</CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Você está acessando o onboarding como administrador para fins de teste. 
                Este é o mesmo fluxo que os provedores verão ao se cadastrar no sistema.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        
        <NewOnboardingWizard />
      </div>
    </div>
  );
};

export default Onboarding;
