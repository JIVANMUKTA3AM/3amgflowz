
import AuthForm from "@/components/AuthForm";
import { useRequireNoAuth } from "@/hooks/useRequireAuth";

const Auth = () => {
  // Redireciona para a página principal se já estiver autenticado
  useRequireNoAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">
        Sistema de Gerenciamento SaaS
      </h1>
      <AuthForm />
    </div>
  );
};

export default Auth;
