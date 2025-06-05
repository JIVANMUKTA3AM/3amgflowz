
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface Invoice {
  id: string;
  user_id: string;
  organization_id?: string;
  amount: number;
  description: string;
  status: string;
  payment_method?: string;
  payment_id?: string;
  payment_url?: string;
  payment_data?: any;
  payment_date?: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export const useInvoices = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ['invoices', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!user?.id,
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: {
      amount: number;
      description: string;
      due_date: string;
      organization_id?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', user?.id] });
      toast({
        title: "Fatura criada",
        description: "Nova fatura foi gerada com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error creating invoice:', error);
      toast({
        title: "Erro ao criar fatura",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  const updateInvoiceStatusMutation = useMutation({
    mutationFn: async ({ 
      invoiceId, 
      status, 
      paymentData 
    }: { 
      invoiceId: string; 
      status: string; 
      paymentData?: any;
    }) => {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (status === 'paid' && paymentData) {
        updateData.payment_date = new Date().toISOString();
        updateData.payment_data = paymentData;
      }

      const { data, error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoiceId)
        .eq('user_id', user?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices', user?.id] });
    },
    onError: (error) => {
      console.error('Error updating invoice:', error);
      toast({
        title: "Erro ao atualizar fatura",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });

  return {
    invoices,
    isLoading,
    error,
    createInvoice: createInvoiceMutation.mutate,
    isCreating: createInvoiceMutation.isPending,
    updateInvoiceStatus: updateInvoiceStatusMutation.mutate,
    isUpdating: updateInvoiceStatusMutation.isPending,
  };
};
