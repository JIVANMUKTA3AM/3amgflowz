
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings, User, LogOut, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkflow } from "@/hooks/useWorkflow";
import UserMenu from "./UserMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const { triggerWorkflow, isLoading } = useWorkflow();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Agentes", href: "/agentes" },
    { name: "Integrações", href: "/integracoes" },
    { name: "Webhooks", href: "/webhooks-management" },
    { name: "N8N", href: "/n8n-management" },
    { name: "Fluxos", href: "/fluxos" },
    { name: "CRM", href: "/crm" },
    { name: "Documentação", href: "/documentacao" },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">3AMG</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={triggerWorkflow}
              disabled={isLoading}
              className="hidden md:flex"
            >
              <Zap className="h-4 w-4 mr-1" />
              {isLoading ? "Executando..." : "Workflow"}
            </Button>
            
            {user ? (
              <UserMenu />
            ) : (
              <Link to="/auth">
                <Button size="sm">Entrar</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-3 py-2">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerWorkflow}
                disabled={isLoading}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-1" />
                {isLoading ? "Executando..." : "Workflow"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
