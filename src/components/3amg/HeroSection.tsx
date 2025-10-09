

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Code, Cpu, Zap, Terminal, Database, Workflow, Rocket } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Neon Glow Effects */}
      <div className="absolute inset-0 z-10">
        {/* Purple Neon Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-500 rounded-full opacity-15 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
        
        {/* Floating Tech Icons */}
        {Array.from({ length: 12 }).map((_, i) => {
          const icons = [Code, Cpu, Terminal, Database, Workflow, Zap];
          const Icon = icons[i % icons.length];
          return (
            <div
              key={i}
              className="absolute text-purple-400 opacity-10 animate-float-tech"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                fontSize: `${Math.random() * 8 + 16}px`,
              }}
            >
              <Icon />
            </div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 z-20 text-center">
        {/* Dynamic Header Badge */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-purple-950/30 backdrop-blur-md border border-purple-500/20 rounded-full px-6 py-3 mb-6 hover:border-purple-500/40 transition-all">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
            <span className="text-purple-300 text-sm font-medium tracking-wide">API-First • Enterprise Ready • 99.9% Uptime</span>
          </div>
        </div>

        {/* Hero Title with Glow */}
        <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-purple-300 to-orange-400 bg-clip-text text-transparent leading-tight animate-text-glow">
          3AMG
        </h1>
        
        <div className="relative mb-8">
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6 leading-tight">
            Plataforma de Agentes IA para
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent font-bold">Provedores e Empresas Tech</span>
            </span>
          </h2>
        </div>

        <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed">
          Reduza custos operacionais em até <span className="text-orange-400 font-bold">70%</span> e escale seu atendimento sem aumentar equipe. 
          Nossa plataforma integra <span className="text-purple-400 font-semibold">n8n e APIs REST</span> para automatizar processos, 
          garantir <span className="text-orange-400 font-bold">99,9% de disponibilidade</span> e atender clientes 
          <span className="text-orange-400 font-bold"> 24/7</span>.
        </p>

        {/* Key Benefits Cards with 3D Effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <div className="group relative bg-gradient-to-br from-purple-950/40 to-purple-900/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-2">-70%</div>
              <div className="text-sm text-gray-300 font-medium">Redução de Custos Operacionais</div>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-purple-950/40 to-purple-900/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-sm text-gray-300 font-medium">Atendimento Automatizado</div>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-purple-950/40 to-purple-900/20 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            <div className="relative">
              <div className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent mb-2">99.9%</div>
              <div className="text-sm text-gray-300 font-medium">SLA de Disponibilidade</div>
            </div>
          </div>
        </div>

        {/* Modern CTAs with Glow Effect */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link to="/auth">
            <Button size="lg" className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-12 py-7 text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center">
                <Rocket className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Começar Agora - Login
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </Link>
          <Button size="lg" className="group relative border-2 border-purple-500/50 bg-purple-950/30 backdrop-blur-md text-purple-300 hover:text-white hover:border-purple-400 px-12 py-7 text-lg rounded-2xl hover:bg-purple-900/40 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30">
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

