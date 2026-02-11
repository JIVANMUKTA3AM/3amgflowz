import { Network, Workflow, Code, Shield } from "lucide-react";
import { motion } from "framer-motion";

const ArchitectureSection = () => {
  const architectureComponents = [
    {
      icon: <Network className="h-6 w-6" />,
      title: "Pipeline de Agentes IA",
      description: "Orquestração inteligente de múltiplos agentes especializados trabalhando em conjunto",
      color: "pink"
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Orquestração com n8n",
      description: "Automação avançada de fluxos de trabalho com integração entre sistemas",
      color: "purple"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "APIs REST + SNMP",
      description: "Comunicação universal via protocolos REST e monitoramento SNMP em tempo real",
      color: "turquoise"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Multi-tenant Seguro",
      description: "Isolamento completo de dados por cliente com segurança enterprise",
      color: "blue"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Futuristic circuit background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1000 600">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#9B5CFF">
                <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
              <line x1="50" y1="50" x2="100" y2="50" stroke="#FF47B3" strokeWidth="0.5" opacity="0.5" />
              <line x1="50" y1="50" x2="50" y2="100" stroke="#40E0D0" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
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
            Arquitetura <span className="text-modern-pink">Inteligente</span> 3AMG
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Infraestrutura distribuída e escalável com componentes de última geração
          </p>
        </motion.div>

        {/* Neon divider with glow */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px w-48 bg-gradient-to-r from-transparent via-modern-pink to-modern-purple-vibrant shadow-[0_0_15px_rgba(255,71,179,0.8)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {architectureComponents.map((component, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.08, y: -10 }}
              className="modern-card group cursor-pointer relative"
            >
              {/* Neon border glow on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                   style={{
                     background: `linear-gradient(135deg, rgba(155,92,255,0.3), rgba(255,71,179,0.3))`,
                     filter: 'blur(10px)'
                   }}
              ></div>
              
              <div className="relative z-10">
                <div className={`icon-box-${component.color} mb-6 mx-auto`}>
                  {component.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-modern-pink transition-colors">
                  {component.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {component.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Connection animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-modern-blue-dark/50 border border-modern-purple-vibrant/30">
            <div className="w-2 h-2 bg-modern-pink rounded-full animate-pulse shadow-[0_0_10px_rgba(255,71,179,0.8)]"></div>
            <span className="text-gray-300 text-sm">Arquitetura em Execução</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArchitectureSection;
