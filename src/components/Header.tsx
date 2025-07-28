
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  User, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Bot,
  Zap,
  Bell,
  Search,
  Command
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useUserRole } from '@/hooks/useUserRole';

interface HeaderProps {
  handleWorkflowTrigger?: (workflowType: string, data?: any) => Promise<any>;
  isLoading?: boolean;
}

const Header = ({ handleWorkflowTrigger, isLoading }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { profile, role, isAdmin } = useUserRole();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const triggerWorkflow = async () => {
    if (handleWorkflowTrigger) {
      await handleWorkflowTrigger('header-action');
    }
  };

  const getRoleColor = (userRole: string) => {
    switch (userRole) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'tecnico': return 'bg-blue-100 text-blue-800';
      case 'comercial': return 'bg-green-100 text-green-800';
      case 'geral': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/', icon: '🏠' },
    { label: 'Agentes', path: '/agentes', icon: '🤖' },
    { label: 'Integrações', path: '/integracoes', icon: '🔗' },
    { label: 'CRM', path: '/crm', icon: '👥' },
    { label: 'Fluxos', path: '/fluxos', icon: '🔄' },
    ...(isAdmin ? [
      { label: 'Admin Webhooks', path: '/admin-webhooks', icon: '⚙️' },
      { label: 'Gerenciar Integrações', path: '/integrations-management', icon: '🔧' },
    ] : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">AgentFlow</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className="flex items-center gap-2"
            >
              <span>{item.icon}</span>
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Workflow Trigger Button */}
          {handleWorkflowTrigger && (
            <Button
              variant="outline"
              size="sm"
              onClick={triggerWorkflow}
              disabled={isLoading}
              className="hidden sm:flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {isLoading ? 'Executando...' : 'Trigger Workflow'}
            </Button>
          )}

          {/* Search */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Bell className="h-4 w-4" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback>
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {profile?.first_name} {profile?.last_name}
                  </span>
                  <Badge className={`text-xs ${getRoleColor(role)}`}>
                    {role}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {profile?.first_name} {profile?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className="w-full justify-start flex items-center gap-2 mb-2"
              >
                <span>{item.icon}</span>
                {item.label}
              </Button>
            ))}
            {handleWorkflowTrigger && (
              <Button
                variant="outline"
                onClick={triggerWorkflow}
                disabled={isLoading}
                className="w-full justify-start flex items-center gap-2 mt-4"
              >
                <Zap className="h-4 w-4" />
                {isLoading ? 'Executando...' : 'Trigger Workflow'}
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
