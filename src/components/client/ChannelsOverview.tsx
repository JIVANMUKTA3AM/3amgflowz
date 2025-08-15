
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

const ChannelsOverview = () => {
  return (
    <Card className="border-0 shadow-xl bg-gray-900/90 backdrop-blur-sm border-gray-700">
      <CardHeader className="bg-gradient-to-r from-3amg-orange/10 to-3amg-purple/10 rounded-t-lg">
        <CardTitle className="text-2xl text-3amg-orange flex items-center gap-2">
          <Globe className="w-6 h-6" />
          Canais Integrados
        </CardTitle>
        <CardDescription className="text-gray-300">Onde seus agentes estão atendendo</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl border border-green-700/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                W
              </div>
              <div>
                <h4 className="font-semibold text-green-400">WhatsApp Business</h4>
                <p className="text-sm text-green-300">+55 11 99999-9999</p>
              </div>
            </div>
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">Conectado</div>
          </div>
          
          <div className="flex items-center p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/30 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                S
              </div>
              <div>
                <h4 className="font-semibold text-blue-400">Site da Empresa</h4>
                <p className="text-sm text-blue-300">Chat widget integrado</p>
              </div>
            </div>
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">Conectado</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelsOverview;
