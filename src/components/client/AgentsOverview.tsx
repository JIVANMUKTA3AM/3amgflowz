
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

const AgentsOverview = () => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
        <CardTitle className="text-2xl text-3amg-purple flex items-center gap-2">
          <Zap className="w-6 h-6" />
          Seus Agentes de IA
        </CardTitle>
        <CardDescription className="text-gray-600">Agentes configurados para seu atendimento</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="relative p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <div>
              <h4 className="font-semibold text-emerald-800">Atendimento Geral</h4>
              <p className="text-sm text-emerald-600 mt-1">Dúvidas e suporte básico</p>
            </div>
            <div className="mt-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium w-fit">Ativo</div>
          </div>
          
          <div className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <h4 className="font-semibold text-blue-800">Suporte Técnico</h4>
              <p className="text-sm text-blue-600 mt-1">Problemas de internet e equipamentos</p>
            </div>
            <div className="mt-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium w-fit">Ativo</div>
          </div>
          
          <div className="relative p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            <div>
              <h4 className="font-semibold text-purple-800">Comercial</h4>
              <p className="text-sm text-purple-600 mt-1">Vendas e novos planos</p>
            </div>
            <div className="mt-3 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium w-fit">Ativo</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentsOverview;
