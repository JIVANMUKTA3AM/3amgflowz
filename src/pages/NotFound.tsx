
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-3amg-dark">
      <div className="text-center p-8 bg-gray-900/90 rounded-xl border border-3amg-orange/20 shadow-xl backdrop-blur-sm">
        <h1 className="text-6xl font-bold mb-4 text-3amg-orange">404</h1>
        <p className="text-xl text-gray-300 mb-6">Oops! Página não encontrada</p>
        <p className="text-gray-400 mb-8">A página que você está procurando não existe ou foi movida.</p>
        <a 
          href="/" 
          className="inline-block bg-gradient-3amg text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
