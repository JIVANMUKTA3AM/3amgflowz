
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";
import { Zap, Loader2 } from "lucide-react";

interface ClientHeaderProps {
  handleWorkflowTrigger?: () => void;
  isLoading?: boolean;
}

const ClientHeader = ({ handleWorkflowTrigger, isLoading }: ClientHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-3amg rounded-lg"></div>
            <span className="font-bold text-xl text-gray-900">3AMG</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-gray-600">
                Logado como: <span className="font-medium">{user.email}</span>
              </div>
            )}
            
            {handleWorkflowTrigger && (
              <Button
                onClick={handleWorkflowTrigger}
                disabled={isLoading}
                className="bg-gradient-3amg hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Executar Workflow
                  </>
                )}
              </Button>
            )}
            
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button>Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
