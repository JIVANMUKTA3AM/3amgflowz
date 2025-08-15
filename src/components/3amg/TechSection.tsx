
import { Badge } from "@/components/ui/badge";
import { Database, Network, Zap, Globe, Server, Cpu, Code, Workflow } from "lucide-react";

const TechSection = () => {
  const technologies = [
    { 
      name: "N8N", 
      category: "Automação", 
      icon: Workflow,
      description: "Workflow automation platform",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      name: "Supabase", 
      category: "Backend", 
      icon: Database,
      description: "Real-time database & auth",
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      name: "PostgreSQL", 
      category: "Database", 
      icon: Server,
      description: "Enterprise-grade SQL database",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      name: "REST APIs", 
      category: "Integração", 
      icon: Globe,
      description: "HTTP/HTTPS API protocols",
      gradient: "from-orange-500 to-red-500"
    },
    { 
      name: "SNMP", 
      category: "Redes", 
      icon: Network,
      description: "Network monitoring protocol",
      gradient: "from-indigo-500 to-purple-500"
    },
    { 
      name: "TCP/IP", 
      category: "Protocolos", 
      icon: Zap,
      description: "Internet protocol suite",
      gradient: "from-yellow-500 to-orange-500"
    },
    { 
      name: "OpenAI GPT", 
      category: "IA", 
      icon: Cpu,
      description: "Large language models",
      gradient: "from-teal-500 to-blue-500"
    },
    { 
      name: "TypeScript", 
      category: "Development", 
      icon: Code,
      description: "Type-safe JavaScript",
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
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Infraestrutura moderna com protocolos de rede avançados, automação inteligente e integração nativa
          </p>
          
          {/* Network Status Indicators */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">TCP/IP Layer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-sm text-gray-400">SNMP Protocol</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="text-sm text-gray-400">API Gateway</span>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {categories.map((category) => (
            <div key={category} className="text-center">
              <h3 className="text-2xl font-semibold text-white mb-8 flex items-center justify-center gap-3">
                <div className="w-8 h-px bg-gradient-3amg"></div>
                {category}
                <div className="w-8 h-px bg-gradient-3amg"></div>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {technologies
                  .filter(tech => tech.category === category)
                  .map((tech, index) => {
                    const IconComponent = tech.icon;
                    return (
                      <div
                        key={index}
                        className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-3amg-orange/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-3amg-orange/20"
                      >
                        {/* Background Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                        
                        {/* Icon with Animation */}
                        <div className="relative z-10 mb-4">
                          <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${tech.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300`}>
                            <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
                              <IconComponent className="w-8 h-8 text-white group-hover:text-3amg-orange transition-colors duration-300" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-3amg-orange transition-colors duration-300">
                            {tech.name}
                          </h4>
                          <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                            {tech.description}
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

        {/* Protocol Performance Metrics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
            <div className="text-3xl font-bold text-3amg-orange mb-2">99.9%</div>
            <div className="text-gray-400">Network Uptime</div>
          </div>
          <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
            <div className="text-3xl font-bold text-purple-400 mb-2">&lt;50ms</div>
            <div className="text-gray-400">API Response Time</div>
          </div>
          <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
            <div className="text-3xl font-bold text-blue-400 mb-2">10k+</div>
            <div className="text-gray-400">Concurrent SNMP Queries</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(calc(100vw + 200px)); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default TechSection;
