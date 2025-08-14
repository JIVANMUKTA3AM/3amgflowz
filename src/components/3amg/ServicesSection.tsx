
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Workflow, Smartphone, Database, Code, Zap } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "Agentes de IA Especializados",
      description: "Agentes inteligentes para atendimento, suporte técnico e vendas, personalizados para seu negócio.",
      color: "from-3amg-orange to-3amg-red"
    },
    {
      icon: <Workflow className="h-8 w-8" />,
      title: "Automação de Processos",
      description: "Fluxos automatizados que eliminam tarefas repetitivas e aumentam a eficiência operacional.",
      color: "from-3amg-purple to-3amg-purple-dark"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Integrações Multi-Canal",
      description: "WhatsApp, Telegram, sites e CRMs integrados em uma única plataforma unificada.",
      color: "from-3amg-orange-light to-3amg-orange"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Gestão de Dados",
      description: "Centralização e análise inteligente de dados para tomada de decisões estratégicas.",
      color: "from-3amg-purple-light to-3amg-purple"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "Desenvolvimento Custom",
      description: "Soluções personalizadas desenvolvidas especificamente para suas necessidades únicas.",
      color: "from-3amg-red to-3amg-orange-dark"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "N8N & Webhooks",
      description: "Integrações avançadas usando N8N e webhooks para conectar qualquer sistema.",
      color: "from-3amg-purple-dark to-3amg-purple-light"
    }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Nossas <span className="bg-gradient-3amg bg-clip-text text-transparent">Soluções</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Tecnologias de ponta para automatizar, integrar e revolucionar seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-3amg-orange/50 transition-all duration-300 hover:shadow-xl hover:shadow-3amg-orange/20">
              <CardHeader>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-4`}>
                  {service.icon}
                </div>
                <CardTitle className="text-white text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
