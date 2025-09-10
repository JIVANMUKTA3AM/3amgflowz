

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Cpu, Zap, Terminal, Database, Workflow, Rocket } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-3amg-dark via-3amg-dark-light to-3amg-dark">
      {/* AI Agent Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/0b29d11e-f584-4046-85c3-00c9dc431a1e.png"
          alt="AI Agent Background"
          className="w-full h-full object-cover opacity-20 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-3amg-dark/90 via-3amg-dark/70 to-3amg-dark/90"></div>
      </div>

      {/* Advanced Tech Background */}
      <div className="absolute inset-0 z-10">
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

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-3amg-orange rounded-full opacity-10 animate-pulse-slow blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-3amg-purple rounded-full opacity-10 animate-pulse-slow blur-xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-3amg-red rounded-full opacity-10 animate-pulse-slow blur-xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 z-20 text-center">
        {/* Dynamic Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-3amg-dark-light/70 backdrop-blur-sm border border-3amg-orange/30 rounded-full px-6 py-2 mb-6">
            <div className="w-2 h-2 bg-3amg-orange rounded-full animate-ping"></div>
            <span className="text-3amg-orange text-sm font-medium">API-First • Enterprise Ready • 99.9% Uptime</span>
          </div>
        </div>

        {/* Hero Content */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-3amg bg-clip-text text-transparent leading-tight">
          3AMG
        </h1>
        
        <div className="relative mb-6">
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-4">
            Plataforma de Agentes IA para
            <span className="relative mx-3">
              <span className="bg-gradient-3amg bg-clip-text text-transparent">Provedores e Empresas Tech</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-3amg rounded-full animate-pulse"></div>
            </span>
          </h2>
        </div>

        
        <p className="text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto mb-8 leading-relaxed">
          Reduza custos operacionais em até <span className="text-3amg-orange font-bold">70%</span> e escale seu atendimento sem aumentar equipe. 
          Nossa plataforma integra <span className="text-3amg-purple font-semibold">n8n e APIs REST</span> para automatizar processos, 
          garantir <span className="text-3amg-orange font-bold">99,9% de disponibilidade</span> e atender clientes 
          <span className="text-3amg-orange font-bold"> 24/7</span>.
        </p>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          <div className="bg-3amg-dark-light/40 backdrop-blur-sm border border-3amg-orange/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-3amg-orange mb-1">-70%</div>
            <div className="text-sm text-gray-300">Redução de Custos Operacionais</div>
          </div>
          <div className="bg-3amg-dark-light/40 backdrop-blur-sm border border-3amg-purple/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-3amg-purple mb-1">24/7</div>
            <div className="text-sm text-gray-300">Atendimento Automatizado</div>
          </div>
          <div className="bg-3amg-dark-light/40 backdrop-blur-sm border border-3amg-orange/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-3amg-orange mb-1">99.9%</div>
            <div className="text-sm text-gray-300">SLA de Disponibilidade</div>
          </div>
        </div>

        {/* Enhanced CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link to="/auth">
            <Button size="lg" className="group bg-gradient-3amg-orange hover:opacity-90 text-white font-semibold px-10 py-6 text-xl rounded-full shadow-2xl hover:shadow-3amg-orange/50 transition-all duration-300">
              <Rocket className="mr-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              Começar Agora - Login
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-2 border-3amg-orange text-3amg-orange hover:bg-3amg-orange hover:text-white px-10 py-6 text-xl rounded-full backdrop-blur-sm bg-white/5 hover:shadow-xl transition-all duration-300">
            Agendar Demo Técnica
          </Button>
        </div>

        {/* Enhanced Tech Stack Display */}
        <div className="flex justify-center space-x-12">
          {[
            { icon: Code, label: "APIs REST/GraphQL", gradient: "from-3amg-orange to-3amg-red" },
            { icon: Cpu, label: "LLMs Enterprise", gradient: "from-3amg-purple to-3amg-purple-dark" },
            { icon: Database, label: "Integrações N8N", gradient: "from-3amg-orange-light to-3amg-purple" }
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
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;

