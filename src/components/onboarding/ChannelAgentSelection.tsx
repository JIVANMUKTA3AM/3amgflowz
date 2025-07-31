
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, MessageCircle, Wifi, Users, DollarSign, Wrench } from "lucide-react";

interface ChannelAgentSelectionProps {
  selectedChannels: string[];
  selectedAgents: string[];
  onChannelsChange: (channels: string[]) => void;
  onAgentsChange: (agents: string[]) => void;
  onNext: () => void;
}

const ChannelAgentSelection = ({ 
  selectedChannels, 
  selectedAgents, 
  onChannelsChange, 
  onAgentsChange, 
  onNext 
}: ChannelAgentSelectionProps) => {
  const channels = [
    { id: 'whatsapp', label: 'WhatsApp Business', icon: MessageCircle, description: 'Atendimento via WhatsApp' },
    { id: 'olt_monitoring', label: 'Monitoramento OLT', icon: Wifi, description: 'Monitoramento de equipamentos OLT' }
  ];

  const agents = [
    { id: 'atendimento_geral', label: 'Atendimento Geral', icon: Users, description: 'Atendimento ao cliente' },
    { id: 'comercial', label: 'Comercial', icon: DollarSign, description: 'Vendas e propostas' },
    { id: 'suporte_tecnico', label: 'Suporte Técnico', icon: Wrench, description: 'Suporte técnico especializado' }
  ];

  const handleChannelChange = (channelId: string, checked: boolean) => {
    if (checked) {
      onChannelsChange([...selectedChannels, channelId]);
    } else {
      onChannelsChange(selectedChannels.filter(id => id !== channelId));
    }
  };

  const handleAgentChange = (agentId: string, checked: boolean) => {
    if (checked) {
      onAgentsChange([...selectedAgents, agentId]);
    } else {
      onAgentsChange(selectedAgents.filter(id => id !== agentId));
    }
  };

  const canProceed = selectedChannels.length > 0 && selectedAgents.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6 flex items-center justify-center">
      <Card className="w-full max-w-4xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">
            Configure seus Canais e Agentes
          </CardTitle>
          <p className="text-purple-100 text-center mt-2">
            Selecione os canais de comunicação e tipos de agentes para seu provedor
          </p>
        </CardHeader>
        
        <CardContent className="p-8 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Canais de Comunicação</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {channels.map((channel) => (
                <div key={channel.id} className="flex items-center space-x-3 p-4 border-2 rounded-xl hover:bg-gray-50 transition-all">
                  <Checkbox
                    id={channel.id}
                    checked={selectedChannels.includes(channel.id)}
                    onCheckedChange={(checked) => handleChannelChange(channel.id, checked as boolean)}
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <channel.icon className="w-6 h-6 text-purple-600" />
                    <div>
                      <label htmlFor={channel.id} className="font-medium text-gray-900 cursor-pointer">
                        {channel.label}
                      </label>
                      <p className="text-sm text-gray-600">{channel.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tipos de Agentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="flex items-start space-x-3 p-4 border-2 rounded-xl hover:bg-gray-50 transition-all">
                  <Checkbox
                    id={agent.id}
                    checked={selectedAgents.includes(agent.id)}
                    onCheckedChange={(checked) => handleAgentChange(agent.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex flex-col space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <agent.icon className="w-5 h-5 text-indigo-600" />
                      <label htmlFor={agent.id} className="font-medium text-gray-900 cursor-pointer">
                        {agent.label}
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">{agent.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button 
              onClick={onNext}
              disabled={!canProceed}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChannelAgentSelection;
