
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";

type HeaderProps = {
  handleWorkflowTrigger: (workflowType: string) => Promise<void>;
  isLoading: boolean;
};

const Header = ({ handleWorkflowTrigger, isLoading }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/agentes", label: "Agentes" },
    { path: "/integracoes", label: "Integrações" },
    { path: "/fluxos", label: "Fluxos" },
    { path: "/pagamentos", label: "Pagamentos" },
    { path: "/arquitetura", label: "Arquitetura" },
    { path: "/documentacao", label: "Documentação" },
  ];

  const isActiveLink = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">3AMG</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActiveLink(item.path)
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side - User Menu and Quick Action */}
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => handleWorkflowTrigger("test")}
              disabled={isLoading}
              size="sm"
              className="hidden md:inline-flex"
            >
              {isLoading ? "Processando..." : "Teste Rápido"}
            </Button>
            
            <UserMenu />

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 px-2 py-1 ${
                    isActiveLink(item.path)
                      ? "text-blue-600 bg-blue-50 rounded"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                onClick={() => {
                  handleWorkflowTrigger("test");
                  setIsMobileMenuOpen(false);
                }}
                disabled={isLoading}
                size="sm"
                className="mt-4 w-full"
              >
                {isLoading ? "Processando..." : "Teste Rápido"}
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
