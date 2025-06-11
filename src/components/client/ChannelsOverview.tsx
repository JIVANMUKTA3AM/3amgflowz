
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";

const ChannelsOverview = () => {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-3amg-blue/10 to-3amg-indigo/10 rounded-t-lg">
        <CardTitle className="text-2xl text-3amg-blue flex items-center gap-2">
          <Globe className="w-6 h-6" />
          Canais Integrados
        </CardTitle>
        <CardDescription className="text-gray-600">Onde seus agentes estão atendendo</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                W
              </div>
              <div>
                <h4 className="font-semibold text-green-800">WhatsApp Business</h4>
                <p className="text-sm text-green-600">+55 11 99999-9999</p>
              </div>
            </div>
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">Conectado</div>
          </div>
          
          <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
                S
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">Site da Empresa</h4>
                <p className="text-sm text-blue-600">Chat widget integrado</p>
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
