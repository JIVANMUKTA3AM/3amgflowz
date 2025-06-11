
import { Shield } from "lucide-react";

const ClientHeader = () => {
  return (
    <div className="relative bg-gradient-3amg shadow-xl border-b overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
      </div>
      <div className="relative container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-3xl font-bold mb-2 animate-fade-in">Dashboard do Cliente</h1>
            <p className="text-white/90 text-lg">Gerencie seus agentes de IA e monitore atendimentos em tempo real</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
              <Shield className="inline w-4 h-4 mr-2" />
              Plano Pro Ativo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
