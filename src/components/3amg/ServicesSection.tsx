import { Server, Workflow, Network, Database, Cpu, Zap } from "lucide-react";
import { motion } from "framer-motion";

const ServicesSection = () => {
  const services = [
    {
      icon: <Server className="h-6 w-6" />,
      title: "Agentes Autônomos",
      description: "Execução contínua de processos técnicos, comerciais e financeiros sem intervenção manual.",
      color: "pink"
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Orquestração de Processos",
      description: "Fluxos automatizados via n8n com controle de execução, retry e fallback configuráveis.",
      color: "purple"
    },
    {
      icon: <Network className="h-6 w-6" />,
      title: "Integrações Nativas",
      description: "SNMP, TR-069, APIs REST e webhooks com os principais SGPs do mercado.",
      color: "blue"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Persistência Multi-Tenant",
      description: "Isolamento de dados por provedor com criptografia e backups automáticos.",
      color: "turquoise"
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Processamento Inteligente",
      description: "Modelos de linguagem para análise de contexto e tomada de decisão automatizada.",
      color: "pink"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Event-Driven Architecture",
      description: "Webhooks e eventos em tempo real para integrações reativas e escaláveis.",
      color: "purple"
    }
  ];

  return (
    <section id="solucoes" className="py-24 bg-modern-blue-deep relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-modern-purple-vibrant rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
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
            <span className="text-modern-purple-vibrant">Capacidades</span> da Plataforma
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Infraestrutura de agentes com orquestração, observabilidade e escala operacional
          </p>
        </motion.div>

        {/* Neon divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-modern-purple-vibrant to-transparent shadow-[0_0_10px_rgba(155,92,255,0.6)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="modern-card group cursor-pointer"
            >
              <div className={`icon-box-${service.color} mb-6`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-modern-purple-vibrant transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
