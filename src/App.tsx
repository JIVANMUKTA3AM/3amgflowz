
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import RoleBasedRouter from "@/components/RoleBasedRouter";
import CyberBackground from "@/components/CyberBackground";
import FloatingLogo from "@/components/FloatingLogo";

function App() {
  console.log('App component rendered');
  
  return (
    <Router>
      <div className="relative min-h-screen bg-[#030712]">
        {/* Cyber-SaaS background global */}
        <CyberBackground />
        
        {/* Conteúdo principal */}
        <FloatingLogo />
        <div className="relative z-10">
          <RoleBasedRouter />
          <Toaster />
        </div>
      </div>
    </Router>
  );
}

export default App;
