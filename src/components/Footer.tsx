import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const whatsappNumber = "5515997668073";
  const contactMessage = encodeURIComponent("Olá! Gostaria de falar com a equipe técnica da 3AMG.");

  return (
    <footer className="border-t border-white/10 backdrop-blur-md text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">3AMG</h3>
            <p className="text-gray-400">Infraestrutura de agentes autônomos para ISPs</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <Link to="/arquitetura" className="text-gray-400 hover:text-white transition-colors duration-200">
              Arquitetura
            </Link>
            <Link to="/modelo-dados" className="text-gray-400 hover:text-white transition-colors duration-200">
              Modelo de Dados
            </Link>
            <Link to="/documentacao" className="text-gray-400 hover:text-white transition-colors duration-200">
              Documentação
            </Link>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${contactMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Conectar no WhatsApp
              </Button>
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} 3AMG. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
