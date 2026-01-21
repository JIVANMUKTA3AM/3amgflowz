import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Bot, Zap, BarChart3, MessageSquare } from "lucide-react";

const HeroSection = () => {
  const whatsappNumber = "5515997668073";
  const demoMessage = encodeURIComponent("Olá! Vim pelo site da 3AMG e gostaria de agendar uma demonstração da plataforma para meu provedor.");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0D1B3E] via-[#1A1F3A] to-[#0D1B3E]">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      {/* Floating Particles - Subtle */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Central Glow Effect */}
      <div className="absolute inset-0 z-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="container mx-auto px-4 z-20 text-center">
        {/* Status Badge */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 bg-blue-950/40 backdrop-blur-lg border border-blue-500/20 rounded-full px-6 py-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-200 text-sm font-medium tracking-wide">
              Plataforma de Agentes Inteligentes para ISPs
            </span>
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Automatize sua operação.
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Escale sem contratar.
          </span>
        </motion.h1>

        {/* Subtitle - Clear value proposition */}
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Agentes inteligentes que atendem seus clientes via WhatsApp, 
          resolvem problemas técnicos, fazem cobranças e geram relatórios — 
          tudo automatizado, 24 horas por dia.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-5 justify-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <motion.a
            href={`https://wa.me/${whatsappNumber}?text=${demoMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button size="lg" className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-10 py-6 text-base rounded-2xl overflow-hidden transition-all duration-300 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50">
              <div className="relative flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Solicitar Demonstração
              </div>
            </Button>
          </motion.a>
          
          <Link to="/pricing">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg" 
                className="group relative border-2 border-blue-400/50 bg-blue-950/30 backdrop-blur-md text-blue-200 hover:text-white hover:border-blue-400 px-10 py-6 text-base rounded-2xl hover:bg-blue-900/40 transition-all duration-300 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                <span className="relative flex items-center gap-2">
                  Ver Planos e Preços
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Benefits Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            {
              icon: Bot,
              title: "Atendimento 24/7",
              description: "Agentes respondem e resolvem via WhatsApp, sem pausa",
              iconBg: "icon-box-blue"
            },
            {
              icon: Zap,
              title: "Automação Completa",
              description: "Técnico, comercial e financeiro integrados ao seu SGP",
              iconBg: "icon-box-purple"
            },
            {
              icon: BarChart3,
              title: "Métricas em Tempo Real",
              description: "Dashboards de operação, custos e performance",
              iconBg: "icon-box-pink"
            }
          ].map((benefit, index) => (
            <motion.div
              key={index}
              className="modern-card rounded-3xl p-8 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <div className={`${benefit.iconBg} w-14 h-14 rounded-xl flex items-center justify-center mb-5`}>
                <benefit.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D1B3E] to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;
