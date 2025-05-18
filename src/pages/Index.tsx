
import { useAuthContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Users, Settings, Building, User, Loader2 } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuthContext();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Buscar organizações e dados do perfil quando autenticado
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      // Carregar organizações
      setIsLoadingOrgs(true);
      try {
        // Buscar organizações que o usuário é proprietário
        const { data: ownedOrgs, error: ownedError } = await supabase
          .from("organizations")
          .select("*")
          .eq("owner_id", user.id);

        if (ownedError) throw ownedError;

        // Buscar organizações que o usuário é membro
        const { data: memberships, error: membershipsError } = await supabase
          .from("memberships")
          .select("organization_id, organizations(*)")
          .eq("user_id", user.id);

        if (membershipsError) throw membershipsError;

        // Combinar resultados (removendo duplicações)
        const memberOrgs = memberships.map((m) => m.organizations);
        const allOrgs = [
          ...ownedOrgs,
          ...memberOrgs.filter(
            (mOrg) => !ownedOrgs.some((oOrg) => oOrg.id === mOrg.id)
          ),
        ];

        setOrganizations(allOrgs);
      } catch (error) {
        console.error("Erro ao buscar organizações:", error);
      } finally {
        setIsLoadingOrgs(false);
      }

      // Carregar dados do perfil
      setIsLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfileData(data);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <AuthenticatedDashboard 
            user={user} 
            organizations={organizations} 
            isLoadingOrgs={isLoadingOrgs} 
            profileData={profileData}
            isLoadingProfile={isLoadingProfile}
          />
        ) : (
          <AnonymousLanding />
        )}
      </main>
    </div>
  );
};

const AnonymousLanding = () => (
  <div className="max-w-3xl mx-auto text-center py-12">
    <h1 className="text-4xl font-bold mb-4">
      Sistema de Gerenciamento SaaS
    </h1>
    <p className="text-xl text-gray-600 mb-8">
      Gerencie organizações, usuários e recursos com facilidade em nossa plataforma integrada.
    </p>
    <div className="flex justify-center gap-4">
      <Link to="/auth">
        <Button size="lg">Começar agora</Button>
      </Link>
      <Link to="/documentacao">
        <Button variant="outline" size="lg">
          Documentação
        </Button>
      </Link>
    </div>
  </div>
);

const AuthenticatedDashboard = ({ 
  user, 
  organizations,
  isLoadingOrgs,
  profileData,
  isLoadingProfile
}: { 
  user: any; 
  organizations: any[];
  isLoadingOrgs: boolean;
  profileData: any;
  isLoadingProfile: boolean;
}) => (
  <div>
    <h1 className="text-3xl font-bold mb-6">
      Olá, {user?.user_metadata?.full_name || "Usuário"}!
    </h1>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Minhas Organizações</CardTitle>
            <CardDescription>
              Gerencie suas organizações e equipes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOrgs ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : organizations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {organizations.slice(0, 4).map((org) => (
                  <Card key={org.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{org.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/organizations/${org.id}/members`}>
                          <Users className="h-4 w-4 mr-1" />
                          Membros
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/organizations/${org.id}/settings`}>
                          <Settings className="h-4 w-4 mr-1" />
                          Configurações
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem organizações
                </p>
                <Button asChild>
                  <Link to="/organizations">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Organização
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant={organizations.length > 0 ? "outline" : "default"} className="w-full" asChild>
              <Link to="/organizations">
                <Building className="h-4 w-4 mr-2" />
                {organizations.length > 0 
                  ? "Ver Todas Organizações" 
                  : "Gerenciar Organizações"}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard
            title="Meu Perfil"
            description="Atualize suas informações pessoais"
            linkTo="/profile"
            linkText="Editar Perfil"
            icon={<User className="h-5 w-5" />}
          />
          
          <DashboardCard
            title="Documentação"
            description="Veja guias e recursos de ajuda"
            linkTo="/documentacao"
            linkText="Ver Documentação"
            icon={<Settings className="h-5 w-5" />}
          />
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Meu Plano</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingProfile ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : profileData ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plano atual</p>
                  <p className="font-medium">
                    {profileData.plan === "free" && "Gratuito"}
                    {profileData.plan === "pro" && "Profissional"}
                    {profileData.plan === "enterprise" && "Empresarial"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Perfil</p>
                  <p className="font-medium">
                    {profileData.role === "admin" && "Administrador"}
                    {profileData.role === "user" && "Usuário"}
                    {profileData.role === "viewer" && "Visualizador"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Informações do plano não disponíveis
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Gerenciar Assinatura
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
);

const DashboardCard = ({
  title,
  description,
  linkTo,
  linkText,
  icon,
}: {
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
  icon: React.ReactNode;
}) => (
  <Card className="flex flex-col justify-between">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <div className="p-1 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button variant="outline" className="w-full" asChild>
        <Link to={linkTo}>
          {linkText}
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

export default Index;
