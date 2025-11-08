import { Bot, Workflow, Smartphone, Database, Code, Zap } from "lucide-react";
import { motion } from "framer-motion";

const ServicesSection = () => {
  const services = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Agentes de IA Especializados",
      description: "Agentes inteligentes para atendimento, suporte técnico e vendas, personalizados para seu negócio.",
      color: "pink"
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Automação de Processos",
      description: "Fluxos automatizados que eliminam tarefas repetitivas e aumentam a eficiência operacional.",
      color: "purple"
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Integrações Multi-Canal",
      description: "WhatsApp, Telegram, sites e CRMs integrados em uma única plataforma unificada.",
      color: "blue"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Gestão de Dados",
      description: "Centralização e análise inteligente de dados para tomada de decisões estratégicas.",
      color: "turquoise"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Desenvolvimento Custom",
      description: "Soluções personalizadas desenvolvidas especificamente para suas necessidades únicas.",
      color: "pink"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "N8N & Webhooks",
      description: "Integrações avançadas usando N8N e webhooks para conectar qualquer sistema.",
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
            Nossas <span className="text-modern-purple-vibrant">Soluções</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tecnologias de ponta para automatizar, integrar e revolucionar seu negócio
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
