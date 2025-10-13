import { motion } from "framer-motion";
import { Bot, Users, Headphones, DollarSign, Wrench, Building2, Shield, BarChart3, Sparkles, ChevronRight } from "lucide-react";

const LayersSection = () => {
  const externalAgents = [
    { icon: Headphones, name: "Triagem Externa", description: "Classificação inteligente de demandas", color: "from-purple-500 to-purple-600" },
    { icon: Wrench, name: "Técnico Externo", description: "Suporte técnico automatizado", color: "from-blue-500 to-blue-600" },
    { icon: Users, name: "Comercial Externo", description: "Vendas e relacionamento", color: "from-orange-500 to-orange-600" },
    { icon: DollarSign, name: "Financeiro Externo", description: "Cobranças e pagamentos", color: "from-green-500 to-green-600" },
  ];

  const internalAgents = [
    { icon: Wrench, name: "Técnico Interno", description: "Gestão de incidentes complexos", color: "from-cyan-500 to-cyan-600" },
    { icon: Building2, name: "Comercial B2B", description: "Pipeline de vendas B2B", color: "from-pink-500 to-pink-600" },
    { icon: DollarSign, name: "Financeiro B2B", description: "Controle financeiro avançado", color: "from-yellow-500 to-yellow-600" },
    { icon: BarChart3, name: "Painéis Admin", description: "Analytics e relatórios", color: "from-indigo-500 to-indigo-600" },
  ];

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(155, 92, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(155, 92, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'grid-flow 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="container mx-auto px-4 z-10 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-purple-950/40 backdrop-blur-md border border-purple-500/30 rounded-full px-6 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Arquitetura Dual-Layer</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            Duas Camadas. Um Ecossistema.
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Arquitetura inteligente que conecta clientes finais e equipes internas em um único sistema integrado
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          
          {/* CAMADA EXTERNA - White Label */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-purple-950/40 via-orange-950/30 to-purple-950/40 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-8 overflow-hidden group hover:border-purple-500/40 transition-all duration-500">
              {/* Animated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Glow Effect */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-500 rounded-full opacity-15 blur-3xl group-hover:opacity-25 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-orange-500 rounded-2xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">Camada Externa</h3>
                    <p className="text-purple-300 font-medium">White-Label • Cliente Final</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-8 leading-relaxed">
                  Interface personalizada para atendimento direto aos clientes finais dos provedores. 
                  Experiência branded com IA conversacional 24/7.
                </p>

                {/* Agents Grid */}
                <div className="space-y-4">
                  {externalAgents.map((agent, index) => (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, x: 8 }}
                      className="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all duration-300 cursor-pointer group/card"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 bg-gradient-to-br ${agent.color} rounded-xl group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-300`}>
                          <agent.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-1">{agent.name}</h4>
                          <p className="text-gray-400 text-sm">{agent.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover/card:text-purple-400 group-hover/card:translate-x-1 transition-all" />
                      </div>
                      
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  ))}
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {["Branded UI", "WhatsApp", "Telegram", "Chat Web"].map((feature) => (
                      <span key={feature} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-xs font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CAMADA INTERNA - B2B */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-950/40 via-purple-950/30 to-blue-950/40 backdrop-blur-xl border border-blue-500/20 rounded-3xl p-8 overflow-hidden group hover:border-blue-500/40 transition-all duration-500">
              {/* Circuit Pattern Overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92FF' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              
              {/* Glow Effect */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500 rounded-full opacity-15 blur-3xl group-hover:opacity-25 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">Camada Interna</h3>
                    <p className="text-blue-300 font-medium">B2B • Centro de Controle</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-8 leading-relaxed">
                  Painel completo para gestão interna dos provedores. Analytics, automações avançadas 
                  e controle total sobre operações e estratégias.
                </p>

                {/* Agents Grid */}
                <div className="space-y-4">
                  {internalAgents.map((agent, index) => (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, x: -8 }}
                      className="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all duration-300 cursor-pointer group/card"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 bg-gradient-to-br ${agent.color} rounded-xl group-hover/card:scale-110 group-hover/card:rotate-3 transition-transform duration-300`}>
                          <agent.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-1">{agent.name}</h4>
                          <p className="text-gray-400 text-sm">{agent.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover/card:text-blue-400 group-hover/card:translate-x-1 transition-all" />
                      </div>
                      
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                  ))}
                </div>

                {/* Features */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex flex-wrap gap-2">
                    {["CRM", "Analytics", "N8N", "APIs REST"].map((feature) => (
                      <span key={feature} className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-xs font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Connection Flow Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-full px-8 py-4">
            <Bot className="w-6 h-6 text-purple-400 animate-pulse" />
            <span className="text-gray-300 font-medium">Roteamento Inteligente entre Camadas</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes grid-flow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>
    </section>
  );
};

export default LayersSection;
