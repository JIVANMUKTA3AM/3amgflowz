import { motion } from "framer-motion";
import { Bot, Headphones, DollarSign, Wrench, TrendingUp, Zap, ArrowRight, Activity, Network, Calendar, FileText, CreditCard, RefreshCw } from "lucide-react";

const LayersSection = () => {
  const agents = [
    {
      icon: Headphones,
      name: "Agente de Triagem Inteligente",
      description: "Entende a solicitação do cliente e encaminha automaticamente para o setor correto.",
      iconBg: "icon-box-turquoise",
      color: "turquoise",
      capabilities: [
        "Classificação automática de demandas",
        "Encaminhamento inteligente por contexto",
        "Atendimento 24/7 via WhatsApp"
      ]
    },
    {
      icon: Wrench,
      name: "Agente Técnico NOC",
      description: "Diagnóstico e resolução automatizada de problemas técnicos de rede.",
      iconBg: "icon-box-blue",
      color: "blue",
      capabilities: [
        "Verificação de sinais e qualidade da conexão",
        "Diagnóstico automático de falhas",
        "Monitoramento da rede",
        "Agendamento de atendimentos técnicos"
      ]
    },
    {
      icon: TrendingUp,
      name: "Agente Comercial",
      description: "Gestão comercial automatizada para vendas e relacionamento.",
      iconBg: "icon-box-purple",
      color: "purple",
      capabilities: [
        "Informações sobre planos",
        "Alterações de serviços",
        "Ofertas e retenção"
      ]
    },
    {
      icon: DollarSign,
      name: "Agente Financeiro",
      description: "Automação completa de processos financeiros e cobrança.",
      iconBg: "icon-box-green",
      color: "green",
      capabilities: [
        "Boletos e pagamentos",
        "Segunda via",
        "Negociações",
        "Status financeiro do cliente"
      ]
    },
  ];

  return (
    <section className="relative py-32 overflow-hidden">
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
            <Bot className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200 text-sm font-medium">Fluxo de Atendimento Inteligente</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Triagem + Agentes Especializados
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Um fluxo único de atendimento que entende cada solicitação e direciona automaticamente para o agente certo
          </p>
        </motion.div>

        {/* Flow visualization */}
        <div className="max-w-6xl mx-auto space-y-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="modern-card rounded-3xl p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-4 md:min-w-[300px]">
                    <div className={`${agent.iconBg} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <agent.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{agent.name}</h3>
                      <p className="text-gray-400 text-sm">{agent.description}</p>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {agent.capabilities.map((cap, capIndex) => (
                        <div key={capIndex} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                          <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-300 text-sm">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow connector between agents */}
              {index < agents.length - 1 && (
                <div className="flex justify-center py-2">
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6 text-purple-400/50 rotate-90" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-blue-950/40 backdrop-blur-lg border border-blue-500/20 rounded-full px-8 py-4">
            <Bot className="w-6 h-6 text-blue-400 animate-pulse" />
            <span className="text-gray-300 font-medium">Roteamento Inteligente entre Agentes</span>
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
