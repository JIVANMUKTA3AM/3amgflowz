
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SettingsTab = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-3amg-purple/10 to-3amg-blue/10 rounded-t-lg">
          <CardTitle className="text-xl text-3amg-purple">Configurações da Empresa</CardTitle>
          <CardDescription>Informações básicas do seu negócio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Nome da Empresa</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-purple focus:border-transparent transition-all duration-300"
              placeholder="Sua Empresa Ltda"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Horário de Funcionamento</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-purple focus:border-transparent transition-all duration-300"
              placeholder="Segunda à Sexta, 8h às 18h"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Mensagem de Boas-vindas</label>
            <textarea 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-purple focus:border-transparent transition-all duration-300"
              rows={3}
              placeholder="Olá! Sou seu assistente virtual. Como posso ajudar?"
            />
          </div>
          <Button className="w-full bg-gradient-to-r from-3amg-purple to-3amg-blue hover:from-3amg-purple-dark hover:to-3amg-blue-dark text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-3amg-blue/10 to-3amg-indigo/10 rounded-t-lg">
          <CardTitle className="text-xl text-3amg-blue">Configurações de Atendimento</CardTitle>
          <CardDescription>Como seus agentes devem se comportar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Transferir para humano quando:</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-blue focus:border-transparent transition-all duration-300">
              <option>Cliente solicitar</option>
              <option>Problema não resolvido em 3 tentativas</option>
              <option>Questão muito complexa</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Tom de voz</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-blue focus:border-transparent transition-all duration-300">
              <option>Formal e profissional</option>
              <option>Amigável e descontraído</option>
              <option>Técnico e direto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Palavras-chave do seu negócio</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-3amg-blue focus:border-transparent transition-all duration-300"
              placeholder="internet, fibra óptica, velocidade, suporte"
            />
          </div>
          <Button className="w-full bg-gradient-to-r from-3amg-blue to-3amg-indigo hover:from-3amg-blue-dark hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
            Atualizar Comportamento
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
