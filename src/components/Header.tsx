
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

type HeaderProps = {
  handleWorkflowTrigger?: (workflowType: string) => Promise<void>;
  isLoading?: boolean;
}

const Header = ({ handleWorkflowTrigger, isLoading }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm py-4 mb-6">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Automação</h1>
        <NavigationMenu>
          <NavigationMenuList>
            {handleWorkflowTrigger && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Workflows</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <div className="p-2">
                      <h3 className="font-medium mb-1 text-sm">Workflows Disponíveis</h3>
                      <p className="text-sm text-muted-foreground">
                        Selecione um tipo de workflow para executar
                      </p>
                    </div>
                    <button 
                      onClick={() => handleWorkflowTrigger("processamento_dados")}
                      className={navigationMenuTriggerStyle() + " w-full justify-start"}
                      disabled={isLoading}
                    >
                      Processamento de Dados
                    </button>
                    <button 
                      onClick={() => handleWorkflowTrigger("notificacao")}
                      className={navigationMenuTriggerStyle() + " w-full justify-start"}
                      disabled={isLoading}
                    >
                      Sistema de Notificação
                    </button>
                    <button 
                      onClick={() => handleWorkflowTrigger("integracao")}
                      className={navigationMenuTriggerStyle() + " w-full justify-start"}
                      disabled={isLoading}
                    >
                      Integração com APIs
                    </button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem>
              <Link to="/arquitetura" className={navigationMenuTriggerStyle()}>
                Arquitetura
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/modelo-dados" className={navigationMenuTriggerStyle()}>
                Modelo de Dados
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/fluxos" className={navigationMenuTriggerStyle()}>
                Fluxos n8n
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/pagamentos" className={navigationMenuTriggerStyle()}>
                Pagamentos
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
