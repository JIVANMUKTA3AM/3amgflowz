
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
    <header className="gradient-header shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded transform rotate-45 opacity-20"></div>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 rounded transform rotate-45" style={{background: '#8B5CF6'}}></div>
            </div>
            <span className="font-bold text-xl text-white">3AMG ISP</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-sm text-white/80">
                Logado como: <span className="font-medium text-white">{user.email}</span>
              </div>
            )}
            
            {handleWorkflowTrigger && (
              <Button
                onClick={handleWorkflowTrigger}
                disabled={isLoading}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
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
                <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30">Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
