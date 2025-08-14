
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Cpu, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-3amg-dark via-3amg-dark-light to-3amg-dark">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-tech-pattern"></div>
        {/* Binary Code Animation */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-3amg-orange font-mono text-sm animate-binary-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        {/* Logo Central */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-3amg rounded-full animate-pulse-orange opacity-20"></div>
              <img 
                src="/lovable-uploads/71a5762a-fd4e-406c-bf7c-1e3df758cc53.png" 
                alt="3AMG Logo" 
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-3amg bg-clip-text text-transparent">
          3AMG
        </h1>
        <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">
          Automação & Inteligência Artificial
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Transformamos empresas através de soluções inteligentes de automação, 
          integrações avançadas e agentes de IA especializados para revolucionar 
          seu atendimento e processos.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/auth">
            <Button size="lg" className="bg-gradient-3amg-orange hover:opacity-90 text-white font-semibold px-8 py-4 text-lg">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-3amg-orange text-3amg-orange hover:bg-3amg-orange hover:text-white px-8 py-4 text-lg">
            Conhecer Soluções
          </Button>
        </div>

        {/* Tech Icons */}
        <div className="flex justify-center space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-3amg-orange rounded-full flex items-center justify-center mb-2">
              <Code className="h-6 w-6 text-white" />
            </div>
            <span className="text-gray-400 text-sm">Automação</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-3amg-purple rounded-full flex items-center justify-center mb-2">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <span className="text-gray-400 text-sm">IA</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-gradient-3amg rounded-full flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-gray-400 text-sm">Integrações</span>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
