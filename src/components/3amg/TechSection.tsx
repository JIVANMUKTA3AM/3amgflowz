import { Badge } from "@/components/ui/badge";
import { Database, Network, Zap, Globe, Server, Cpu, Code, Workflow } from "lucide-react";

const TechSection = () => {
  const technologies = [
    { 
      name: "N8N", 
      category: "Automação", 
      icon: Workflow,
      description: "Plataforma de automação low-code para workflows complexos",
      longDescription: "Executado em VPS dedicados com alta capacidade de banda para garantir processamento contínuo de milhares de integrações simultâneas. Conecta diferentes sistemas e APIs automaticamente.",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      name: "Supabase", 
      category: "Backend", 
      icon: Database,
      description: "Backend-as-a-Service com autenticação e APIs em tempo real",
      longDescription: "Infraestrutura robusta com Row Level Security (RLS), autenticação JWT nativa e APIs RESTful automáticas. Escalabilidade horizontal garantida para milhões de requisições.",
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      name: "PostgreSQL", 
      category: "Database", 
      icon: Server,
      description: "Banco de dados empresarial com estrutura segura e criptografada",
      longDescription: "Estrutura de dados enterprise com criptografia end-to-end, backups automáticos diários e replicação multi-região. Compliance LGPD/GDPR nativo com auditoria completa.",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      name: "REST APIs", 
      category: "Integração", 
      icon: Globe,
      description: "Protocolos HTTP/HTTPS para integrações universais",
      longDescription: "Interface padronizada para conectar com qualquer sistema externo. Rate limiting inteligente, autenticação OAuth 2.0 e versionamento automático de endpoints.",
      gradient: "from-orange-500 to-red-500"
    },
    { 
      name: "SNMP", 
      category: "Redes", 
      icon: Network,
      description: "Protocolo para monitoramento de infraestrutura de rede",
      longDescription: "Monitora equipamentos de rede em tempo real com alertas inteligentes. Coleta métricas de performance, status de portas e dados de tráfego automaticamente.",
      gradient: "from-indigo-500 to-purple-500"
    },
    { 
      name: "TCP/IP", 
      category: "Protocolos", 
      icon: Zap,
      description: "Stack completo de protocolos de internet para comunicação",
      longDescription: "Comunicação de baixo nível com equipamentos de rede. Suporte nativo a IPv4/IPv6, roteamento dinâmico e balanceamento de carga distribuído.",
      gradient: "from-yellow-500 to-orange-500"
    },
    { 
      name: "OpenAI GPT", 
      category: "IA", 
      icon: Cpu,
      description: "Modelos de linguagem para automação inteligente",
      longDescription: "Integração nativa com GPT-4 e modelos customizados. Processamento de linguagem natural para automação de respostas e análise de sentimentos em tempo real.",
      gradient: "from-teal-500 to-blue-500"
    },
    { 
      name: "TypeScript", 
      category: "Development", 
      icon: Code,
      description: "Linguagem type-safe para desenvolvimento robusto",
      longDescription: "Código 100% tipado para reduzir bugs em produção. Autocomplete inteligente, refatoração segura e integração nativa com ferramentas de DevOps modernas.",
      gradient: "from-blue-600 to-indigo-600"
    }
  ];

  const categories = [...new Set(technologies.map(tech => tech.category))];

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background Network Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Network Grid */}
          <svg className="w-full h-full" viewBox="0 0 1000 600">
            <defs>
              <pattern id="network-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="#FF6B35" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
                <line x1="50" y1="50" x2="150" y2="50" stroke="#8B5CF6" strokeWidth="1" opacity="0.2" />
                <line x1="50" y1="50" x2="50" y2="150" stroke="#8B5CF6" strokeWidth="1" opacity="0.2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#network-grid)" />
          </svg>
        </div>
        
        {/* Floating Protocol Packets */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-3amg-orange rounded-full animate-float-tech opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* TCP/IP Data Flow Animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="relative w-full h-full overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-3amg-orange to-transparent animate-pulse"
              style={{
                width: '200px',
                top: `${20 + i * 15}%`,
                left: '-200px',
                animation: `slideRight 4s linear infinite ${i * 0.8}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            <span className="bg-gradient-3amg bg-clip-text text-transparent">Stack Tecnológico</span> Enterprise
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Infraestrutura moderna com protocolos de rede avançados, automação inteligente e integração nativa
          </p>
          
          {/* Infrastructure Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Banco de Dados Seguro</h3>
              </div>
              <p className="text-gray-300 text-sm">
                PostgreSQL enterprise com criptografia end-to-end, backups automáticos e compliance LGPD/GDPR nativo. 
                Row Level Security garante isolamento total dos dados por cliente.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Workflow className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">VPS Alta Performance</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Fluxos N8N executados em VPS dedicados com banda ultra-larga. 
                Processamento simultâneo de milhares de workflows com latência &lt;10ms.
              </p>
            </div>
          </div>
          
          {/* Network Status Indicators */}
          <div className="flex justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">TCP/IP Layer Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-sm text-gray-400">SNMP Monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="text-sm text-gray-400">API Gateway Online</span>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {categories.map((category) => (
            <div key={category} className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-12 flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-gradient-3amg"></div>
                {category}
                <div className="w-8 h-px bg-gradient-3amg"></div>
              </h3>
              
              <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto">
                {technologies
                  .filter(tech => tech.category === category)
                  .map((tech, index) => {
                    const IconComponent = tech.icon;
                    return (
                      <div
                        key={index}
                        className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-3amg-orange/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-3amg-orange/20 w-full max-w-md"
                      >
                        {/* Background Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                        
                        {/* Centralized Content Container */}
                        <div className="relative z-10 flex flex-col items-center text-center h-full">
                          {/* Icon */}
                          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${tech.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300 mb-6`}>
                            <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
                              <IconComponent className="w-10 h-10 text-white group-hover:text-3amg-orange transition-colors duration-300" />
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-3amg-orange transition-colors duration-300">
                            {tech.name}
                          </h4>
                          
                          {/* Badge */}
                          <Badge className={`bg-gradient-to-r ${tech.gradient} text-white text-sm mb-6`}>
                            {tech.category}
                          </Badge>
                          
                          {/* Short Description */}
                          <p className="text-gray-400 text-base mb-6 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed">
                            {tech.description}
                          </p>
                          
                          {/* Detailed Description */}
                          <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300 flex-grow">
                            {tech.longDescription}
                          </p>
                        </div>
                        
                        {/* Network Connection Lines */}
                        <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <line x1="50" y1="0" x2="50" y2="100" stroke="#FF6B35" strokeWidth="0.5" strokeDasharray="2,2">
                              <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite" />
                            </line>
                            <line x1="0" y1="50" x2="100" y2="50" stroke="#8B5CF6" strokeWidth="0.5" strokeDasharray="2,2">
                              <animate attributeName="stroke-dashoffset" values="0;4" dur="1.5s" repeatCount="indefinite" />
                            </line>
                          </svg>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Performance & Infraestrutura section remains the same */}
        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Performance & Infraestrutura
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-3amg-orange mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">Database Uptime</div>
              <div className="text-xs text-gray-500 mt-1">SLA Garantido</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-purple-400 mb-2">&lt;10ms</div>
              <div className="text-gray-400 text-sm">VPS Latency</div>
              <div className="text-xs text-gray-500 mt-1">N8N Workflows</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">10k+</div>
              <div className="text-gray-400 text-sm">Concurrent SNMP</div>
              <div className="text-xs text-gray-500 mt-1">Queries/Second</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-green-400 mb-2">256-bit</div>
              <div className="text-gray-400 text-sm">Encryption</div>
              <div className="text-xs text-gray-500 mt-1">End-to-End</div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideRight {
            0% { transform: translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateX(calc(100vw + 200px)); opacity: 0; }
          }
        `
      }} />
    </section>
  );
};

export default TechSection;
