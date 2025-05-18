
import { Link } from "react-router-dom";
import UserMenu from "@/components/UserMenu";
import { useAuthContext } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Building, User } from "lucide-react";

const Header = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/" className="font-bold text-xl">
            SaaS Manager
          </Link>
          
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-4">
              <Link to="/" className="text-sm font-medium hover:underline">
                Dashboard
              </Link>
              <Link
                to="/organizations"
                className="text-sm font-medium hover:underline flex items-center"
              >
                <Building className="h-3.5 w-3.5 mr-1" />
                Organizações
              </Link>
              <Link
                to="/profile"
                className="text-sm font-medium hover:underline flex items-center"
              >
                <User className="h-3.5 w-3.5 mr-1" />
                Meu Perfil
              </Link>
              <Link
                to="/documentation"
                className="text-sm font-medium hover:underline"
              >
                Documentação
              </Link>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <Link to="/auth">
              <Button variant="default" size="sm">
                Entrar
              </Button>
            </Link>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
