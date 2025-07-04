
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
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
  const { profile } = useUserProfile();
  const navigate = useNavigate();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showOrgDialog, setShowOrgDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      console.log('Iniciando logout...');
      await signOut();
      console.log('Logout realizado com sucesso');
      // Forçar redirecionamento para a página de login
      window.location.href = "/auth";
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, tentar redirecionar
      window.location.href = "/auth";
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

  if (!user || !profile) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.avatar_url} alt={profile.first_name} />
              <AvatarFallback>
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.avatar_url} alt={profile.first_name} />
                  <AvatarFallback>
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-none">
                    {profile.first_name} {profile.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {user.email}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Usuário atual: {user.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={getRoleColor(profile.user_role_type || 'geral')} variant="secondary">
                  {(profile.user_role_type || 'geral').charAt(0).toUpperCase() + (profile.user_role_type || 'geral').slice(1)}
                </Badge>
                <Badge className={getPlanColor(profile.plan)} variant="secondary">
                  {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}
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
          
          {(profile.role === 'admin' || profile.user_role_type === 'admin') && (
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
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
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
