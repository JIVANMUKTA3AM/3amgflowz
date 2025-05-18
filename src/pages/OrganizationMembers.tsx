
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
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
import { ChevronLeft, Loader2, Plus, UserMinus, UserPlus } from "lucide-react";

const inviteSchema = z.object({
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "member", "viewer"]),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

const OrganizationMembers = () => {
  const { id: organizationId } = useParams();
  const { user, isLoading } = useRequireAuth();
  const { toast } = useToast();
  const [isInviting, setIsInviting] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isLoadingOrg, setIsLoadingOrg] = useState(true);
  const [members, setMembers] = useState<any[]>([]);
  const [organization, setOrganization] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "member",
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
        
        // Verificar função do usuário
        const { data: memberData, error: memberError } = await supabase
          .from("memberships")
          .select("role")
          .eq("organization_id", organizationId)
          .eq("user_id", user.id)
          .single();
          
        // Se não for membro, verificar se é proprietário
        if (memberError && orgData.owner_id === user.id) {
          setUserRole("owner");
        } else if (!memberError) {
          setUserRole(memberData.role);
        } else {
          // Redirecionar se não tem acesso
          toast({
            title: "Acesso negado",
            description: "Você não tem permissão para acessar esta organização.",
            variant: "destructive",
          });
          // Deve redirecionar, mas aqui só mostramos o erro
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
  }, [user, organizationId, toast]);

  // Carregar membros
  useEffect(() => {
    const fetchMembers = async () => {
      if (!user || !organizationId) return;
      
      try {
        setIsLoadingMembers(true);
        
        // Buscar membros da organização
        const { data: membershipsData, error: membershipsError } = await supabase
          .from("memberships")
          .select(`
            id,
            role,
            user_id,
            created_at
          `)
          .eq("organization_id", organizationId);

        if (membershipsError) throw membershipsError;

        // Buscar dados dos proprietários
        const { data: orgData, error: orgError } = await supabase
          .from("organizations")
          .select("owner_id")
          .eq("id", organizationId)
          .single();

        if (orgError) throw orgError;

        // Combinar dados e formatar para exibição
        const ownerEntry = {
          id: "owner",
          role: "owner",
          user_id: orgData.owner_id,
          created_at: null
        };

        // Excluir proprietário dos membros normais para evitar duplicação
        const filteredMemberships = membershipsData.filter(
          (member) => member.user_id !== orgData.owner_id
        );

        const allMembers = [ownerEntry, ...filteredMemberships];
        setMembers(allMembers);
      } catch (error: any) {
        console.error("Erro ao buscar membros:", error);
        toast({
          title: "Erro ao carregar membros",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingMembers(false);
      }
    };

    if (user && organization) {
      fetchMembers();
    }
  }, [user, organizationId, organization, toast]);

  const onSubmit = async (values: InviteFormValues) => {
    if (!user || !organizationId) return;
    
    try {
      setIsInviting(true);

      // Simulação de convite - na vida real, verificaríamos se o usuário existe
      // e enviaríamos um email de convite
      toast({
        title: "Convite enviado",
        description: `Um convite foi enviado para ${values.email} com a função de ${values.role}.`,
      });
      
      // Reset do formulário e fechamento do diálogo
      form.reset();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Erro ao convidar membro:", error);
      toast({
        title: "Erro ao convidar membro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string, userId: string) => {
    if (!user || !organizationId) return;
    
    try {
      // Não permitir remover o proprietário
      if (userId === organization.owner_id) {
        toast({
          title: "Operação não permitida",
          description: "Não é possível remover o proprietário da organização.",
          variant: "destructive",
        });
        return;
      }

      // Não permitir remover a si mesmo
      if (userId === user.id) {
        toast({
          title: "Operação não permitida",
          description: "Você não pode remover a si mesmo da organização.",
          variant: "destructive",
        });
        return;
      }

      // Remover membro
      const { error } = await supabase
        .from("memberships")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      // Atualizar lista local
      setMembers(members.filter(m => m.id !== memberId));
      
      toast({
        title: "Membro removido",
        description: "O membro foi removido da organização.",
      });
    } catch (error: any) {
      console.error("Erro ao remover membro:", error);
      toast({
        title: "Erro ao remover membro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateMemberRole = async (memberId: string, role: string) => {
    try {
      // Atualizar função do membro
      const { error } = await supabase
        .from("memberships")
        .update({ role })
        .eq("id", memberId);

      if (error) throw error;

      // Atualizar lista local
      setMembers(members.map(m => 
        m.id === memberId ? { ...m, role } : m
      ));
      
      toast({
        title: "Função atualizada",
        description: "A função do membro foi atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar função:", error);
      toast({
        title: "Erro ao atualizar função",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Verificar se é proprietário ou admin para permitir gerenciamento
  const canManageMembers = userRole === "owner" || userRole === "admin";

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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{organization.name}</h1>
          <p className="text-muted-foreground">Gerenciamento de membros</p>
        </div>
        
        {canManageMembers && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Convidar Membro
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar Novo Membro</DialogTitle>
                <DialogDescription>
                  Envie um convite para um novo membro entrar na organização.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="colaborador@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="member">Membro</SelectItem>
                            <SelectItem value="viewer">Visualizador</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={isInviting}
                    >
                      {isInviting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isInviting ? "Enviando..." : "Enviar Convite"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membros</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingMembers ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Desde</TableHead>
                  {canManageMembers && <TableHead className="text-right">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.user_id}</TableCell>
                    <TableCell>
                      {member.role === "owner" ? (
                        "Proprietário"
                      ) : canManageMembers && member.user_id !== user.id ? (
                        <Select 
                          defaultValue={member.role}
                          onValueChange={(value) => handleUpdateMemberRole(member.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="member">Membro</SelectItem>
                            <SelectItem value="viewer">Visualizador</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        member.role === "admin" ? "Administrador" :
                        member.role === "member" ? "Membro" : "Visualizador"
                      )}
                    </TableCell>
                    <TableCell>
                      {member.created_at ? 
                        new Date(member.created_at).toLocaleDateString() : 
                        "—"
                      }
                    </TableCell>
                    {canManageMembers && (
                      <TableCell className="text-right">
                        {member.role !== "owner" && member.user_id !== user.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <UserMinus className="h-4 w-4 mr-1" />
                                Remover
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover membro</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja remover este membro da organização? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleRemoveMember(member.id, member.user_id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum membro encontrado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationMembers;
