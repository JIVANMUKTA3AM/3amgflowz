
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import RoleBasedRouter from "@/components/RoleBasedRouter";
import CodeRainBackground from "@/components/CodeRainBackground";

function App() {
  console.log('App component rendered');
  
  return (
    <Router>
      <div className="relative min-h-screen bg-gray-900">
        {/* Background de códigos escorrendo em todas as páginas */}
        <CodeRainBackground />
        
        {/* Conteúdo principal */}
        <div className="relative z-10">
          <RoleBasedRouter />
          <Toaster />
        </div>
      </div>
    </Router>
  );
}

export default App;
