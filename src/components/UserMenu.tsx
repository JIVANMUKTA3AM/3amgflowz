import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSimpleUserProfile } from "@/hooks/useSimpleUserProfile";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProfileSettings from "@/components/profile/ProfileSettings";
import OrganizationManagement from "@/components/organizations/OrganizationManagement";
import { 
  User, 
  Settings, 
  LogOut, 
  Building, 
  Crown,
  CreditCard,
  HelpCircle
} from "lucide-react";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { profile, isLoading } = useSimpleUserProfile();
  const navigate = useNavigate();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showOrgDialog, setShowOrgDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      console.log('Iniciando logout...');
      
      // Primeiro limpar o estado local
      localStorage.clear();
      sessionStorage.clear();
      
      // Executar logout no Supabase
      await signOut();
      
      console.log('Logout realizado com sucesso');
      
      // Forçar redirecionamento após um pequeno delay
      setTimeout(() => {
        window.location.href = "/auth";
      }, 100);
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      
      // Mesmo com erro, limpar storage e redirecionar
      localStorage.clear();
      sessionStorage.clear();
      
      setTimeout(() => {
        window.location.href = "/auth";
      }, 100);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'tecnico': return 'bg-blue-100 text-blue-800';
      case 'comercial': return 'bg-green-100 text-green-800';
      case 'geral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'free': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Sempre mostrar o menu, mesmo se não tiver perfil carregado
  if (!user) return null;

  // Dados de fallback se o perfil não carregar
  const displayProfile = profile || {
    first_name: user.email?.split('@')[0] || 'Usuário',
    last_name: '',
    avatar_url: undefined,
    user_role_type: 'geral',
    plan: 'free',
    role: 'user'
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-blue-200">
              <AvatarImage src={displayProfile.avatar_url} alt={displayProfile.first_name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {displayProfile.first_name?.[0]}{displayProfile.last_name?.[0] || user.email?.[1]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-blue-200">
                  <AvatarImage src={displayProfile.avatar_url} alt={displayProfile.first_name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {displayProfile.first_name?.[0]}{displayProfile.last_name?.[0] || user.email?.[1]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">
                    {displayProfile.first_name} {displayProfile.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {user.email}
                  </p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">
                    Usuário atual: {user.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={`${displayProfile.user_role_type === 'admin' ? 'bg-red-100 text-red-800' : displayProfile.user_role_type === 'tecnico' ? 'bg-blue-100 text-blue-800' : displayProfile.user_role_type === 'comercial' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`} variant="secondary">
                  {(displayProfile.user_role_type || 'geral').charAt(0).toUpperCase() + (displayProfile.user_role_type || 'geral').slice(1)}
                </Badge>
                <Badge className={`${displayProfile.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' : displayProfile.plan === 'premium' ? 'bg-yellow-100 text-yellow-800' : displayProfile.plan === 'basic' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`} variant="secondary">
                  {displayProfile.plan.charAt(0).toUpperCase() + displayProfile.plan.slice(1)}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Configurações do Perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowOrgDialog(true)}>
            <Building className="mr-2 h-4 w-4" />
            <span>Organizações</span>
          </DropdownMenuItem>
          
          {(displayProfile.role === 'admin' || displayProfile.user_role_type === 'admin') && (
            <DropdownMenuItem onClick={() => navigate("/subscription-management")}>
              <Crown className="mr-2 h-4 w-4" />
              <span>Painel Admin</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => navigate("/subscription")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Assinatura e Cobrança</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Ajuda e Suporte</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut} 
            className="text-red-600 focus:text-red-600 focus:bg-red-50 font-medium cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair (Trocar Usuário)</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog para Configurações do Perfil */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurações do Perfil</DialogTitle>
          </DialogHeader>
          <ProfileSettings />
        </DialogContent>
      </Dialog>

      {/* Dialog para Organizações */}
      <Dialog open={showOrgDialog} onOpenChange={setShowOrgDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gerenciar Organizações</DialogTitle>
          </DialogHeader>
          <OrganizationManagement />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
