import { Button } from "@/components/ui/button";
import { MessageSquare, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  const whatsappNumber = "5515997668073";
  const demoMessage = encodeURIComponent("Olá! Gostaria de agendar uma demonstração técnica da plataforma 3AMG.");
  const diagMessage = encodeURIComponent("Olá! Gostaria de iniciar um diagnóstico técnico para minha operação com a 3AMG.");

  return (
    <section id="contato" className="py-24 bg-gradient-to-b from-modern-blue-deep to-modern-blue-dark relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(155,92,255,0.4), transparent 70%)'
        }}>
          <div className="w-full h-full animate-pulse"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="modern-card max-w-4xl mx-auto text-center"
        >
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-modern-purple-vibrant to-modern-pink rounded-2xl mb-6 shadow-[0_0_30px_rgba(155,92,255,0.6)]"
            >
              <Terminal className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-5xl font-bold text-white mb-4">
              Pronto para <span className="text-modern-purple-vibrant">Escalar</span>?
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Implante agentes autônomos na sua operação. 
              Setup técnico em menos de 2 horas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${demoMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-modern-purple-vibrant to-modern-pink hover:opacity-90 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(155,92,255,0.6)] hover:shadow-[0_0_30px_rgba(155,92,255,0.8)] transition-all"
              >
                Solicitar Demo Técnica
                <MessageSquare className="ml-2 h-5 w-5" />
              </Button>
            </motion.a>
            
            <motion.a
              href={`https://wa.me/${whatsappNumber}?text=${diagMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-modern-turquoise text-modern-turquoise hover:bg-modern-turquoise hover:text-white px-8 py-6 text-lg rounded-full transition-all"
              >
                <Terminal className="mr-2 h-5 w-5" />
                Iniciar Diagnóstico
              </Button>
            </motion.a>
          </div>

          <div className="flex items-center justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-modern-turquoise rounded-full shadow-[0_0_8px_rgba(64,224,208,0.8)]"></div>
              <span>Setup &lt; 2 horas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-modern-purple-vibrant rounded-full shadow-[0_0_8px_rgba(155,92,255,0.8)]"></div>
              <span>Suporte Técnico Dedicado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-modern-pink rounded-full shadow-[0_0_8px_rgba(255,71,179,0.8)]"></div>
              <span>SLA 99.9% Uptime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
