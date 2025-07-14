
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Bot, 
  Settings, 
  Database, 
  Zap, 
  Users, 
  BarChart3, 
  CreditCard,
  UserCircle,
  LogOut,
  Building,
  Webhook,
  MessageSquare,
  GitBranch,
  FileText,
  Layers,
  Table,
  Play,
  Palette,
  Users2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import UserMenu from "./UserMenu";

interface HeaderProps {
  handleWorkflowTrigger: () => void;
  isLoading: boolean;
}

const Header = ({ handleWorkflowTrigger, isLoading }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Agentes", href: "/agentes", icon: Bot },
    { name: "CRM", href: "/crm", icon: Users2 },
    { name: "Integrações", href: "/integracoes", icon: Zap },
    { name: "Fluxos", href: "/fluxos", icon: GitBranch },
    ...(role === 'admin' ? [
      { name: "Banco de Dados", href: "/database-management", icon: Database },
      { name: "Usuários", href: "/subscription-management", icon: Users },
      { name: "Webhooks Admin", href: "/admin-webhooks", icon: Webhook },
    ] : []),
    { name: "Documentação", href: "/documentacao", icon: FileText },
    { name: "Arquitetura", href: "/arquitetura", icon: Layers },
    { name: "Modelo de Dados", href: "/modelo-dados", icon: Table },
    { name: "N8N Management", href: "/n8n-management", icon: Play },
    { name: "Pagamentos", href: "/pagamentos", icon: CreditCard },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Sistema Provedor</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/agentes" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Agentes
            </Link>
            <Link to="/crm" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              CRM
            </Link>
            <Link to="/integracoes" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Integrações
            </Link>
            <Link to="/fluxos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Fluxos
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              onClick={handleWorkflowTrigger}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isLoading ? "Executando..." : "Executar Workflow"}
            </Button>
            
            <UserMenu />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 mt-4 pt-4">
                <Button
                  onClick={handleWorkflowTrigger}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="w-full mb-2"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isLoading ? "Executando..." : "Executar Workflow"}
                </Button>
                
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
