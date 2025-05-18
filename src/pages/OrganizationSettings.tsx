
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2 } from "lucide-react";

const organizationSchema = z.object({
  name: z.string().min(2, "Nome da organização deve ter pelo menos 2 caracteres"),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

const OrganizationSettings = () => {
  const { id: organizationId } = useParams();
  const { user, isLoading } = useRequireAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
    },
  });

  // Carregar dados da organização
  useEffect(() => {
    const fetchOrganizationData = async () => {
      if (!user || !organizationId) return;
      
      try {
        setIsLoadingOrg(true);
        
        // Buscar dados da organização
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("*")
          .eq("id", organizationId)
          .single();

        if (orgError) throw orgError;
        setOrganization(orgData);
        
        // Preencher o formulário
        form.reset({
          name: orgData.name,
        });
        
        // Verificar função do usuário
        const isOwner = orgData.owner_id === user.id;
        
        if (isOwner) {
          setUserRole("owner");
        } else {
          const { data: memberData, error: memberError } = await supabase
            .from("memberships")
            .select("role")
            .eq("organization_id", organizationId)
            .eq("user_id", user.id)
            .single();
            
          if (memberError) {
            // Redirecionar se não tem acesso
            toast({
              title: "Acesso negado",
              description: "Você não tem permissão para acessar esta organização.",
              variant: "destructive",
            });
            // Deve redirecionar, mas aqui só mostramos o erro
          } else {
            setUserRole(memberData.role);
          }
        }
      } catch (error: any) {
        console.error("Erro ao buscar dados da organização:", error);
        toast({
          title: "Erro ao carregar organização",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingOrg(false);
      }
    };

    if (user) {
      fetchOrganizationData();
    }
  }, [user, organizationId, form, toast]);

  const onSubmit = async (values: OrganizationFormValues) => {
    if (!user || !organizationId) return;
    
    try {
      setIsSaving(true);

      // Atualizar organização
      const { error } = await supabase
        .from("organizations")
        .update({ name: values.name })
        .eq("id", organizationId);

      if (error) throw error;
      
      // Atualizar estado local
      setOrganization({ ...organization, name: values.name });
      
      toast({
        title: "Organização atualizada",
        description: "As configurações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar organização:", error);
      toast({
        title: "Erro ao atualizar organização",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!user || !organizationId) return;
    
    try {
      setIsDeleting(true);

      // Verificar se é proprietário
      if (organization.owner_id !== user.id) {
        toast({
          title: "Operação não permitida",
          description: "Apenas o proprietário pode excluir a organização.",
          variant: "destructive",
        });
        return;
      }

      // Excluir organização (na vida real, você provavelmente faria mais verificações)
      const { error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", organizationId);

      if (error) throw error;
      
      toast({
        title: "Organização excluída",
        description: "A organização foi excluída com sucesso.",
      });
      
      // Redirecionar para a página de organizações
      window.location.href = "/organizations";
    } catch (error: any) {
      console.error("Erro ao excluir organização:", error);
      toast({
        title: "Erro ao excluir organização",
        description: error.message,
        variant: "destructive",
      });
      setIsDeleting(false);
    }
  };

  // Verificar se tem permissão para editar configurações
  const canEdit = userRole === "owner" || userRole === "admin";
  
  if (isLoading || isLoadingOrg) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Organização não encontrada</h1>
          <p className="mb-6">A organização que você está procurando não existe ou você não tem acesso.</p>
          <Button asChild>
            <Link to="/organizations">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para organizações
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-2">
        <Link to="/organizations" className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 inline mr-1" />
          Voltar
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{organization.name}</h1>
        <p className="text-muted-foreground">Configurações da organização</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
            <CardDescription>
              Atualize as informações básicas da sua organização
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Organização</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled={!canEdit}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {canEdit && (
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="mt-4"
                  >
                    {isSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {userRole === "owner" && (
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>
                Ações que podem causar perda de dados permanente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                A exclusão da organização removerá permanentemente todos os dados associados a ela.
                Esta ação não pode ser desfeita.
              </p>
            </CardContent>
            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Excluindo..." : "Excluir Organização"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir organização</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente a organização 
                      "{organization.name}" e removerá todos os dados associados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteOrganization}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir permanentemente
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrganizationSettings;
