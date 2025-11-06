import { motion } from "framer-motion";
import { Bot, Users, Headphones, DollarSign, Wrench, Building2, Shield, BarChart3, Sparkles, Zap } from "lucide-react";

const LayersSection = () => {
  const externalAgents = [
    { icon: Headphones, name: "Triagem Externa", description: "Classificação inteligente de demandas", iconBg: "icon-box-blue" },
    { icon: Wrench, name: "Técnico Externo", description: "Suporte técnico automatizado", iconBg: "icon-box-turquoise" },
    { icon: Users, name: "Comercial Externo", description: "Vendas e relacionamento", iconBg: "icon-box-purple" },
    { icon: DollarSign, name: "Financeiro Externo", description: "Cobranças e pagamentos", iconBg: "icon-box-green" },
  ];

  const internalAgents = [
    { icon: Wrench, name: "Técnico Interno", description: "Gestão de incidentes complexos", iconBg: "icon-box-blue" },
    { icon: Building2, name: "Comercial B2B", description: "Pipeline de vendas B2B", iconBg: "icon-box-pink" },
    { icon: DollarSign, name: "Financeiro B2B", description: "Controle financeiro avançado", iconBg: "icon-box-purple" },
    { icon: BarChart3, name: "Painéis Admin", description: "Analytics e relatórios", iconBg: "icon-box-turquoise" },
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-[#0D1B3E] via-[#1A1F3A] to-[#0D1B3E]">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-950/40 backdrop-blur-lg border border-blue-500/20 rounded-full px-6 py-2 mb-6">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">Arquitetura Dual-Layer</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Duas Camadas. Um Ecossistema.
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Arquitetura inteligente que conecta clientes finais e equipes internas em um único sistema integrado
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          
          {/* CAMADA EXTERNA - White Label */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="modern-card rounded-3xl p-10 h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="icon-box-purple w-14 h-14 rounded-2xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">Camada Externa</h3>
                  <p className="text-gray-400 font-medium text-sm">White-Label • Cliente Final</p>
                </div>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed">
                Interface personalizada para atendimento direto aos clientes finais dos provedores. 
                Experiência branded com IA conversacional 24/7.
              </p>

              {/* Agents Grid */}
              <div className="space-y-4 mb-6">
                {externalAgents.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  >
                    <div className={`${agent.iconBg} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <agent.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-base mb-1">{agent.name}</h4>
                      <p className="text-gray-400 text-sm">{agent.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Features */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {["Branded UI", "WhatsApp", "Telegram", "Chat Web"].map((feature) => (
                    <span key={feature} className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300 text-xs font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* CAMADA INTERNA - B2B */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="modern-card rounded-3xl p-10 h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="icon-box-blue w-14 h-14 rounded-2xl flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">Camada Interna</h3>
                  <p className="text-gray-400 font-medium text-sm">B2B • Centro de Controle</p>
                </div>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed">
                Painel completo para gestão interna dos provedores. Analytics, automações avançadas 
                e controle total sobre operações e estratégias.
              </p>

              {/* Agents Grid */}
              <div className="space-y-4 mb-6">
                {internalAgents.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  >
                    <div className={`${agent.iconBg} w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <agent.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-base mb-1">{agent.name}</h4>
                      <p className="text-gray-400 text-sm">{agent.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Features */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {["CRM", "Analytics", "N8N", "APIs REST"].map((feature) => (
                    <span key={feature} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-xs font-medium">
                      {feature}
                    </span>
                  ))}
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
          <div className="inline-flex items-center gap-4 bg-blue-950/40 backdrop-blur-lg border border-blue-500/20 rounded-full px-8 py-4">
            <Bot className="w-6 h-6 text-blue-400 animate-pulse" />
            <span className="text-gray-300 font-medium">Roteamento Inteligente entre Camadas</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full"
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
    </section>
  );
};

export default LayersSection;
