import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { X, Plus } from "lucide-react";

interface ClientFormData {
  name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  status: string;
  segment?: string;
  document?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
  custom_fields?: Record<string, any>;
}

interface ClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string | null;
}

const ClientForm = ({ isOpen, onClose, clientId }: ClientFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: {
      status: 'prospect',
    }
  });

  // Buscar dados do cliente para edição
  const { data: clientData } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!clientId && isOpen,
  });

  // Preencher formulário com dados do cliente
  useEffect(() => {
    if (clientData) {
      reset({
        name: clientData.name,
        email: clientData.email || '',
        phone: clientData.phone || '',
        company_name: clientData.company_name || '',
        status: clientData.status || 'prospect',
        segment: clientData.segment || '',
        document: clientData.document || '',
        address: clientData.address || {},
        custom_fields: clientData.custom_fields || {},
      });
      setTags(clientData.tags || []);
    } else {
      reset({
        status: 'prospect',
        address: {},
        custom_fields: {},
      });
      setTags([]);
    }
  }, [clientData, reset]);

  const createClientMutation = useMutation({
    mutationFn: async (data: ClientFormData & { tags: string[] }) => {
      const clientPayload = {
        ...data,
        user_id: user?.id,
        address: data.address,
        custom_fields: data.custom_fields,
      };

      if (clientId) {
        const { error } = await supabase
          .from('clients')
          .update(clientPayload)
          .eq('id', clientId)
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clients')
          .insert(clientPayload);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['crm-metrics', user?.id] });
      toast({
        title: clientId ? "Cliente atualizado" : "Cliente criado",
        description: clientId 
          ? "Cliente foi atualizado com sucesso." 
          : "Cliente foi criado com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Erro ao salvar cliente:", error);
      toast({
        title: "Erro ao salvar cliente",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ClientFormData) => {
    createClientMutation.mutate({ ...data, tags });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {clientId ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                {...register("name", { required: "Nome é obrigatório" })}
                placeholder="Nome do cliente"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...register("phone")}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Empresa</Label>
              <Input
                id="company_name"
                {...register("company_name")}
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="segment">Segmento</Label>
              <Input
                id="segment"
                {...register("segment")}
                placeholder="Ex: Tecnologia, Varejo"
              />
            </div>
          </div>

          {/* Documento */}
          <div className="space-y-2">
            <Label htmlFor="document">CPF/CNPJ</Label>
            <Input
              id="document"
              {...register("document")}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nova tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">Endereço</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address.street">Rua</Label>
                <Input
                  id="address.street"
                  {...register("address.street")}
                  placeholder="Rua, número, complemento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address.city">Cidade</Label>
                <Input
                  id="address.city"
                  {...register("address.city")}
                  placeholder="Cidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address.state">Estado</Label>
                <Input
                  id="address.state"
                  {...register("address.state")}
                  placeholder="Estado"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address.zip_code">CEP</Label>
                <Input
                  id="address.zip_code"
                  {...register("address.zip_code")}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createClientMutation.isPending}
            >
              {createClientMutation.isPending 
                ? "Salvando..." 
                : clientId ? "Atualizar" : "Criar Cliente"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientForm;