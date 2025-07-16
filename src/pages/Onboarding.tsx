
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Settings } from "lucide-react";

const Onboarding = () => {
  const { role } = useUserRole();

  return (
    <div className="min-h-screen bg-gray-50">
      {role === 'admin' && (
        <div className="bg-blue-50 border-b border-blue-200 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Modo Admin - Teste</span>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Ambiente de Teste
              </Badge>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        {role === 'admin' && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Onboarding - Modo de Teste</CardTitle>
              </div>
              <CardDescription className="text-blue-700">
                Você está acessando o onboarding como administrador para fins de teste. 
                Este é o mesmo fluxo que os clientes verão ao se cadastrar no sistema.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        
        <OnboardingWizard />
      </div>
    </div>
  );
};

export default Onboarding;
