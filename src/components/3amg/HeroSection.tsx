import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Zap, Code, Server, Network, Activity, Cpu } from "lucide-react";

const HeroSection = () => {
  const whatsappNumber = "5515997668073";
  const demoMessage = encodeURIComponent("Olá! Gostaria de explorar a infraestrutura da plataforma 3AMG para minha operação.");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Grid Mesh Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="grid-mesh-bg opacity-60"></div>
      </div>

      {/* Network Connection Lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <line x1="10%" y1="20%" x2="40%" y2="35%" stroke="url(#lineGradient1)" strokeWidth="1" className="data-line" />
        <line x1="60%" y1="15%" x2="85%" y2="40%" stroke="url(#lineGradient2)" strokeWidth="1" className="data-line" style={{ animationDelay: '1s' }} />
        <line x1="20%" y1="70%" x2="50%" y2="55%" stroke="url(#lineGradient1)" strokeWidth="1" className="data-line" style={{ animationDelay: '2s' }} />
        <line x1="70%" y1="75%" x2="90%" y2="50%" stroke="url(#lineGradient2)" strokeWidth="1" className="data-line" style={{ animationDelay: '0.5s' }} />
      </svg>

      {/* Network Nodes */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { left: '10%', top: '20%', delay: '0s' },
          { left: '40%', top: '35%', delay: '0.5s' },
          { left: '60%', top: '15%', delay: '1s' },
          { left: '85%', top: '40%', delay: '1.5s' },
          { left: '20%', top: '70%', delay: '2s' },
          { left: '70%', top: '75%', delay: '2.5s' },
        ].map((node, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full network-node"
            style={{ left: node.left, top: node.top, animationDelay: node.delay }}
          />
        ))}
      </div>

      {/* Central Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/15 rounded-full blur-[200px]"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-pink-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 z-20 text-center max-w-6xl">
        {/* Engine Badge */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 bg-purple-950/50 backdrop-blur-xl border border-purple-500/30 rounded-full px-6 py-3 engine-badge">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-purple-200 text-sm font-medium tracking-wide">
              Engine v2.0: Operação em Tempo Real
            </span>
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="block mb-2">A Próxima Evolução na</span>
          <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent cyber-text-glow">
            Operação de ISPs
          </span>
          <span className="block text-3xl md:text-4xl lg:text-5xl mt-4 text-gray-300 font-medium">
            Orquestração de Agentes Autônomos
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Automatize processos técnicos, comerciais e financeiros via WhatsApp. 
          Integração profunda com telemetria, billing e observabilidade via API 
          para escalar sua operação sem aumentar o headcount.
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
            <Button size="lg" className="btn-glow group relative text-white font-semibold px-10 py-6 text-base rounded-2xl overflow-hidden transition-all duration-300">
              <div className="relative flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Explorar Infraestrutura
              </div>
            </Button>
          </motion.a>
          
          <Link to="/documentacao">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg" 
                className="group relative border-2 border-blue-500/50 bg-blue-950/30 backdrop-blur-md text-blue-200 hover:text-white hover:border-blue-400 px-10 py-6 text-base rounded-2xl hover:bg-blue-900/40 transition-all duration-300 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/30"
              >
                <span className="relative flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Ver Documentação API
                </span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>

        {/* Feature Cards - Cyber Glassmorphism */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            {
              icon: Cpu,
              title: "Full-Stack Automation",
              description: "Execução autônoma 24/7 de fluxos de rede e faturamento.",
              gradient: "from-purple-500 to-pink-500"
            },
            {
              icon: Network,
              title: "Ecossistema de APIs",
              description: "Conexão nativa com MikroTik, Huawei e principais ERPs de billing.",
              gradient: "from-blue-500 to-purple-500"
            },
            {
              icon: Activity,
              title: "Observabilidade Preditiva",
              description: "Dashboards de telemetria em tempo real integrados aos agentes de resposta.",
              gradient: "from-cyan-500 to-blue-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="cyber-glass-card text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1, duration: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030712]/80 to-transparent z-10"></div>
    </section>
  );
};

export default HeroSection;
