
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">3AMG</h3>
            <p className="text-gray-400">Integração e automação de fluxos de trabalho</p>
          </div>
          <div className="flex space-x-4">
            <Link to="/arquitetura" className="text-gray-300 hover:text-white">
              Arquitetura
            </Link>
            <Link to="/modelo-dados" className="text-gray-300 hover:text-white">
              Modelo de Dados
            </Link>
            <Link to="/fluxos" className="text-gray-300 hover:text-white">
              Fluxos n8n
            </Link>
            <Link to="/documentacao" className="text-gray-300 hover:text-white">
              Documentação
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} 3AMG. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
