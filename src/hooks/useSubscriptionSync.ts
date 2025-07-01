
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionManagement } from "./useSubscriptionManagement";
import { useUserProfile } from "./useUserProfile";
import { useQueryClient } from "@tanstack/react-query";

export const useSubscriptionSync = () => {
  const { user } = useAuth();
  const { checkSubscription } = useSubscriptionManagement();
  const { profile } = useUserProfile();
  const queryClient = useQueryClient();

  // Sincronizar status de assinatura quando o usuário faz login
  useEffect(() => {
    if (user?.id && profile) {
      // Verificar status da assinatura automaticamente
      checkSubscription();
    }
  }, [user?.id, profile?.id]);

  // Verificar status periodicamente (a cada 5 minutos)
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [user?.id, checkSubscription]);

  // Invalidar cache quando há mudanças importantes
  const invalidateSubscriptionCache = () => {
    queryClient.invalidateQueries({ queryKey: ['subscription'] });
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
  };

  return {
    invalidateSubscriptionCache,
  };
};
