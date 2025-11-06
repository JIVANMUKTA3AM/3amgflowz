import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ModernHeader = () => {
  const menuItems = [
    { label: "Soluções", href: "#solucoes" },
    { label: "Tecnologia", href: "#tecnologia" },
    { label: "Preços", href: "#precos" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-modern-blue-deep via-modern-blue-dark to-modern-purple-vibrant/80 backdrop-blur-md shadow-xl border-b border-white/10"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-modern-blue-primary to-modern-turquoise rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded transform rotate-45"></div>
            </div>
            <span className="font-bold text-xl text-white tracking-wide">3AMG</span>
          </Link>

          {/* Menu Central */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/90 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 hover:scale-105 transform"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Botões à Direita */}
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-white/10 font-medium"
              >
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-modern-turquoise hover:bg-modern-turquoise/90 text-white font-medium px-6 rounded-full shadow-lg hover:shadow-modern-turquoise/50 transition-all duration-300">
                Começar Grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ModernHeader;
