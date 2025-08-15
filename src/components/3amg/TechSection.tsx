
import { Badge } from "@/components/ui/badge";
import { Database, Network, Zap, Globe, Server, Cpu, Code, Workflow } from "lucide-react";

const TechSection = () => {
  const technologies = [
    { 
      name: "N8N", 
      category: "Automação", 
      icon: Workflow,
      description: "Plataforma de automação low-code para workflows complexos e integração empresarial",
      longDescription: "Nossa implementação N8N opera em VPS dedicados de alta performance com capacidade de banda ultra-larga, garantindo processamento contínuo e simultâneo de milhares de integrações complexas. A plataforma conecta automaticamente diferentes sistemas, APIs nativas e protocolos SNMP, eliminando tarefas manuais repetitivas e otimizando processos operacionais. Integração nativa com equipamentos Huawei (MA5608T, MA5683T, MA5800 Series), ZTE (C320, C300, C600 Series), Fiberhome (AN5516 Series), Parks (OLT 4800/8800), Datacom (DM4100/4600) e VSOL (V1600/V2408/V2724 Series). Interface visual intuitiva permite criar fluxos de trabalho sofisticados sem necessidade de programação avançada, reduzindo tempo de implementação em até 80% comparado a soluções tradicionais.",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      name: "Supabase", 
      category: "Backend", 
      icon: Database,
      description: "Backend-as-a-Service completo com autenticação avançada e APIs em tempo real",
      longDescription: "Infraestrutura backend robusta e escalável com Row Level Security (RLS) nativo, proporcionando isolamento completo de dados por cliente e organização. Sistema de autenticação JWT integrado com suporte a múltiplos provedores (Google, GitHub, Azure AD), APIs RESTful geradas automaticamente e subscriptions em tempo real via WebSockets. Gerenciamento centralizado de configurações para todas as marcas de OLT suportadas, incluindo credenciais SNMP, endpoints HTTP personalizados e mapeamento automático de protocolos por modelo de equipamento. Escalabilidade horizontal automática garante performance consistente mesmo com milhões de requisições simultâneas, enquanto o sistema de cache inteligente reduz latência para menos de 50ms globalmente.",
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      name: "PostgreSQL", 
      category: "Database", 
      icon: Server,
      description: "Sistema de banco de dados empresarial com segurança militar e criptografia avançada",
      longDescription: "Implementação PostgreSQL enterprise com arquitetura de segurança multi-camadas, incluindo criptografia end-to-end AES-256, backups automáticos incrementais a cada 6 horas e replicação assíncrona multi-região para garantir disponibilidade 99.99%. Compliance nativo com LGPD, GDPR e SOC 2, com sistema de auditoria completa que rastreia todas as operações de dados. Estrutura otimizada para armazenamento de dados SNMP provenientes de equipamentos Huawei, ZTE, Fiberhome, Parks, Datacom, VSOL e Ubiquiti, com tabelas dedicadas para métricas de performance, status de ONTs, utilização de portas PON e histórico de eventos. Otimizações avançadas incluem particionamento automático de tabelas por marca/modelo, índices compostos inteligentes e query optimization que melhora performance em até 300% comparado a implementações padrão.",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      name: "REST APIs", 
      category: "Integração", 
      icon: Globe,
      description: "Arquitetura de APIs RESTful com protocolos HTTP/HTTPS para integrações universais",
      longDescription: "Interface de programação padronizada seguindo especificações OpenAPI 3.0, permitindo integração seamless com qualquer sistema externo ou legado. Suporte nativo a APIs proprietárias de fabricantes modernos: Huawei iManager U2000/NetEco, ZTE ZSmart/ZXOSS, Fiberhome FHM9000, Parks Web Management System e Datacom DmView. Para equipamentos legacy ou sem API nativa (VSOL V1600/V2408 Series, modelos antigos ZTE C220, Fiberhome AN5506), implementamos protocolo SNMP com operações GET para consulta de valores específicos e WALK para descoberta completa de árvore MIB. Implementação de rate limiting inteligente com algoritmos de bucket token, autenticação OAuth 2.0/JWT com refresh tokens automáticos e versionamento semântico de endpoints para garantir compatibilidade retroativa. Sistema de fallback automático HTTP-to-SNMP quando APIs nativas não estão disponíveis, com retry automático e backoff exponencial.",
      gradient: "from-orange-500 to-red-500"
    },
    { 
      name: "SNMP", 
      category: "Redes", 
      icon: Network,
      description: "Protocolo avançado para monitoramento e gerenciamento de infraestrutura de rede",
      longDescription: "Implementação SNMP v3 com criptografia e autenticação para monitoramento seguro de equipamentos de rede em tempo real. Suporte completo a todas as marcas: Huawei (community strings personalizadas, OIDs específicos para MA5608T/MA5683T/MA5800 Series), ZTE (MIBs proprietárias C320/C300/C600, gestão avançada de VLANs), Fiberhome (AN5516 Series com OIDs customizados para gestão de ONTs), VSOL (V1600D/G, V2408G/A, V2724G, V3216G com MIBs específicas), Parks (OLT 1600/4800/8800 via SNMP quando HTTP não disponível), Datacom (DM991/DM4000 via SNMP legacy) e Ubiquiti (UF-INSTANT/NANO-G/LOCO com UniFi MIBs). Operações GET para consulta de valores específicos (status ONT, utilização portas, temperaturas), WALK para descoberta completa de interfaces e topologia de rede. Sistema de alertas inteligentes com machine learning para detecção proativa de anomalias, descoberta automática de dispositivos e geração de relatórios detalhados de performance com integração NOC.",
      gradient: "from-indigo-500 to-purple-500"
    },
    { 
      name: "TCP/IP", 
      category: "Protocolos", 
      icon: Zap,
      description: "Stack completo de protocolos de internet com otimizações para alta performance",
      longDescription: "Implementação otimizada do stack TCP/IP com suporte completo a IPv4 e IPv6, incluindo roteamento dinâmico com protocolos BGP e OSPF para redundância automática. Comunicação nativa com equipamentos de todas as marcas suportadas via múltiplos protocolos: HTTP/HTTPS para APIs modernas (Huawei iManager, ZTE ZSmart, Fiberhome FHM9000, Parks Web Management, Datacom DmView), SNMP sobre UDP para equipamentos legacy e descoberta de rede, Telnet/SSH para configuração avançada quando necessário. Balanceamento de carga distribuído com algoritmos round-robin, least connections e weighted fair queuing para otimização de throughput entre múltiplas OLTs. Quality of Service (QoS) configurável para priorização de tráfego crítico de monitoramento, implementação de VPN site-to-site com túneis IPSec para acesso seguro a equipamentos remotos e suporte a VLAN tagging para segmentação de rede por cliente/provedor. Monitoramento contínuo de latência, jitter e packet loss com alertas automáticos para degradação de performance.",
      gradient: "from-yellow-500 to-orange-500"
    },
    { 
      name: "OpenAI GPT", 
      category: "IA", 
      icon: Cpu,
      description: "Integração avançada com modelos de linguagem para automação inteligente e análise preditiva",
      longDescription: "Integração nativa com GPT-4 Turbo e modelos customizados fine-tuned especificamente para o setor de telecomunicações e equipamentos GPON/EPON. Base de conhecimento especializada inclui documentação técnica completa de todas as marcas suportadas: manuais Huawei MA5608T/MA5683T/MA5800, guias ZTE C320/C300/C600, documentação Fiberhome AN5516 Series, especificações Parks OLT 4800/8800, manuais Datacom DM4100/4600 e VSOL V-Series. Processamento de linguagem natural para automação de respostas em atendimento técnico, análise de sentimentos em interações de suporte e geração automática de relatórios técnicos baseados em dados SNMP/API coletados. Sistema de embeddings vetoriais para busca semântica em documentação técnica, troubleshooting automático baseado em sintomas reportados e sugestões inteligentes de configuração por marca/modelo. Implementação RAG (Retrieval-Augmented Generation) para respostas contextualizadas baseadas em histórico específico de cada equipamento, com monitoramento de custos por token e otimização automática de prompts para máxima eficiência.",
      gradient: "from-teal-500 to-blue-500"
    },
    { 
      name: "TypeScript", 
      category: "Development", 
      icon: Code,
      description: "Linguagem de programação type-safe para desenvolvimento robusto e escalável",
      longDescription: "Desenvolvimento 100% em TypeScript com tipagem estática rigorosa para eliminação de bugs em tempo de compilação, reduzindo falhas em produção em até 90%. Interfaces específicas para cada marca de equipamento: tipos Huawei para MA5608T/MA5683T/MA5800 com OIDs e estruturas de dados específicas, tipos ZTE para C320/C300/C600 com schemas de API proprietários, tipos Fiberhome para AN5516 Series com mapeamento de portas PON, tipos Parks para OLT 4800/8800 com endpoints HTTP específicos, tipos Datacom para DM4100/4600 com protocolos híbridos, tipos VSOL para V-Series com MIBs customizadas e tipos Ubiquiti para equipamentos UniFi com APIs específicas. Configuração avançada com ESLint, Prettier e Husky para garantia de qualidade de código, integração contínua com GitHub Actions e deploy automatizado com rollback instantâneo. Arquitetura modular baseada em Domain-Driven Design (DDD) com separação clara de responsabilidades por marca/protocolo, testes unitários e de integração com cobertura superior a 95% incluindo simulações de equipamentos reais. Autocomplete inteligente para OIDs SNMP, refatoração segura de configurações de equipamentos e debugging avançado aumentam produtividade da equipe de desenvolvimento em 60%.",
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
            Infraestrutura moderna com protocolos de rede avançados, automação inteligente e integração nativa com equipamentos Huawei, ZTE, Fiberhome, Parks, Datacom, VSOL e Ubiquiti
          </p>
          
          {/* Infrastructure Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Database className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">APIs Nativas + SNMP</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Integração via APIs REST (Huawei iManager, ZTE ZSmart, Fiberhome FHM9000, Parks Web Management) 
                e protocolo SNMP com métodos GET/WALK para equipamentos legacy VSOL, modelos antigos ZTE e Fiberhome.
              </p>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Workflow className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Suporte Multi-Marca</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Cobertura completa: Huawei MA5608T/MA5683T/MA5800, ZTE C320/C300/C600, Fiberhome AN5516, 
                Parks OLT 4800/8800, Datacom DM4100/4600, VSOL V-Series e Ubiquiti UniFi.
              </p>
            </div>
          </div>
          
          {/* Network Status Indicators */}
          <div className="flex justify-center items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">APIs + SNMP Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-sm text-gray-400">Multi-Brand Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="text-sm text-gray-400">GET/WALK Methods</span>
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
              
              <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
                {technologies
                  .filter(tech => tech.category === category)
                  .map((tech, index) => {
                    const IconComponent = tech.icon;
                    return (
                      <div
                        key={index}
                        className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-10 hover:border-3amg-orange/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-3amg-orange/20 w-full max-w-2xl"
                      >
                        {/* Background Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                        
                        {/* Centralized Content Container */}
                        <div className="relative z-10 flex flex-col items-center text-center h-full">
                          {/* Icon */}
                          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${tech.gradient} p-0.5 group-hover:scale-110 transition-transform duration-300 mb-8`}>
                            <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
                              <IconComponent className="w-12 h-12 text-white group-hover:text-3amg-orange transition-colors duration-300" />
                            </div>
                          </div>
                          
                          {/* Title */}
                          <h4 className="text-3xl font-bold text-white mb-6 group-hover:text-3amg-orange transition-colors duration-300">
                            {tech.name}
                          </h4>
                          
                          {/* Badge */}
                          <Badge className={`bg-gradient-to-r ${tech.gradient} text-white text-base mb-8 px-4 py-2`}>
                            {tech.category}
                          </Badge>
                          
                          {/* Short Description */}
                          <p className="text-gray-400 text-lg mb-8 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed font-medium">
                            {tech.description}
                          </p>
                          
                          {/* Detailed Description */}
                          <p className="text-gray-300 text-base leading-relaxed group-hover:text-gray-200 transition-colors duration-300 flex-grow text-justify">
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

        <div className="mt-20">
          <h3 className="text-2xl font-semibold text-white text-center mb-8">
            Performance & Compatibilidade Multi-Marca
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-3amg-orange mb-2">7</div>
              <div className="text-gray-400 text-sm">Marcas Suportadas</div>
              <div className="text-xs text-gray-500 mt-1">APIs + SNMP</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-gray-400 text-sm">Modelos OLT</div>
              <div className="text-xs text-gray-500 mt-1">GET/WALK Methods</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-blue-400 mb-2">10k+</div>
              <div className="text-gray-400 text-sm">SNMP Queries/sec</div>
              <div className="text-xs text-gray-500 mt-1">Multi-Protocol</div>
            </div>
            <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/30">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-400 text-sm">Uptime SLA</div>
              <div className="text-xs text-gray-500 mt-1">All Brands</div>
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
