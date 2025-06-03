
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
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with new styling */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-3amg rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-3amg bg-clip-text text-transparent">3AMG</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-all duration-200 hover:text-3amg-purple ${
                  isActiveLink(item.path)
                    ? "text-3amg-purple border-b-2 border-3amg-purple pb-1"
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
              className="hidden md:inline-flex bg-gradient-3amg hover:bg-gradient-3amg-light text-white border-0 shadow-lg"
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
                  className={`text-sm font-medium transition-colors hover:text-3amg-purple px-2 py-1 rounded ${
                    isActiveLink(item.path)
                      ? "text-3amg-purple bg-gradient-to-r from-purple-50 to-blue-50"
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
                className="mt-4 w-full bg-gradient-3amg hover:bg-gradient-3amg-light text-white"
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
