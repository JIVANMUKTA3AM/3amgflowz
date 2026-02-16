import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Menu, X } from "lucide-react";

const ModernHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const whatsappNumber = "5515997668073";
  const contactMessage = encodeURIComponent("Olá! Gostaria de falar com a equipe técnica da 3AMG.");

  const menuItems = [
    { label: "Arquitetura", href: "#tecnologia" },
    { label: "Agentes", href: "#solucoes" },
    { label: "Artigos Técnicos", href: "/conhecimento", isLink: true },
    { label: "Planos", href: "/pricing", isLink: true },
  ];

  const isActive = (href: string) =>
    href.startsWith("/") && location.pathname === href;

  return (
    <>
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

            {/* Menu Central – desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) =>
                item.isLink ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`text-sm font-medium tracking-wide transition-colors duration-200 hover:scale-105 transform ${
                      isActive(item.href)
                        ? "text-white border-b-2 border-modern-turquoise pb-0.5"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-white/90 hover:text-white text-sm font-medium tracking-wide transition-colors duration-200 hover:scale-105 transform"
                  >
                    {item.label}
                  </a>
                )
              )}
            </nav>

            {/* Botões à Direita – desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 font-medium">
                  Entrar
                </Button>
              </Link>
              <a href={`https://wa.me/${whatsappNumber}?text=${contactMessage}`} target="_blank" rel="noopener noreferrer">
                <Button className="bg-modern-turquoise hover:bg-modern-turquoise/90 text-white font-medium px-6 rounded-full shadow-lg hover:shadow-modern-turquoise/50 transition-all duration-300">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Falar com Engenharia
                </Button>
              </a>
            </div>

            {/* Hamburger – mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Abrir menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[280px] bg-gray-900/95 backdrop-blur-xl border-l border-white/10 flex flex-col p-6 pt-20 md:hidden overflow-y-auto"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fechar menu"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex flex-col space-y-1">
                {menuItems.map((item) =>
                  item.isLink ? (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`text-base font-medium py-3 px-4 rounded-lg transition-colors min-h-[44px] flex items-center ${
                        isActive(item.href)
                          ? "text-white bg-modern-turquoise/20 border-l-2 border-modern-turquoise"
                          : "text-white/90 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-white/90 hover:text-white hover:bg-white/10 text-base font-medium py-3 px-4 rounded-lg transition-colors min-h-[44px] flex items-center"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </div>

              <div className="mt-8 flex flex-col space-y-3 border-t border-white/10 pt-6">
                <Link to="/auth" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10 min-h-[44px]">
                    Entrar
                  </Button>
                </Link>
                <a href={`https://wa.me/${whatsappNumber}?text=${contactMessage}`} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-modern-turquoise hover:bg-modern-turquoise/90 text-white font-medium rounded-full shadow-lg min-h-[44px]">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Falar com Engenharia
                  </Button>
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModernHeader;
