
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Zap } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-3amg-dark via-3amg-purple-dark to-3amg-dark">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-800/50 border-3amg-orange/30 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <Zap className="h-16 w-16 text-3amg-orange mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Pronto para <span className="bg-gradient-3amg bg-clip-text text-transparent">Automatizar</span>?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Transforme seu atendimento e processos com nossas soluções de IA. 
                Comece hoje mesmo e veja a diferença em poucos dias.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-3amg-orange hover:opacity-90 text-white font-semibold px-8 py-4 text-lg">
                  Iniciar Projeto
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-3amg-orange text-3amg-orange hover:bg-3amg-orange hover:text-white px-8 py-4 text-lg"
                onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Falar com Especialista
              </Button>
            </div>

            <div className="mt-8 text-gray-400">
              <p className="text-sm">✓ Implementação rápida ✓ Suporte especializado ✓ Resultados garantidos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;
