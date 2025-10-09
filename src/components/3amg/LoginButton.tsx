import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const LoginButton = () => {
  return (
    <div className="fixed right-8 top-6 z-[9999]">
      <Link to="/auth">
        <Button 
          variant="neon" 
          size="lg"
          className="group shadow-2xl hover:shadow-purple-500/60 flex-col h-auto py-4 px-3 gap-2 backdrop-blur-sm"
        >
          <LogIn className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-semibold whitespace-nowrap leading-tight">Entrar no<br/>Sistema</span>
        </Button>
      </Link>
    </div>
  );
};

export default LoginButton;
