
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Cpu, Zap, Terminal, Database, Workflow } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-3amg-dark via-3amg-dark-light to-3amg-dark">
      {/* Advanced Tech Background */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 107, 53, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 53, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>

        {/* Floating Tech Icons */}
        {Array.from({ length: 15 }).map((_, i) => {
          const icons = [Code, Cpu, Terminal, Database, Workflow, Zap];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute text-3amg-orange opacity-20 animate-float-tech"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 10 + 20}px`,
              }}
            >
              <Icon />
            </div>
          );
        })}

        {/* Binary Rain */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-3amg-purple font-mono text-xs animate-binary-rain opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {Array.from({ length: 10 }).map((_, j) => (
              <div key={j} className="mb-2">
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-3amg-orange rounded-full opacity-20 animate-pulse-slow blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-3amg-purple rounded-full opacity-20 animate-pulse-slow blur-xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-3amg-red rounded-full opacity-15 animate-pulse-slow blur-xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        {/* Dynamic Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-3amg-dark-light/50 backdrop-blur-sm border border-3amg-orange/30 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-3amg-orange rounded-full animate-ping"></div>
            <span className="text-3amg-orange text-sm font-medium">Sistema Online • Agentes Ativos</span>
          </div>
        </div>

        {/* Hero Content */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-3amg bg-clip-text text-transparent leading-tight">
          3AMG
        </h1>
        
        <div className="relative mb-6">
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4">
            Automação & 
            <span className="relative mx-3">
              <span className="bg-gradient-3amg bg-clip-text text-transparent">Inteligência</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-3amg rounded-full animate-pulse"></div>
            </span>
            Artificial
          </h2>
        </div>

        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
          Transformamos empresas através de <span className="text-3amg-orange font-semibold">soluções inteligentes</span> de automação, 
          integrações avançadas e <span className="text-3amg-purple font-semibold">agentes de IA especializados</span> para revolucionar 
          seu atendimento e processos.
        </p>

        {/* Enhanced CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link to="/auth">
            <Button size="lg" className="group bg-gradient-3amg-orange hover:opacity-90 text-white font-semibold px-10 py-6 text-xl rounded-full shadow-2xl hover:shadow-3amg-orange/50 transition-all duration-300">
              Começar Agora
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-2 border-3amg-orange text-3amg-orange hover:bg-3amg-orange hover:text-white px-10 py-6 text-xl rounded-full backdrop-blur-sm bg-white/5 hover:shadow-xl transition-all duration-300">
            Conhecer Soluções
          </Button>
        </div>

        {/* Enhanced Tech Icons */}
        <div className="flex justify-center space-x-12">
          {[
            { icon: Code, label: "Automação", gradient: "from-3amg-orange to-3amg-red" },
            { icon: Cpu, label: "IA", gradient: "from-3amg-purple to-3amg-purple-dark" },
            { icon: Zap, label: "Integrações", gradient: "from-3amg-orange-light to-3amg-purple" }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer">
              <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <item.icon className="h-8 w-8 text-white" />
              </div>
              <span className="text-gray-400 text-sm font-medium group-hover:text-white transition-colors">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
