
import { useAuthContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated, user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <AuthenticatedDashboard user={user} />
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

const AuthenticatedDashboard = ({ user }: { user: any }) => (
  <div>
    <h1 className="text-3xl font-bold mb-6">
      Olá, {user?.user_metadata?.full_name || "Usuário"}!
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="Minhas Organizações"
        description="Gerencie suas organizações e equipes"
        linkTo="/organizations"
        linkText="Ver Organizações"
      />
      <DashboardCard
        title="Meu Perfil"
        description="Atualize suas informações pessoais"
        linkTo="/profile"
        linkText="Editar Perfil"
      />
      <DashboardCard
        title="Documentação"
        description="Veja guias e recursos de ajuda"
        linkTo="/documentacao"
        linkText="Ver Documentação"
      />
    </div>
  </div>
);

const DashboardCard = ({
  title,
  description,
  linkTo,
  linkText,
}: {
  title: string;
  description: string;
  linkTo: string;
  linkText: string;
}) => (
  <div className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
    </div>
    <Link to={linkTo}>
      <Button variant="outline" className="w-full">
        {linkText}
      </Button>
    </Link>
  </div>
);

export default Index;
