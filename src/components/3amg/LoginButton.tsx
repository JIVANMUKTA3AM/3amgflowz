import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const LoginButton = () => {
  return (
    <div className="fixed top-6 right-6 z-50">
      <Link to="/auth">
        <Button 
          variant="neon" 
          size="lg"
          className="group shadow-2xl hover:shadow-purple-500/60"
        >
          <LogIn className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
          Entrar no Sistema
        </Button>
      </Link>
    </div>
  );
};

export default LoginButton;
