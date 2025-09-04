
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Plus, Signal, Thermometer, Zap } from "lucide-react";
import { useONTMonitoring } from '@/hooks/useONTMonitoring';
import { useOltConfigurations } from '@/hooks/useOltConfigurations';

const ONTMonitoringPanel = () => {
  const [selectedOlt, setSelectedOlt] = useState('');
  const [newOnt, setNewOnt] = useState({
    ont_serial: '',
    ont_id: '',
    interface_id: '',
  });

  const { configurations } = useOltConfigurations();
  const { ontData, isLoading, createONT, updateONT, isCreating, isUpdating } = useONTMonitoring(selectedOlt);

  const handleCreateONT = async () => {
    if (!selectedOlt || !newOnt.ont_serial || !newOnt.ont_id) return;

    await createONT({
      olt_configuration_id: selectedOlt,
      ont_serial: newOnt.ont_serial,
      ont_id: newOnt.ont_id,
      interface_id: newOnt.interface_id,
      status: 'unknown',
    });

    setNewOnt({ ont_serial: '', ont_id: '', interface_id: '' });
  };

  const handleRefreshONT = async (ontId: string) => {
    await updateONT({
      id: ontId,
      last_seen: new Date().toISOString(),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'default';
      case 'offline': return 'destructive';
      case 'unknown': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatSignalStrength = (value: number | null) => {
    if (value === null) return 'N/A';
    return `${value.toFixed(2)} dBm`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Monitoramento de ONTs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="olt-select" className="text-white">Selecionar OLT</Label>
            <Select value={selectedOlt} onValueChange={setSelectedOlt}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma OLT" />
              </SelectTrigger>
              <SelectContent>
                {configurations.map((config) => (
                  <SelectItem key={config.id} value={config.id!}>
                    {config.name} ({config.brand} {config.model})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ont-serial" className="text-white">Serial da ONT</Label>
              <Input
                id="ont-serial"
                value={newOnt.ont_serial}
                onChange={(e) => setNewOnt(prev => ({ ...prev, ont_serial: e.target.value }))}
                placeholder="FHTT12345678"
              />
            </div>
            <div>
              <Label htmlFor="ont-id" className="text-white">ID da ONT</Label>
              <Input
                id="ont-id"
                value={newOnt.ont_id}
                onChange={(e) => setNewOnt(prev => ({ ...prev, ont_id: e.target.value }))}
                placeholder="0/1/0"
              />
            </div>
            <div>
              <Label htmlFor="interface-id" className="text-white">Interface</Label>
              <Input
                id="interface-id"
                value={newOnt.interface_id}
                onChange={(e) => setNewOnt(prev => ({ ...prev, interface_id: e.target.value }))}
                placeholder="gpon 0/1/0"
              />
            </div>
          </div>

          <Button 
            onClick={handleCreateONT} 
            disabled={isCreating || !selectedOlt || !newOnt.ont_serial || !newOnt.ont_id}
            className="w-full bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600"
          >
            {isCreating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Adicionar ONT
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">ONTs Monitoradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : ontData.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              Nenhuma ONT cadastrada para monitoramento
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Serial</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Interface</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>RX Power</TableHead>
                  <TableHead>TX Power</TableHead>
                  <TableHead>Temperatura</TableHead>
                  <TableHead>Voltagem</TableHead>
                  <TableHead>Última Verificação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ontData.map((ont) => (
                  <TableRow key={ont.id}>
                    <TableCell className="font-medium">{ont.ont_serial}</TableCell>
                    <TableCell>{ont.ont_id}</TableCell>
                    <TableCell>{ont.interface_id}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(ont.status)}>
                        {ont.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Signal className="h-4 w-4 text-blue-500" />
                        {formatSignalStrength(ont.optical_power_rx)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Signal className="h-4 w-4 text-green-500" />
                        {formatSignalStrength(ont.optical_power_tx)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        {ont.temperature ? `${ont.temperature.toFixed(1)}°C` : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        {ont.voltage ? `${ont.voltage.toFixed(2)}V` : 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {ont.last_seen ? new Date(ont.last_seen).toLocaleString('pt-BR') : 'Nunca'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefreshONT(ont.id!)}
                        disabled={isUpdating}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ONTMonitoringPanel;
