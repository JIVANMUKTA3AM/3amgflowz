import { Zap, Activity, Clock } from "lucide-react";
import { motion } from "framer-motion";

const TechMotionSection = () => {
  const features = [
    { icon: Zap, label: "Performance", value: "< 100ms", description: "Tempo de resposta médio" },
    { icon: Activity, label: "Automação", value: "99.9%", description: "Taxa de sucesso" },
    { icon: Clock, label: "Disponibilidade", value: "24/7", description: "Sempre ativo" }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated running lights effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? '#9B5CFF' : i % 3 === 1 ? '#FF47B3' : '#40E0D0',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${3 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              boxShadow: i % 3 === 0 
                ? '0 0 10px rgba(155,92,255,0.8)' 
                : i % 3 === 1 
                ? '0 0 10px rgba(255,71,179,0.8)' 
                : '0 0 10px rgba(64,224,208,0.8)'
            }}
          />
        ))}
      </div>

      {/* Digital connectors animation */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 600">
          {[...Array(6)].map((_, i) => (
            <g key={i}>
              <line
                x1={i * 200}
                y1="0"
                x2={i * 200 + 100}
                y2="600"
                stroke={i % 2 === 0 ? "#9B5CFF" : "#FF47B3"}
                strokeWidth="1"
                opacity="0.5"
              >
                <animate
                  attributeName="opacity"
                  values="0.2;0.8;0.2"
                  dur={`${2 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </line>
            </g>
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Tecnologia em <span className="text-modern-turquoise">Movimento</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Sistemas inteligentes operando em alta velocidade, 24 horas por dia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="modern-card text-center group cursor-pointer overflow-hidden">
                  {/* Animated glow background on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                       style={{
                         background: 'radial-gradient(circle at center, rgba(155,92,255,0.8), transparent)'
                       }}
                  ></div>
                  
                  <div className="relative z-10">
                    <div className="icon-box-turquoise mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    
                    <div className="text-5xl font-bold text-white mb-2 group-hover:text-modern-turquoise transition-colors">
                      {feature.value}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.label}
                    </h3>
                    
                    <p className="text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Running status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-modern-blue-dark/50 border border-modern-turquoise/30">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-modern-turquoise rounded-full animate-pulse shadow-[0_0_10px_rgba(64,224,208,0.8)]"></div>
              <div className="w-2 h-2 bg-modern-purple-vibrant rounded-full animate-pulse shadow-[0_0_10px_rgba(155,92,255,0.8)]" style={{animationDelay: '0.3s'}}></div>
              <div className="w-2 h-2 bg-modern-pink rounded-full animate-pulse shadow-[0_0_10px_rgba(255,71,179,0.8)]" style={{animationDelay: '0.6s'}}></div>
            </div>
            <span className="text-white font-semibold">Sistemas Ativos</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechMotionSection;
