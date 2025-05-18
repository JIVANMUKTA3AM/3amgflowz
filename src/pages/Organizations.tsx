
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Settings, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const organizationSchema = z.object({
  name: z.string().min(2, "Nome da organização deve ter pelo menos 2 caracteres"),
});

type OrganizationFormValues = z.infer<typeof organizationSchema>;

const Organizations = () => {
  const { user, isLoading } = useRequireAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
    },
  });

  // Carregar organizações
  useEffect(() => {
    const fetchOrganizations = async () => {
      if (!user) return;
      
      try {
        setIsLoadingOrgs(true);
        
        // Buscar organizações que o usuário é proprietário
        const { data: ownedOrgs, error: ownedError } = await supabase
          .from("organizations")
          .select("*")
          .eq("owner_id", user.id);

        if (ownedError) throw ownedError;

        // Buscar organizações que o usuário é membro
        const { data: memberships, error: membershipsError } = await supabase
          .from("memberships")
          .select("organization_id, role, organizations(*)")
          .eq("user_id", user.id);

        if (membershipsError) throw membershipsError;

        // Combinar resultados (removendo duplicações)
        const memberOrgs = memberships.map((m) => ({
          ...m.organizations,
          role: m.role,
        }));

        const allOrgs = [
          ...ownedOrgs.map((org) => ({ ...org, role: "owner" })),
          ...memberOrgs.filter(
            (mOrg) => !ownedOrgs.some((oOrg) => oOrg.id === mOrg.id)
          ),
        ];

        setOrganizations(allOrgs);
      } catch (error: any) {
        console.error("Erro ao buscar organizações:", error);
        toast({
          title: "Erro ao carregar organizações",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingOrgs(false);
      }
    };

    if (user) {
      fetchOrganizations();
    }
  }, [user, toast]);

  const onSubmit = async (values: OrganizationFormValues) => {
    if (!user) return;
    
    try {
      setIsCreating(true);

      // Criar nova organização
      const { data, error } = await supabase
        .from("organizations")
        .insert({
          name: values.name,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Adicionar à lista local
      setOrganizations((prev) => [...prev, { ...data, role: "owner" }]);
      
      // Reset do formulário e fechamento do diálogo
      form.reset();
      setDialogOpen(false);
      
      toast({
        title: "Organização criada",
        description: `${values.name} foi criada com sucesso.`,
      });
    } catch (error: any) {
      console.error("Erro ao criar organização:", error);
      toast({
        title: "Erro ao criar organização",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Organizações</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Organização
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Organização</DialogTitle>
              <DialogDescription>
                Crie uma nova organização para gerenciar seus projetos e equipe.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Organização</FormLabel>
                      <FormControl>
                        <Input placeholder="Minha Empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={isCreating}
                  >
                    {isCreating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isCreating ? "Criando..." : "Criar Organização"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoadingOrgs ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : organizations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Card key={org.id}>
              <CardHeader>
                <CardTitle>{org.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Função: {
                    org.role === "owner" ? "Proprietário" :
                    org.role === "admin" ? "Administrador" :
                    org.role === "member" ? "Membro" : "Visualizador"
                  }
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/organizations/${org.id}/members`}>
                    <Users className="h-4 w-4 mr-2" />
                    Membros
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/organizations/${org.id}/settings`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configurações
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/10">
          <h3 className="text-lg font-medium mb-2">
            Você ainda não tem organizações
          </h3>
          <p className="text-muted-foreground mb-6">
            Crie sua primeira organização para começar a gerenciar seus projetos e equipe.
          </p>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Organização
          </Button>
        </div>
      )}
    </div>
  );
};

export default Organizations;
