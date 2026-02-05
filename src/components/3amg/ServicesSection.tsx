import { Cpu, Network, Activity, Server, Workflow, Database, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";

const ServicesSection = () => {
  const services = [
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "Full-Stack Automation",
      description: "Execução autônoma 24/7 de fluxos de rede e faturamento com resiliência e auto-recovery.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Network className="h-6 w-6" />,
      title: "Ecossistema de APIs",
      description: "Conexão nativa com MikroTik, Huawei, ZTE e principais ERPs de billing do mercado.",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Observabilidade Preditiva",
      description: "Dashboards de telemetria em tempo real integrados aos agentes de resposta automática.",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Persistência Multi-Tenant",
      description: "Isolamento total de dados por provedor com criptografia AES-256 e backups automáticos.",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Orquestração n8n",
      description: "Fluxos automatizados via n8n com controle de execução, retry inteligente e fallback.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Segurança Enterprise",
      description: "Auditoria completa, logs estruturados e compliance com LGPD e segurança de dados.",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <section id="solucoes" className="py-24 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712] relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-500 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + Math.random() * 4}s`
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
          <div className="inline-flex items-center gap-2 bg-purple-950/50 backdrop-blur-xl border border-purple-500/30 rounded-full px-5 py-2 mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-purple-200 text-sm font-medium">Capacidades Core</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Infraestrutura de{" "}
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Alta Performance
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stack técnico projetado para operações críticas com 
            orquestração, observabilidade e escala operacional
          </p>
        </motion.div>

        {/* Neon divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(139,92,246,0.6)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="cyber-glass-card group cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
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
