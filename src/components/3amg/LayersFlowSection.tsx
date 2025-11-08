import { ArrowRight, Users, Building2, Zap } from "lucide-react";
import { motion } from "framer-motion";

const LayersFlowSection = () => {
  const b2cFlow = [
    { name: "Triagem", icon: Users, description: "Identificação automática da necessidade do cliente" },
    { name: "Técnico", icon: Zap, description: "Resolução de problemas técnicos" },
    { name: "Comercial", icon: Building2, description: "Ofertas e vendas personalizadas" },
    { name: "Financeiro", icon: Users, description: "Gestão de pagamentos e cobranças" }
  ];

  const b2bFlow = [
    { name: "Técnico Interno", icon: Zap, description: "Monitoramento de infraestrutura" },
    { name: "Comercial B2B", icon: Building2, description: "Gestão de parcerias" },
    { name: "Financeiro B2B", icon: Users, description: "Controle financeiro interno" },
    { name: "Painéis Admin", icon: Users, description: "Dashboards de gestão" }
  ];

  return (
    <section className="py-24 bg-modern-blue-deep relative overflow-hidden">
      {/* Animated connection lines background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 600">
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#9B5CFF" strokeWidth="1" opacity="0.3">
            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="400" x2="1000" y2="400" stroke="#FF47B3" strokeWidth="1" opacity="0.3">
            <animate attributeName="stroke-dasharray" values="0,1000;1000,0" dur="3s" begin="0.5s" repeatCount="indefinite" />
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
            Como a IA <span className="text-modern-turquoise">Atua nas Camadas</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Fluxo inteligente de agentes atuando nas camadas B2C e B2B integradas
          </p>
        </motion.div>

        {/* B2C Layer */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-modern-pink rounded-full shadow-[0_0_15px_rgba(255,71,179,0.8)]"></div>
            <h3 className="text-3xl font-bold text-white">
              Camada <span className="text-modern-pink">B2C</span> (Externa)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {b2cFlow.map((step, index) => {
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
                      <div className="icon-box-pink">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      {index < b2cFlow.length - 1 && (
                        <ArrowRight className="absolute -right-8 top-1/2 transform -translate-y-1/2 hidden md:block text-modern-pink h-6 w-6 opacity-50" />
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 text-center group-hover:text-modern-pink transition-colors">
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

        {/* Connection between layers */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <div className="flex items-center gap-4 px-8 py-4 rounded-full bg-modern-blue-dark/50 border border-modern-purple-vibrant/30">
            <div className="w-3 h-3 bg-modern-turquoise rounded-full animate-pulse shadow-[0_0_15px_rgba(64,224,208,0.8)]"></div>
            <span className="text-white font-semibold">Integração em Tempo Real</span>
            <div className="w-3 h-3 bg-modern-turquoise rounded-full animate-pulse shadow-[0_0_15px_rgba(64,224,208,0.8)]" style={{animationDelay: '0.5s'}}></div>
          </div>
        </motion.div>

        {/* B2B Layer */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-3 h-3 bg-modern-purple-vibrant rounded-full shadow-[0_0_15px_rgba(155,92,255,0.8)]"></div>
            <h3 className="text-3xl font-bold text-white">
              Camada <span className="text-modern-purple-vibrant">B2B</span> (Interna)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {b2bFlow.map((step, index) => {
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
                      {index < b2bFlow.length - 1 && (
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
      </div>
    </section>
  );
};

export default LayersFlowSection;
