
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">3AMG</h3>
            <p className="text-purple-200">Integração e automação de fluxos de trabalho</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/arquitetura" className="text-purple-200 hover:text-white transition-colors duration-200">
              Arquitetura
            </Link>
            <Link to="/modelo-dados" className="text-purple-200 hover:text-white transition-colors duration-200">
              Modelo de Dados
            </Link>
            <Link to="/fluxos" className="text-purple-200 hover:text-white transition-colors duration-200">
              Fluxos n8n
            </Link>
            <Link to="/documentacao" className="text-purple-200 hover:text-white transition-colors duration-200">
              Documentação
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-purple-600 pt-6 text-center text-purple-200 text-sm">
          © {new Date().getFullYear()} 3AMG. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
