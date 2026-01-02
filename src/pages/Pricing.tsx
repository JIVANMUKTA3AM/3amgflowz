import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Check, 
  Crown, 
  Zap, 
  Star, 
  Rocket,
  Users,
  Bot,
  MessageSquare,
  Headphones,
  Shield,
  ArrowRight,
  Sparkles,
  Building2,
  TrendingUp
} from "lucide-react";
import ModernHeader from "@/components/3amg/ModernHeader";
import Footer from "@/components/Footer";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: "starter",
      name: "Starter",
      description: "Para provedores iniciando a automação",
      icon: Zap,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      monthlyPrice: 0,
      yearlyPrice: 0,
      subscribers: "Até 500 assinantes",
      popular: false,
      features: [
        "1 Agente de IA ativo",
        "100 conversas/mês",
        "Integração WhatsApp básica",
        "Dashboard de métricas",
        "Suporte por email",
        "Documentação completa"
      ],
      cta: "Começar Grátis",
      ctaVariant: "outline" as const
    },
    {
      id: "growth",
      name: "Growth",
      description: "Para provedores em crescimento",
      icon: TrendingUp,
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      monthlyPrice: 297,
      yearlyPrice: 2970,
      subscribers: "Até 2.000 assinantes",
      popular: true,
      features: [
        "3 Agentes de IA ativos",
        "2.000 conversas/mês",
        "WhatsApp + Telegram",
        "Integração com SGP",
        "Agente Comercial incluso",
        "Suporte prioritário 24/7",
        "Relatórios avançados",
        "API REST completa"
      ],
      cta: "Escolher Growth",
      ctaVariant: "default" as const
    },
    {
      id: "professional",
      name: "Professional",
      description: "Para operações robustas",
      icon: Crown,
      iconBg: "bg-gradient-to-br from-pink-500 to-pink-600",
      monthlyPrice: 597,
      yearlyPrice: 5970,
      subscribers: "Até 5.000 assinantes",
      popular: false,
      features: [
        "Agentes ilimitados",
        "10.000 conversas/mês",
        "Todos os canais",
        "Monitoramento SNMP/OLT",
        "Agente Técnico avançado",
        "Suporte dedicado",
        "Treinamento incluso",
        "Integrações customizadas",
        "SLA 99.9% garantido"
      ],
      cta: "Escolher Professional",
      ctaVariant: "default" as const
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Solução completa sob medida",
      icon: Building2,
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      monthlyPrice: null,
      yearlyPrice: null,
      subscribers: "Assinantes ilimitados",
      popular: false,
      features: [
        "Infraestrutura dedicada",
        "Conversas ilimitadas",
        "White-label completo",
        "Múltiplas unidades/filiais",
        "Consultoria estratégica",
        "Gerente de sucesso",
        "Deploy on-premise",
        "Auditoria de segurança",
        "Contrato personalizado"
      ],
      cta: "Falar com Vendas",
      ctaVariant: "outline" as const
    }
  ];

  const calculatePrice = (monthly: number | null, yearly: number | null) => {
    if (monthly === null) return null;
    if (isAnnual && yearly) {
      return Math.round(yearly / 12);
    }
    return monthly;
  };

  const getSavings = (monthly: number, yearly: number) => {
    const annualIfMonthly = monthly * 12;
    const savings = annualIfMonthly - yearly;
    return Math.round((savings / annualIfMonthly) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1B3E] via-[#1A1F3A] to-[#0D1B3E]">
      <ModernHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
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
              <Sparkles className="w-4 h-4 mr-2" />
              Planos escaláveis para seu provedor
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Preços transparentes,
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                resultados reais
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Escolha o plano ideal para o tamanho do seu provedor. 
              Sem surpresas, sem taxas escondidas. Cancele quando quiser.
            </p>

            {/* Toggle Annual/Monthly */}
            <div className="flex items-center justify-center gap-4 mb-12">
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
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Economize 17%
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => {
              const price = calculatePrice(plan.monthlyPrice, plan.yearlyPrice);
              const Icon = plan.icon;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative rounded-3xl p-1 ${
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
                    <div className="mb-6">
                      <div className={`${plan.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-gray-400 text-sm">{plan.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      {price !== null ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-white">
                            R$ {price.toLocaleString('pt-BR')}
                          </span>
                          <span className="text-gray-400">/mês</span>
                        </div>
                      ) : (
                        <div className="text-3xl font-bold text-white">
                          Sob consulta
                        </div>
                      )}
                      <p className="text-purple-400 text-sm mt-2 font-medium">
                        {plan.subscribers}
                      </p>
                      {isAnnual && plan.monthlyPrice && plan.yearlyPrice && (
                        <p className="text-green-400 text-xs mt-1">
                          Economia de {getSavings(plan.monthlyPrice, plan.yearlyPrice)}% no plano anual
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-green-400" />
                          </div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link to="/auth" className="block">
                      <Button 
                        className={`w-full py-6 text-base font-semibold rounded-xl transition-all duration-300 ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30' 
                            : plan.ctaVariant === 'outline'
                            ? 'bg-transparent border-2 border-gray-600 text-white hover:bg-gray-800 hover:border-gray-500'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        variant={plan.popular ? "default" : plan.ctaVariant}
                      >
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Tudo que você precisa para
              <br />
              <span className="text-purple-400">automatizar seu provedor</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Bot,
                title: "Agentes de IA",
                description: "Atendimento, comercial e suporte técnico automatizados 24/7"
              },
              {
                icon: MessageSquare,
                title: "Multi-canal",
                description: "WhatsApp, Telegram, Web Chat integrados em uma plataforma"
              },
              {
                icon: Headphones,
                title: "Suporte Técnico",
                description: "Diagnóstico automatizado de conexões e equipamentos"
              },
              {
                icon: Shield,
                title: "Segurança",
                description: "Criptografia end-to-end e conformidade com LGPD"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-lg mb-8">Empresas que confiam na 3AMG Flowz</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              {["Provedor A", "Provedor B", "Provedor C", "Provedor D", "Provedor E"].map((name, i) => (
                <div key={i} className="text-2xl font-bold text-gray-500">{name}</div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { metric: "500+", label: "Provedores ativos" },
              { metric: "2M+", label: "Conversas por mês" },
              { metric: "99.9%", label: "Uptime garantido" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {stat.metric}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8">Dúvidas frequentes</h2>
            
            <div className="space-y-4 text-left">
              {[
                {
                  q: "Posso trocar de plano depois?",
                  a: "Sim! Você pode fazer upgrade ou downgrade a qualquer momento. A diferença é calculada pro-rata."
                },
                {
                  q: "Preciso de cartão de crédito para o plano gratuito?",
                  a: "Não. O plano Starter é 100% gratuito e não requer cartão de crédito para começar."
                },
                {
                  q: "Como funciona a integração com meu SGP?",
                  a: "Oferecemos integrações nativas com IXC, MK Solutions, Voalle e outros. Também temos API REST para integrações customizadas."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
                  <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                  <p className="text-gray-400 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-3xl p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Pronto para automatizar seu provedor?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Comece grátis hoje. Sem compromisso. Configure em 5 minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Criar conta grátis
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-xl"
                onClick={() => window.open('https://wa.me/5515997668073?text=Quero%20saber%20mais%20sobre%20a%203AMG%20Flowz', '_blank')}
              >
                Falar com especialista
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
