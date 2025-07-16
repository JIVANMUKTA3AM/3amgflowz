
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Router, Plus, Signal, Thermometer, Zap, Eye } from 'lucide-react';
import { useONTMonitoring } from '@/hooks/useONTMonitoring';
import { useOltConfigurations } from '@/hooks/useOltConfigurations';

const ONTMonitoringPanel = () => {
  const { configurations } = useOltConfigurations();
  const [selectedOLT, setSelectedOLT] = useState('');
  const { ontData, createONT, updateONT, isCreating, isUpdating } = useONTMonitoring(selectedOLT || undefined);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newONT, setNewONT] = useState({
    ont_serial: '',
    ont_id: '',
    interface_id: '',
    status: 'unknown'
  });

  const handleCreateONT = () => {
    if (!selectedOLT || !newONT.ont_serial || !newONT.ont_id || !newONT.interface_id) {
      return;
    }

    createONT({
      olt_configuration_id: selectedOLT,
      ...newONT
    });

    setNewONT({
      ont_serial: '',
      ont_id: '',
      interface_id: '',
      status: 'unknown'
    });
    setIsCreateDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-red-500',
      unknown: 'bg-gray-500',
      maintenance: 'bg-yellow-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getSignalStrength = (power?: number) => {
    if (!power) return 'N/A';
    if (power > -20) return 'Excelente';
    if (power > -25) return 'Bom';
    if (power > -30) return 'Regular';
    return 'Fraco';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Router className="h-5 w-5" />
              Monitoramento de ONTs
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedOLT} onValueChange={setSelectedOLT}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecionar OLT" />
                </SelectTrigger>
                <SelectContent>
                  {configurations.map((olt) => (
                    <SelectItem key={olt.id} value={olt.id!}>
                      {olt.name} ({olt.ip_address})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={!selectedOLT}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar ONT
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Nova ONT</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ont_serial">Serial da ONT</Label>
                      <Input
                        id="ont_serial"
                        value={newONT.ont_serial}
                        onChange={(e) => setNewONT({...newONT, ont_serial: e.target.value})}
                        placeholder="HWTC12345678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ont_id">ID da ONT</Label>
                      <Input
                        id="ont_id"
                        value={newONT.ont_id}
                        onChange={(e) => setNewONT({...newONT, ont_id: e.target.value})}
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="interface_id">Interface/PON</Label>
                      <Input
                        id="interface_id"
                        value={newONT.interface_id}
                        onChange={(e) => setNewONT({...newONT, interface_id: e.target.value})}
                        placeholder="0/1/0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status Inicial</Label>
                      <Select value={newONT.status} onValueChange={(value) => setNewONT({...newONT, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                          <SelectItem value="unknown">Desconhecido</SelectItem>
                          <SelectItem value="maintenance">Manutenção</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateONT} disabled={isCreating}>
                        {isCreating ? 'Criando...' : 'Criar ONT'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedOLT ? (
            <div className="text-center py-8 text-gray-500">
              Selecione uma OLT para visualizar as ONTs
            </div>
          ) : (
            <Tabs defaultValue="grid" className="w-full">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">Lista</TabsTrigger>
              </TabsList>

              <TabsContent value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {ontData.map((ont) => (
                    <Card key={ont.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-sm">{ont.ont_serial}</div>
                          <Badge className={getStatusColor(ont.status)}>
                            {ont.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">ONT ID:</span>
                            <span className="font-mono">{ont.ont_id}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Interface:</span>
                            <span className="font-mono">{ont.interface_id}</span>
                          </div>
                        </div>

                        {ont.optical_power_rx && (
                          <div className="border-t pt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Signal className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">Sinal Óptico</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <div className="text-gray-600">RX:</div>
                                <div className="font-mono">{ont.optical_power_rx} dBm</div>
                              </div>
                              <div>
                                <div className="text-gray-600">TX:</div>
                                <div className="font-mono">{ont.optical_power_tx} dBm</div>
                              </div>
                            </div>
                            <div className="mt-1">
                              <Badge variant="outline" className="text-xs">
                                {getSignalStrength(ont.optical_power_rx)}
                              </Badge>
                            </div>
                          </div>
                        )}

                        {(ont.temperature || ont.voltage) && (
                          <div className="border-t pt-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {ont.temperature && (
                                <div className="flex items-center gap-1">
                                  <Thermometer className="h-3 w-3" />
                                  <span>{ont.temperature}°C</span>
                                </div>
                              )}
                              {ont.voltage && (
                                <div className="flex items-center gap-1">
                                  <Zap className="h-3 w-3" />
                                  <span>{ont.voltage}V</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {ont.last_seen && (
                          <div className="text-xs text-gray-500 border-t pt-2">
                            Último contato: {new Date(ont.last_seen).toLocaleString()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="list">
                <div className="space-y-2 mt-4">
                  {ontData.map((ont) => (
                    <div key={ont.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-mono text-sm">{ont.ont_serial}</div>
                            <div className="text-xs text-gray-600">
                              Interface {ont.interface_id} • ID {ont.ont_id}
                            </div>
                          </div>
                          {ont.optical_power_rx && (
                            <div className="text-sm">
                              <div className="flex items-center gap-1">
                                <Signal className="h-3 w-3" />
                                RX: {ont.optical_power_rx} dBm
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(ont.status)}>
                            {ont.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {selectedOLT && ontData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Router className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div>Nenhuma ONT cadastrada para esta OLT</div>
              <div className="text-sm">Clique em "Adicionar ONT" para começar o monitoramento</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ONTMonitoringPanel;
