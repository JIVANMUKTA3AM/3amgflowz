
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";

export type AuthSession = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
};

export const useAuth = () => {
  const [authSession, setAuthSession] = useState<AuthSession>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Primeiro verificar se já existe uma sessão
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAuthSession((prev) => ({
          ...prev,
          isLoading: false,
          error,
        }));
        return;
      }

      if (data.session) {
        setAuthSession({
          user: data.session.user,
          session: data.session,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthSession((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    });

    // Configurar listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthSession({
          user: session?.user || null,
          session,
          isLoading: false,
          error: null,
        });

        // Não chamar outras funções do Supabase aqui diretamente para evitar deadlocks
        // Se precisar carregar dados adicionais, usar setTimeout
        if (session?.user) {
          setTimeout(() => {
            // Aqui poderia buscar dados adicionais do perfil, etc.
          }, 0);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return authSession;
};

export const login = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signup = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
};
