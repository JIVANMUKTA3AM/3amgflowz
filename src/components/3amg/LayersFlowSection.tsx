import { ArrowRight, Headphones, Wrench, TrendingUp, DollarSign, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const LayersFlowSection = () => {
  const flow = [
    { name: "Triagem", icon: Headphones, description: "Entende a solicitação e encaminha automaticamente" },
    { name: "Técnico NOC", icon: Wrench, description: "Diagnóstico e suporte técnico de rede" },
    { name: "Comercial", icon: TrendingUp, description: "Planos, ofertas e retenção" },
    { name: "Financeiro", icon: DollarSign, description: "Boletos, pagamentos e negociações" }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated connection lines background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 600">
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#9B5CFF" strokeWidth="1" opacity="0.3">
            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="3s" repeatCount="indefinite" />
          </line>
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Como o <span className="text-modern-turquoise">Atendimento Funciona</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Fluxo único de atendimento inteligente com triagem automática e agentes especializados
          </p>
        </motion.div>

        {/* Single unified flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Entry point */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-green-950/40 border border-green-500/30">
              <MessageSquare className="w-5 h-5 text-green-400" />
              <span className="text-green-300 font-medium">Cliente envia mensagem via WhatsApp</span>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <ArrowRight className="w-6 h-6 text-purple-400/50 rotate-90" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {flow.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="modern-card group hover:scale-105 transition-transform cursor-pointer">
                    <div className="flex items-center justify-center mb-4">
                      <div className="icon-box-purple">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      {index < flow.length - 1 && (
                        <ArrowRight className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden md:block text-modern-purple-vibrant h-6 w-6 opacity-50" />
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 text-center group-hover:text-modern-purple-vibrant transition-colors">
                      {step.name}
                    </h4>
                    <p className="text-gray-400 text-sm text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Connection indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-4 px-8 py-4 rounded-full bg-modern-blue-dark/50 border border-modern-purple-vibrant/30">
            <div className="w-3 h-3 bg-modern-turquoise rounded-full animate-pulse shadow-[0_0_15px_rgba(64,224,208,0.8)]"></div>
            <span className="text-white font-semibold">Atendimento Contínuo 24/7</span>
            <div className="w-3 h-3 bg-modern-turquoise rounded-full animate-pulse shadow-[0_0_15px_rgba(64,224,208,0.8)]" style={{animationDelay: '0.5s'}}></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LayersFlowSection;
