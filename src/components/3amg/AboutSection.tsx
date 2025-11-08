import { Target, Users, Rocket, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const AboutSection = () => {
  const stats = [
    { icon: <Target className="h-6 w-6" />, number: "100+", label: "Projetos Entregues", color: "blue" },
    { icon: <Users className="h-6 w-6" />, number: "50+", label: "Clientes Ativos", color: "purple" },
    { icon: <Rocket className="h-6 w-6" />, number: "3+", label: "Anos de Experiência", color: "pink" },
    { icon: <Award className="h-6 w-6" />, number: "99%", label: "Satisfação dos Clientes", color: "turquoise" }
  ];

  const highlights = [
    "Especialistas em IA e Automação",
    "Soluções Personalizadas",
    "Suporte Técnico Especializado"
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-modern-blue-dark to-modern-blue-deep relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(155, 92, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(155, 92, 255, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-8 w-8 text-modern-purple-vibrant" />
              <h2 className="text-5xl font-bold text-white">
                Sobre a <span className="text-modern-purple-vibrant">3AMG</span>
              </h2>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Somos uma empresa especializada em automação e inteligência artificial, 
              focada em transformar a forma como as empresas operam e se relacionam 
              com seus clientes.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-10">
              Nossa missão é democratizar o acesso a tecnologias avançadas, 
              oferecendo soluções que antes eram exclusivas de grandes corporações 
              para empresas de todos os tamanhos.
            </p>
            
            <div className="space-y-4">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-2 h-2 bg-modern-purple-vibrant rounded-full shadow-[0_0_10px_rgba(155,92,255,0.8)] group-hover:scale-150 transition-transform"></div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="modern-card text-center group cursor-pointer"
              >
                <div className={`icon-box-${stat.color} mx-auto mb-4`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-white mb-2 group-hover:text-modern-purple-vibrant transition-colors">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
