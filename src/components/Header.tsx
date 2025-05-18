
import { Link } from "react-router-dom";
import UserMenu from "@/components/UserMenu";
import { useAuthContext } from "@/context/AuthContext";

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
                className="text-sm font-medium hover:underline"
              >
                Organizações
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
        
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
