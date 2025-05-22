
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MenuIcon, MessagesSquare, Settings, Code, LayoutDashboard, FileText, Database, Package } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type HeaderProps = {
  handleWorkflowTrigger?: (workflowType: string) => Promise<void>;
  isLoading?: boolean;
}

const Header = ({ handleWorkflowTrigger, isLoading }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { label: "Fluxos", href: "/fluxos", icon: <Code className="w-4 h-4 mr-2" /> },
    { label: "Agentes", href: "/agentes", icon: <MessagesSquare className="w-4 h-4 mr-2" /> },
    { label: "Integrações", href: "/integracoes", icon: <Package className="w-4 h-4 mr-2" /> },
    { label: "Pagamentos", href: "/pagamentos", icon: <Settings className="w-4 h-4 mr-2" /> },
    { label: "Arquitetura", href: "/arquitetura", icon: <Database className="w-4 h-4 mr-2" /> },
    { label: "Modelo de Dados", href: "/modelo-dados", icon: <Database className="w-4 h-4 mr-2" /> },
    { label: "Documentação", href: "/documentacao", icon: <FileText className="w-4 h-4 mr-2" /> },
  ];

  const handleNavItemClick = () => {
    setOpen(false);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Título */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-900">
              n8n Connect
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      className="flex items-center py-2 px-3 rounded-md hover:bg-gray-100"
                      onClick={handleNavItemClick}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Botões de Ação (se presentes) */}
          {handleWorkflowTrigger && (
            <div className="hidden md:flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWorkflowTrigger("processamento_dados")}
                disabled={isLoading}
              >
                Processar Dados
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleWorkflowTrigger("notificacao")}
                disabled={isLoading}
              >
                Enviar Notificação
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
