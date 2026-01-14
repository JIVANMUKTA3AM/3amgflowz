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
  Phone
} from "lucide-react";
import ModernHeader from "@/components/3amg/ModernHeader";
import Footer from "@/components/Footer";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const discountRate = 0.17; // 17% de desconto no anual

  const whatsappNumber = "5511999999999"; // TODO: Substituir pelo número real da 3AMG

  const whatsappMessages: Record<string, string> = {
    starter: "Olá! Vim pelo site da 3AMG e tenho interesse no plano Starter Pro para meu provedor. Gostaria de mais informações.",
    growth: "Olá! Vim pelo site da 3AMG e tenho interesse no plano Growth ISP para meu provedor. Quero entender valores, onboarding e próximos passos.",
    professional: "Olá! Vim pelo site da 3AMG e tenho interesse no plano Professional ISP para minha operação. Gostaria de uma apresentação mais detalhada.",
    enterprise: "Olá! Vim pelo site da 3AMG e gostaria de falar com um especialista sobre o plano Enterprise para minha empresa.",
  };

  const getWhatsAppLink = (planId: string) => {
    const message = encodeURIComponent(whatsappMessages[planId] || "");
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const plans = [
    {
      id: "starter",
      name: "Starter Pro",
      description: "Ideal para provedores em crescimento",
      icon: Zap,
      iconBg: "bg-gradient-to-br from-slate-500 to-slate-700",
      monthlyPrice: 499,
      maxClients: "500",
      interactions: "10.000/mês",
      storage: "5 GB",
      infrastructure: "Compartilhada",
      sla: "99.5%",
      support: "Email + Chat",
      responseTime: "24h",
      popular: false,
    },
    {
      id: "growth",
      name: "Growth ISP",
      description: "O plano mais escolhido pelos provedores",
      icon: TrendingUp,
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
      monthlyPrice: 1190,
      maxClients: "2.000",
      interactions: "50.000/mês",
      storage: "25 GB",
      infrastructure: "Dedicada",
      sla: "99.9%",
      support: "Email + Chat + Telefone",
      responseTime: "4h",
      popular: true,
    },
    {
      id: "professional",
      name: "Professional ISP",
      description: "Para operações de alta escala",
      icon: Crown,
      iconBg: "bg-gradient-to-br from-violet-600 to-purple-800",
      monthlyPrice: 2490,
      maxClients: "10.000",
      interactions: "200.000/mês",
      storage: "100 GB",
      infrastructure: "Dedicada Premium",
      sla: "99.95%",
      support: "Suporte Prioritário 24/7",
      responseTime: "1h",
      popular: false,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Soluções customizadas para grandes operações",
      icon: Building2,
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      monthlyPrice: null,
      customPrice: "A partir de R$4.000",
      maxClients: "Ilimitado",
      interactions: "Ilimitadas",
      storage: "Ilimitado",
      infrastructure: "Infraestrutura Exclusiva",
      sla: "99.99%",
      support: "Account Manager Dedicado",
      responseTime: "30min",
      popular: false,
    },
  ];

  const allAgents = [
    { name: "Agente Técnico", icon: Network, description: "Diagnóstico e suporte técnico automatizado" },
    { name: "Agente de Atendimento", icon: Headphones, description: "SAC inteligente 24/7" },
    { name: "Agente NOC", icon: Activity, description: "Monitoramento proativo de rede" },
    { name: "Agente Comercial", icon: TrendingUp, description: "Vendas e retenção automatizadas" },
    { name: "Agentes Customizáveis", icon: Bot, description: "Crie agentes para suas necessidades" },
  ];

  const pricingFactors = [
    {
      icon: Database,
      title: "Banco de Dados",
      description: "Armazenamento de conversas, logs e dados operacionais do seu provedor.",
    },
    {
      icon: Cpu,
      title: "Processamento IA",
      description: "Poder computacional para análise em tempo real e respostas inteligentes.",
    },
    {
      icon: Zap,
      title: "Automações",
      description: "Execuções de workflows, integrações com SGP e ações automatizadas.",
    },
    {
      icon: Server,
      title: "Tráfego de API",
      description: "Chamadas de API para integrações, webhooks e comunicação entre sistemas.",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Automação Operacional",
      description: "Reduza até 70% do tempo gasto em tarefas repetitivas com agentes inteligentes trabalhando 24/7.",
    },
    {
      icon: TrendingUp,
      title: "Redução de Custos",
      description: "Economia média de R$15.000/mês em operação para provedores com +1.000 clientes.",
    },
    {
      icon: Server,
      title: "Escalabilidade Infinita",
      description: "Infraestrutura que cresce com você. Sem gargalos, sem surpresas, sem downtime.",
    },
    {
      icon: Shield,
      title: "Segurança Enterprise",
      description: "Criptografia de ponta, backup automático e conformidade com LGPD.",
    },
  ];

  const stats = [
    { value: "+500", label: "Provedores Ativos" },
    { value: "+2M", label: "Conversas Processadas" },
    { value: "99.9%", label: "Uptime Garantido" },
    { value: "4.9/5", label: "Satisfação dos Clientes" },
  ];

  const faqs = [
    {
      question: "Por que o preço varia conforme o número de clientes?",
      answer: "Nosso modelo de precificação é baseado em consumo real de infraestrutura. Quanto mais clientes você atende, maior o uso de banco de dados, processamento de IA, automações simultâneas e tráfego de API. Isso garante que você pague apenas pelo que realmente usa, sem surpresas.",
    },
    {
      question: "Todos os agentes estão incluídos em todos os planos?",
      answer: "Sim! Diferente de outros SaaS, não limitamos funcionalidades por plano. Todos os 5 tipos de agentes (Técnico, Atendimento, NOC, Comercial e Customizáveis) estão disponíveis desde o plano Starter. A diferença está apenas na capacidade de processamento e infraestrutura.",
    },
    {
      question: "O que acontece se eu ultrapassar o limite de clientes?",
      answer: "Você será notificado automaticamente quando atingir 80% da capacidade. Oferecemos upgrade transparente para o próximo plano ou podemos criar um plano intermediário personalizado. Nunca cortamos seu serviço abruptamente.",
    },
    {
      question: "Qual a diferença entre infraestrutura Compartilhada e Dedicada?",
      answer: "Na infraestrutura Compartilhada (Starter), os recursos são distribuídos entre múltiplos clientes. Na Dedicada (Growth+), você tem recursos exclusivos garantindo performance consistente. Na Dedicada Premium (Professional+), há ainda mais poder de processamento e prioridade de execução.",
    },
    {
      question: "Vocês oferecem período de teste?",
      answer: "Sim! Oferecemos 14 dias de teste gratuito no plano Growth ISP para você avaliar a plataforma com dados reais do seu provedor. Sem necessidade de cartão de crédito para começar.",
    },
    {
      question: "Como funciona a integração com meu sistema de gestão (SGP)?",
      answer: "Temos integrações nativas com os principais SGPs do mercado (IXC, MK-Auth, Hubsoft, Voalle, entre outros). A configuração leva em média 2 horas e nossa equipe acompanha todo o processo de onboarding.",
    },
    {
      question: "Qual o SLA garantido?",
      answer: "Nosso SLA varia de 99.5% (Starter) a 99.99% (Enterprise). Em caso de indisponibilidade além do SLA contratado, oferecemos créditos proporcionais automaticamente aplicados na próxima fatura.",
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, não há fidelidade. No plano mensal você pode cancelar a qualquer momento. No anual, respeitamos o período contratado mas oferecemos reembolso proporcional em casos específicos.",
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
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background Effects */}
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
              <Building2 className="w-4 h-4 mr-2" />
              Precificação por Volume de Clientes
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Pague pelo que{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                realmente usa
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Todos os agentes incluídos em todos os planos. Sem limitação de funcionalidades, 
              apenas capacidade que escala com o crescimento do seu provedor.
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
        </div>
      </section>

      {/* All Agents Included Banner */}
      <section className="py-8 px-4 bg-purple-900/20 border-y border-purple-500/20">
        <div className="container mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">
              ✨ Todos os Agentes Incluídos em Qualquer Plano
            </h3>
            <p className="text-gray-400 text-sm">
              Acesso completo a toda nossa suíte de automação inteligente
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {allAgents.map((agent, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700/50"
              >
                <agent.icon className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-200">{agent.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const price = calculatePrice(plan.monthlyPrice);
              const Icon = plan.icon;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
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
                        Mais Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="bg-[#0D1B3E]/95 backdrop-blur-xl rounded-[22px] p-6 h-full flex flex-col">
                    {/* Plan Header */}
                    <div className="mb-4">
                      <div className={`${plan.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>

                    {/* Price */}
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
                          {isAnnual && plan.monthlyPrice && (
                            <p className="text-green-400 text-sm mt-1">
                              <span className="line-through text-gray-500">R$ {formatPrice(plan.monthlyPrice)}</span>
                              {" "}• Faturado anualmente
                            </p>
                          )}
                        </>
                      ) : (
                        <div>
                          <span className="text-2xl font-bold text-white">{plan.customPrice}</span>
                          <p className="text-gray-400 text-sm mt-1">Sob consulta</p>
                        </div>
                      )}
                    </div>

                    {/* Capacity Details */}
                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4" />
                          Clientes
                        </span>
                        <span className="font-semibold text-white text-sm">até {plan.maxClients}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4" />
                          Interações
                        </span>
                        <span className="font-semibold text-white text-sm">{plan.interactions}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                          <Database className="w-4 h-4" />
                          Storage
                        </span>
                        <span className="font-semibold text-white text-sm">{plan.storage}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                          <Cpu className="w-4 h-4" />
                          Infra
                        </span>
                        <span className="font-semibold text-white text-right text-xs">{plan.infrastructure}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4" />
                          SLA
                        </span>
                        <span className="font-semibold text-green-400 text-sm">{plan.sla}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          Resposta
                        </span>
                        <span className="font-semibold text-white text-sm">{plan.responseTime}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-400 flex items-center gap-2 text-sm">
                          <Headphones className="w-4 h-4" />
                          Suporte
                        </span>
                        <span className="font-semibold text-white text-right text-xs">{plan.support}</span>
                      </div>
                    </div>

                    {/* CTA */}
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
                            <Phone className="w-4 h-4 mr-2" />
                            Falar com Vendas
                          </>
                        ) : (
                          <>
                            Começar Agora
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

      {/* Pricing Transparency */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Precificação Transparente</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Entenda exatamente o que influencia o custo da plataforma conforme seu provedor cresce
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pricingFactors.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center p-6 bg-gray-800/30 border-gray-700/50 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 border-t border-gray-800">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Por que provedores escolhem a 3AM Flowz?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Resultados tangíveis que impactam diretamente o seu negócio
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full p-6 bg-gray-800/30 border-gray-700/50 backdrop-blur-sm hover:border-purple-500/50 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-white">{benefit.title}</h3>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-purple-900/10 border-y border-purple-500/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
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
              Tire suas dúvidas sobre nossa plataforma e planos
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

      {/* Final CTA */}
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
              Pronto para Automatizar seu Provedor?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Teste gratuitamente por 14 dias. Sem cartão de crédito. 
              Configuração em menos de 2 horas com acompanhamento da nossa equipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-8 py-6"
                onClick={() => navigate("/auth")}
              >
                Começar Teste Gratuito
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500 text-lg px-8 py-6"
                onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Falar com Especialista
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
