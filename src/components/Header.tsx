
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { LogOut, Settings, User, Zap, TestTube } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  handleWorkflowTrigger?: () => void;
  isLoading?: boolean;
}

const Header = ({ handleWorkflowTrigger, isLoading }: HeaderProps) => {
  const { signOut } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleTestAgents = () => {
    console.log('Navegando para teste de agentes...');
    navigate('/test-chat');
  };

  const getInitials = (email: string) => {
    const parts = email.split('@')[0].split('.');
    return parts.map(part => part[0]?.toUpperCase()).join('').slice(0, 2) || 'U';
  };

  const getDisplayName = (email: string) => {
    const username = email.split('@')[0];
    return username.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  if (profileLoading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard Admin
              </h1>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Dashboard Admin
            </h1>
            
            {handleWorkflowTrigger && (
              <Button
                onClick={handleWorkflowTrigger}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                {isLoading ? 'Executando...' : 'Trigger Workflow'}
              </Button>
            )}

            <Button
              onClick={handleTestAgents}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <TestTube className="h-4 w-4" />
              Testar Agentes
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={profile?.avatar_url || ''} 
                      alt="Avatar" 
                    />
                    <AvatarFallback>
                      {profile?.email ? getInitials(profile.email) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.email ? getDisplayName(profile.email) : 'Usuário'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.email || 'email@exemplo.com'}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/agentes')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Agentes</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
