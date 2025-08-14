
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Rocket, Award } from "lucide-react";

const AboutSection = () => {
  const stats = [
    { icon: <Target className="h-8 w-8" />, number: "100+", label: "Projetos Entregues" },
    { icon: <Users className="h-8 w-8" />, number: "50+", label: "Clientes Ativos" },
    { icon: <Rocket className="h-8 w-8" />, number: "3+", label: "Anos de Experiência" },
    { icon: <Award className="h-8 w-8" />, number: "99%", label: "Satisfação dos Clientes" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Sobre a <span className="bg-gradient-3amg bg-clip-text text-transparent">3AMG</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Somos uma empresa especializada em automação e inteligência artificial, 
              focada em transformar a forma como as empresas operam e se relacionam 
              com seus clientes.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Nossa missão é democratizar o acesso a tecnologias avançadas, 
              oferecendo soluções que antes eram exclusivas de grandes corporações 
              para empresas de todos os tamanhos.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-3amg-orange rounded-full"></div>
                <span className="text-gray-300">Especialistas em IA e Automação</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-3amg-purple rounded-full"></div>
                <span className="text-gray-300">Soluções Personalizadas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-3amg-orange rounded-full"></div>
                <span className="text-gray-300">Suporte Técnico Especializado</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-800/70 border-gray-700 text-center hover:border-3amg-orange/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-3amg rounded-full flex items-center justify-center text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
