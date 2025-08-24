import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname;
      const shouldRedirectToOnboarding = location.state?.redirectToOnboarding;
      
      if (shouldRedirectToOnboarding || from === '/onboarding') {
        navigate('/onboarding');
      } else {
        navigate(from || '/client-dashboard');
      }
    }
  }, [user, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta.",
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Conta criada com sucesso!",
          description: "Você será redirecionado para completar seu perfil.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro na autenticação",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-3amg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="bg-gray-900/90 border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">{isLogin ? 'Entrar' : 'Criar Conta'}</CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin ? 'Entre com seu email e senha' : 'Crie uma nova conta'}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <div className="space-y-2">
                  <div className="text-gray-300 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <Input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 text-gray-300 border-gray-700 focus-visible:ring-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-gray-300 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Senha
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 text-gray-300 border-gray-700 focus-visible:ring-gray-600 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-fit w-fit p-2 hover:bg-gray-700 rounded-full"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="sr-only">Mostrar senha</span>
                    </Button>
                  </div>
                </div>
              </div>
              <Button disabled={loading} className="w-full mt-4 bg-3amg-orange text-white hover:bg-3amg-orange/90">
                {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="text-center text-sm text-gray-500">
          {isLogin ? (
            <>
              Não tem uma conta?{' '}
              <Link to="/auth" onClick={() => setIsLogin(false)} className="text-3amg-orange hover:underline underline-offset-2">
                Criar conta
              </Link>
            </>
          ) : (
            <>
              Já tem uma conta?{' '}
              <Link to="/auth" onClick={() => setIsLogin(true)} className="text-3amg-orange hover:underline underline-offset-2">
                Entrar
              </Link>
            </>
          )}
        </div>
        <Link to="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-300 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
      </div>
    </div>
  );
};

export default Auth;
