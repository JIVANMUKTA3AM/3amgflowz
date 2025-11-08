import { Database, Network, Zap, Globe, Server, Cpu, Code, Workflow } from "lucide-react";
import { motion } from "framer-motion";

const TechSection = () => {
  const technologies = [
    { 
      name: "N8N", 
      icon: Workflow,
      description: "Automação low-code para workflows complexos e integração empresarial",
      color: "purple"
    },
    { 
      name: "Supabase", 
      icon: Database,
      description: "Backend-as-a-Service com autenticação avançada e APIs em tempo real",
      color: "turquoise"
    },
    { 
      name: "PostgreSQL", 
      icon: Server,
      description: "Banco de dados enterprise com segurança militar e criptografia avançada",
      color: "blue"
    },
    { 
      name: "REST APIs", 
      icon: Globe,
      description: "Arquitetura RESTful com protocolos HTTP/HTTPS para integrações universais",
      color: "pink"
    },
    { 
      name: "SNMP", 
      icon: Network,
      description: "Protocolo avançado para monitoramento de infraestrutura de rede",
      color: "purple"
    },
    { 
      name: "TCP/IP", 
      icon: Zap,
      description: "Stack completo de protocolos de internet otimizado para alta performance",
      color: "turquoise"
    },
    { 
      name: "OpenAI GPT", 
      icon: Cpu,
      description: "Modelos de linguagem para automação inteligente e análise preditiva",
      color: "pink"
    },
    { 
      name: "TypeScript", 
      icon: Code,
      description: "Linguagem type-safe para desenvolvimento robusto e escalável",
      color: "blue"
    }
  ];

  return (
    <section id="tecnologia" className="py-24 bg-modern-blue-deep relative overflow-hidden">
      {/* Animated network lines */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-modern-purple-vibrant to-transparent"
            style={{
              width: '300px',
              top: `${20 + i * 15}%`,
              left: '-300px',
              animation: `slideRight 5s linear infinite ${i * 1}s`
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
            <span className="text-modern-purple-vibrant">Stack Tecnológico</span> Enterprise
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Infraestrutura moderna com protocolos avançados, automação inteligente e integração nativa
          </p>
        </motion.div>

        {/* Neon divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-modern-pink to-transparent shadow-[0_0_10px_rgba(255,71,179,0.6)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="modern-card group cursor-pointer text-center"
              >
                <div className={`icon-box-${tech.color} mx-auto mb-6`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-modern-purple-vibrant transition-colors">
                  {tech.name}
                </h4>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {tech.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Status indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-8 mt-16"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-modern-turquoise rounded-full animate-pulse shadow-[0_0_10px_rgba(64,224,208,0.8)]"></div>
            <span className="text-sm text-gray-400">APIs Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-modern-purple-vibrant rounded-full animate-pulse shadow-[0_0_10px_rgba(155,92,255,0.8)]" style={{animationDelay: '0.5s'}}></div>
            <span className="text-sm text-gray-400">Multi-Brand Support</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-modern-pink rounded-full animate-pulse shadow-[0_0_10px_rgba(255,71,179,0.8)]" style={{animationDelay: '1s'}}></div>
            <span className="text-sm text-gray-400">24/7 Monitoring</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechSection;
