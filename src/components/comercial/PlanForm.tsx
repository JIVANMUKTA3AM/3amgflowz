import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProviderPlan, Provider } from '@/hooks/useProviderPlans';

interface PlanFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: Omit<ProviderPlan, 'id' | 'created_at' | 'updated_at'>) => void;
  providers: Provider[];
  editingPlan?: ProviderPlan | null;
}

export const PlanForm = ({ isOpen, onClose, onSave, providers, editingPlan }: PlanFormProps) => {
  const [formData, setFormData] = useState({
    provedor_id: '',
    nome_plano: '',
    preco: '',
    promocao: '',
    condicoes: '',
    ativo: true
  });

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        provedor_id: editingPlan.provedor_id,
        nome_plano: editingPlan.nome_plano,
        preco: editingPlan.preco.toString(),
        promocao: editingPlan.promocao || '',
        condicoes: editingPlan.condicoes || '',
        ativo: editingPlan.ativo
      });
    } else {
      setFormData({
        provedor_id: '',
        nome_plano: '',
        preco: '',
        promocao: '',
        condicoes: '',
        ativo: true
      });
    }
  }, [editingPlan, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.provedor_id || !formData.nome_plano || !formData.preco) {
      return;
    }

    onSave({
      provedor_id: formData.provedor_id,
      nome_plano: formData.nome_plano,
      preco: parseFloat(formData.preco),
      promocao: formData.promocao || null,
      condicoes: formData.condicoes || null,
      ativo: formData.ativo
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingPlan ? 'Editar Plano' : 'Novo Plano'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provedor">Provedor *</Label>
            <Select
              value={formData.provedor_id}
              onValueChange={(value) => setFormData({ ...formData, provedor_id: value })}
              disabled={!!editingPlan}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o provedor" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome_plano">Nome do Plano *</Label>
            <Input
              id="nome_plano"
              value={formData.nome_plano}
              onChange={(e) => setFormData({ ...formData, nome_plano: e.target.value })}
              placeholder="Ex: 300 Mb, 500 Mb, 1 Gb"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preco">Preço (R$) *</Label>
            <Input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              placeholder="99.90"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="promocao">Promoção</Label>
            <Input
              id="promocao"
              value={formData.promocao}
              onChange={(e) => setFormData({ ...formData, promocao: e.target.value })}
              placeholder="Ex: Primeiro mês grátis, Wi-Fi 6 incluso"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condicoes">Condições</Label>
            <Textarea
              id="condicoes"
              value={formData.condicoes}
              onChange={(e) => setFormData({ ...formData, condicoes: e.target.value })}
              placeholder="Ex: Carência de 12 meses, instalação gratuita"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ativo"
              checked={formData.ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
            />
            <Label htmlFor="ativo">Plano ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingPlan ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};