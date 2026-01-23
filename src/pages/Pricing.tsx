import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Check, 
  Crown, 
  Zap, 
  Rocket,
  Users,
  Bot,
  MessageSquare,
  Headphones,
  Shield,
  ArrowRight,
  Sparkles,
  Building2,
  TrendingUp,
  Network,
  Activity,
  Database,
  Cpu,
  Server,
  Clock,
  ChevronDown,
  ChevronUp,
  Phone,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Settings,
  Layers,
  FileText,
  Lock,
  Gauge,
  Wrench,
  CreditCard
} from "lucide-react";
import ModernHeader from "@/components/3amg/ModernHeader";
import Footer from "@/components/Footer";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const discountRate = 0.17;
  const whatsappNumber = "5515997668073";

  const whatsappMessages: Record<string, string> = {
    demo: "Olá! Gostaria de agendar uma demonstração técnica da plataforma 3AMG.",
    starter: "Olá! Tenho interesse no plano Essencial. Gostaria de entender a arquitetura e próximos passos.",
    growth: "Olá! Tenho interesse no plano Operação. Podemos agendar uma call técnica?",
    professional: "Olá! Tenho interesse no plano Escala para minha infraestrutura. Gostaria de uma apresentação técnica.",
    enterprise: "Olá! Preciso de uma solução Enterprise para minha operação. Podemos agendar uma reunião técnica?",
  };

  const getWhatsAppLink = (planId: string) => {
    const message = encodeURIComponent(whatsappMessages[planId] || whatsappMessages.demo);
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  // ============================================
  // SEÇÃO 2: PROBLEMA - Dores reais de provedores
  // ============================================
  const problems = [
    {
      icon: Headphones,
      title: "Operação sem escala",
      description: "Volume de chamados cresce, mas a equipe não acompanha. Processos manuais travam a operação.",
    },
    {
      icon: AlertTriangle,
      title: "Falta de padronização",
      description: "Execução inconsistente. Sem fluxos definidos, sem automação, sem resiliência.",
    },
    {
      icon: DollarSign,
      title: "Custo operacional crescente",
      description: "Escalar significa contratar. Infraestrutura de atendimento não acompanha o crescimento.",
    },
    {
      icon: BarChart3,
      title: "Baixa observabilidade",
      description: "Sem telemetria, logs estruturados ou métricas em tempo real para tomada de decisão.",
    },
    {
      icon: Clock,
      title: "Latência em processos críticos",
      description: "Diagnósticos demorados, integrações frágeis e tempo de resposta fora do SLA.",
    },
  ];

  // ============================================
  // SEÇÃO 3: SOLUÇÃO 3AMG
  // ============================================
  const solutions = [
    {
      icon: Bot,
      title: "Agentes autônomos 24/7",
      description: "Execução contínua de processos com auto-recovery e resiliência operacional.",
    },
    {
      icon: MessageSquare,
      title: "Interface via WhatsApp",
      description: "Camada de interação conectada à infraestrutura de agentes.",
    },
    {
      icon: Settings,
      title: "Integrações nativas",
      description: "SNMP, TR-069, APIs REST e webhooks com SGPs do mercado.",
    },
    {
      icon: Zap,
      title: "Orquestração de processos",
      description: "Fluxos automatizados via n8n com controle de execução e fallback.",
    },
    {
      icon: BarChart3,
      title: "Observabilidade total",
      description: "Telemetria, logs estruturados e métricas em tempo real.",
    },
  ];

  // ============================================
  // SEÇÃO 4: OS AGENTES
  // ============================================
  const agents = [
    {
      icon: Wrench,
      name: "Agente Técnico",
      tagline: "Automação de diagnóstico e suporte",
      capabilities: [
        "Diagnóstico via SNMP/TR-069",
        "Reset remoto de ONT/ONU",
        "Verificação de status de link",
        "Escalonamento inteligente para NOC",
        "Logs e histórico de execução",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: TrendingUp,
      name: "Agente Comercial",
      tagline: "Automação de processos comerciais",
      capabilities: [
        "Cotação automatizada de planos",
        "Fluxos de upsell e cross-sell",
        "Negociação de débitos",
        "Campanhas de retenção",
        "Qualificação automatizada",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: CreditCard,
      name: "Agente Financeiro",
      tagline: "Automação de billing e cobrança",
      capabilities: [
        "Envio automatizado de boletos",
        "Negociação de inadimplência",
        "Consulta de faturas e pagamentos",
        "Emissão de NF-e automatizada",
        "Integração com gateways de pagamento",
      ],
      color: "from-green-500 to-emerald-500",
    },
  ];

  // ============================================
  // SEÇÃO 5: PLATAFORMA E TECNOLOGIA
  // ============================================
  const techFeatures = [
    {
      icon: Layers,
      title: "Arquitetura multi-tenant",
      description: "Isolamento de dados por provedor com criptografia e performance garantida.",
    },
    {
      icon: Settings,
      title: "Orquestração via n8n",
      description: "Workflows visuais com controle de execução, retry e fallback configuráveis.",
    },
    {
      icon: Network,
      title: "Protocolos nativos",
      description: "SNMP, TR-069, APIs REST e webhooks com os principais SGPs do mercado.",
    },
    {
      icon: FileText,
      title: "Logs e auditoria",
      description: "Rastreabilidade completa de execuções e conversas com retenção configurável.",
    },
    {
      icon: Lock,
      title: "Segurança enterprise",
      description: "Criptografia em trânsito e repouso, backups automáticos e conformidade LGPD.",
    },
    {
      icon: Server,
      title: "Escalabilidade horizontal",
      description: "Infraestrutura elástica que escala com a operação sem gargalos.",
    },
  ];

  // ============================================
  // SEÇÃO 6: RELATÓRIOS E INTELIGÊNCIA
  // ============================================
  const reportFeatures = [
    {
      icon: Gauge,
      title: "Dashboards operacionais",
      description: "Visão em tempo real de execuções, agentes e processos.",
    },
    {
      icon: BarChart3,
      title: "Telemetria de processos",
      description: "Latência, throughput, taxa de sucesso e erros por agente.",
    },
    {
      icon: DollarSign,
      title: "Billing e consumo",
      description: "Controle de custos por agente, por provedor e por período.",
    },
    {
      icon: Activity,
      title: "Performance comparativa",
      description: "Métricas de eficiência entre agentes e tipos de execução.",
    },
  ];

  // ============================================
  // SEÇÃO 7: MODELO DE PREÇO
  // ============================================
  const plans = [
    {
      id: "starter",
      name: "Essencial",
      description: "Para provedores começando a automatizar",
      icon: Zap,
      iconBg: "bg-gradient-to-br from-slate-500 to-slate-700",
      monthlyPrice: 497,
      baseDescription: "Base mensal fixa",
      usage: "+ R$ 0,15 por interação",
      maxClients: "500",
      features: [
        "3 Agentes ativos",
        "10.000 interações/mês inclusas",
        "Integrações básicas",
        "Suporte por email",
        "Relatórios padrão",
      ],
      popular: false,
    },
    {
      id: "growth",
      name: "Operação",
      description: "Para provedores em crescimento",
      icon: TrendingUp,
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
      monthlyPrice: 997,
      baseDescription: "Base mensal fixa",
      usage: "+ R$ 0,12 por interação",
      maxClients: "2.000",
      features: [
        "Agentes ilimitados",
        "30.000 interações/mês inclusas",
        "Todas as integrações",
        "Suporte prioritário",
        "Dashboards avançados",
        "Automações customizadas",
      ],
      popular: true,
    },
    {
      id: "professional",
      name: "Escala",
      description: "Para operações de alta performance",
      icon: Crown,
      iconBg: "bg-gradient-to-br from-violet-600 to-purple-800",
      monthlyPrice: 1997,
      baseDescription: "Base mensal fixa",
      usage: "+ R$ 0,08 por interação",
      maxClients: "10.000",
      features: [
        "Agentes ilimitados",
        "100.000 interações/mês inclusas",
        "Infraestrutura dedicada",
        "Suporte 24/7",
        "SLA 99.9%",
        "API completa",
        "Onboarding dedicado",
      ],
      popular: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Para grandes operações",
      icon: Building2,
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      monthlyPrice: null,
      customPrice: "Sob consulta",
      maxClients: "Ilimitado",
      features: [
        "Tudo do Escala",
        "Infraestrutura exclusiva",
        "SLA customizado",
        "Account Manager dedicado",
        "Integrações sob demanda",
        "Contrato personalizado",
      ],
      popular: false,
    },
  ];

  // ============================================
  // SEÇÃO 8: PROVA DE VALOR
  // ============================================
  const proofPoints = [
    {
      title: "Engenharia especializada",
      description: "Time com background em telecomunicações, infraestrutura distribuída e automação de sistemas.",
    },
    {
      title: "Arquitetura resiliente",
      description: "Stack moderna com Supabase, Edge Functions, n8n e integrações nativas com SGPs do mercado.",
    },
    {
      title: "Foco em operação real",
      description: "Desenvolvido com base em demandas reais de provedores, não em suposições de mercado.",
    },
  ];

  const stats = [
    { value: "70%", label: "Redução em tempo de execução" },
    { value: "24/7", label: "Operação contínua" },
    { value: "< 2h", label: "Setup técnico" },
    { value: "99.9%", label: "Uptime da plataforma" },
  ];

  // ============================================
  // FAQs
  // ============================================
  const faqs = [
    {
      question: "Como funciona o modelo base + consumo?",
      answer: "Mensalidade fixa com interações inclusas. Acima disso, paga por interação adicional. Previsibilidade e escala sem surpresas.",
    },
    {
      question: "O que conta como uma interação?",
      answer: "Uma troca de mensagem entre o agente e o endpoint. Uma conversa com 10 mensagens = 10 interações. Telemetria em tempo real no painel.",
    },
    {
      question: "Posso começar pequeno e escalar depois?",
      answer: "Sim. Migração entre planos é imediata e sem downtime. A infraestrutura se adapta à sua operação.",
    },
    {
      question: "Quais sistemas vocês integram?",
      answer: "SGPs (IXC, MK-Auth, Hubsoft, Voalle), gateways de pagamento, NF-e, equipamentos via SNMP/TR-069. Novas integrações sob demanda.",
    },
    {
      question: "Quanto tempo leva para começar a operar?",
      answer: "Setup técnico em média 2 horas. Inclui configuração de agentes, integração com WhatsApp e conexão com SGP.",
    },
    {
      question: "Existe período de teste?",
      answer: "Oferecemos demonstração técnica guiada com dados simulados da sua operação. Fale com nossa engenharia para agendar.",
    },
    {
      question: "Como funciona o suporte?",
      answer: "Email no Essencial, prioritário no Operação, 24/7 no Escala e Enterprise. Documentação técnica completa em todos os planos.",
    },
    {
      question: "Como é a segurança dos dados?",
      answer: "Criptografia em trânsito e repouso, backups automáticos, isolamento multi-tenant e conformidade LGPD. Cada provedor vê apenas seus dados.",
    },
  ];

  const calculatePrice = (monthlyPrice: number | null) => {
    if (monthlyPrice === null) return null;
    if (isAnnual) {
      return Math.round(monthlyPrice * (1 - discountRate));
    }
    return monthlyPrice;
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return null;
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B3E] via-[#1A1F3A] to-[#0D1B3E]">
      <ModernHeader />
      
      {/* ============================================ */}
      {/* SEÇÃO 1: HERO */}
      {/* ============================================ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[150px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
              <Bot className="w-4 h-4 mr-2" />
              Infraestrutura de Agentes Autônomos
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Orquestração de Agentes{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                para Operação de ISPs
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              Plataforma de agentes conectados via WhatsApp com execução autônoma 
              de processos técnicos, comerciais e financeiros — 
              telemetria, billing e observabilidade integrados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-purple-500/30"
                asChild
              >
                <a href={getWhatsAppLink("demo")} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Solicitar Demo Técnica
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-gray-500 text-white hover:bg-gray-800 hover:border-gray-400 text-lg px-8 py-6 rounded-xl"
                onClick={() => document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Ver Arquitetura
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 2: PROBLEMA */}
      {/* ============================================ */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-red-500/20 text-red-300 border-red-500/30">
              O problema
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sua infraestrutura está travada?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Operações enfrentam os mesmos gargalos todos os dias. 
              Reconhece algum deles?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-800/30 border-gray-700/50 backdrop-blur-sm p-6 hover:border-red-500/30 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <problem.icon className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">{problem.title}</h3>
                      <p className="text-gray-400 text-sm">{problem.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 3: SOLUÇÃO 3AMG */}
      {/* ============================================ */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30">
              A solução
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Automação operacional em tempo real
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Agentes autônomos que executam processos, não apenas respondem mensagens.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-800/30 border-gray-700/50 backdrop-blur-sm p-6 hover:border-green-500/30 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <solution.icon className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">{solution.title}</h3>
                      <p className="text-gray-400 text-sm">{solution.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 4: OS AGENTES */}
      {/* ============================================ */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Os agentes
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Três agentes. Toda a operação automatizada.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Cada agente é especializado em uma camada crítica da operação.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {agents.map((agent, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="h-full bg-gray-800/40 border-gray-700/50 backdrop-blur-sm overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${agent.color}`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center`}>
                        <agent.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                        <p className="text-gray-400 text-sm">{agent.tagline}</p>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {agent.capabilities.map((capability, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 5: PLATAFORMA E TECNOLOGIA */}
      {/* ============================================ */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
              Tecnologia
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Infraestrutura enterprise. Setup em horas.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Arquitetura moderna, segura e escalável para operações de qualquer tamanho.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {techFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full bg-gray-800/30 border-gray-700/50 backdrop-blur-sm p-5 hover:border-blue-500/30 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 6: RELATÓRIOS E INTELIGÊNCIA */}
      {/* ============================================ */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30">
              Inteligência
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Dados que viram decisão
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Visibilidade completa da operação em tempo real.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reportFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-800/30 border-gray-700/50 backdrop-blur-sm p-6 hover:border-amber-500/30 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 7: MODELO DE PREÇO */}
      {/* ============================================ */}
      <section id="pricing-section" className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
              Preços
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Base mensal + consumo. Simples assim.
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              Pague uma base fixa e adicional apenas pelo que usar. 
              Sem surpresas, sem pegadinhas, sem lock-in.
            </p>

            {/* Toggle Annual/Monthly */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-lg ${!isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
                Mensal
              </span>
              <Switch 
                checked={isAnnual} 
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className={`text-lg ${isAnnual ? 'text-white font-semibold' : 'text-gray-400'}`}>
                Anual
              </span>
              {isAnnual && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  Economize 17%
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const price = calculatePrice(plan.monthlyPrice);
              const Icon = plan.icon;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative rounded-3xl p-[2px] ${
                    plan.popular 
                      ? 'bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500' 
                      : 'bg-gradient-to-b from-gray-700/50 to-gray-800/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-4 py-1.5 text-sm font-semibold shadow-lg">
                        <Crown className="w-4 h-4 mr-1" />
                        Recomendado
                      </Badge>
                    </div>
                  )}
                  
                  <div className="bg-[#0D1B3E]/95 backdrop-blur-xl rounded-[22px] p-6 h-full flex flex-col">
                    <div className="mb-4">
                      <div className={`${plan.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>

                    <div className="mb-5">
                      {price !== null ? (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-sm text-gray-400">R$</span>
                            <span className="text-4xl font-bold text-white">
                              {formatPrice(price)}
                            </span>
                            <span className="text-gray-400">/mês</span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">{plan.baseDescription}</p>
                          <p className="text-purple-400 text-sm font-medium mt-1">{plan.usage}</p>
                          {isAnnual && plan.monthlyPrice && (
                            <p className="text-green-400 text-xs mt-2">
                              <span className="line-through text-gray-500">R$ {formatPrice(plan.monthlyPrice)}</span>
                              {" "}• Faturado anualmente
                            </p>
                          )}
                        </>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-white">{plan.customPrice}</span>
                          <p className="text-gray-400 text-sm mt-1">Fale com nossa equipe</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full py-6 text-base font-semibold rounded-xl transition-all duration-300 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30' 
                          : plan.monthlyPrice === null
                          ? 'bg-transparent border-2 border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-400'
                          : 'bg-gray-700/50 hover:bg-gray-700 text-white border border-gray-600/50'
                      }`}
                      asChild
                    >
                      <a 
                        href={getWhatsAppLink(plan.id)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {plan.monthlyPrice === null ? (
                          <>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Falar com Engenharia
                          </>
                        ) : (
                          <>
                            Iniciar Setup
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </a>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 8: PROVA DE VALOR */}
      {/* ============================================ */}
      <section className="py-20 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              Por que 3AMG
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Construído por quem entende operação de ISP
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {proofPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-800/30 border-gray-700/50 backdrop-blur-sm p-6 text-center">
                  <h3 className="font-semibold text-white mb-2">{point.title}</h3>
                  <p className="text-gray-400 text-sm">{point.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ */}
      {/* ============================================ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-400">
              Dúvidas sobre a plataforma, preços e implementação
            </p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`cursor-pointer transition-all bg-gray-800/30 border-gray-700/50 backdrop-blur-sm ${
                    openFaq === index ? "border-purple-500/50" : "hover:border-purple-500/30"
                  }`}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold pr-4 text-white text-sm md:text-base">{faq.question}</h3>
                      {openFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    {openFaq === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-gray-400 mt-4 pt-4 border-t border-gray-700/50 text-sm"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEÇÃO 9: CTA FINAL */}
      {/* ============================================ */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-3xl p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Rocket className="w-14 h-14 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para escalar sua operação?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Agende uma demonstração técnica e veja os agentes em execução. 
              Setup em menos de 2 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-purple-500/30"
                asChild
              >
                <a href={getWhatsAppLink("demo")} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Solicitar Demo Técnica
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 text-lg px-8 py-6 rounded-xl"
                asChild
              >
                <a href={getWhatsAppLink("demo")} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Falar com Engenharia
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
