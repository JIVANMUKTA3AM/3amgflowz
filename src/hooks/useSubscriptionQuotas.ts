
import { useQuery } from "@tanstack/react-query";
import { useUserProfile } from "./useUserProfile";
import { useSubscriptionManagement } from "./useSubscriptionManagement";

export interface SubscriptionQuotas {
  maxAgents: number;
  maxApiCalls: number;
  maxIntegrations: number;
  hasAdvancedAnalytics: boolean;
  hasPrioritySupport: boolean;
  hasCustomIntegrations: boolean;
  canExportData: boolean;
}

const planQuotas: Record<string, SubscriptionQuotas> = {
  free: {
    maxAgents: 0,
    maxApiCalls: 0,
    maxIntegrations: 0,
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
    hasCustomIntegrations: false,
    canExportData: false,
  },
  premium: {
    maxAgents: 3, // Todos os 3 agentes incluídos
    maxApiCalls: -1, // Ilimitado
    maxIntegrations: -1, // Ilimitado
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
    hasCustomIntegrations: true,
    canExportData: true,
  },
};

export const useSubscriptionQuotas = () => {
  const { profile } = useUserProfile();
  const { subscription } = useSubscriptionManagement();

  const currentPlan = subscription?.plan_type || profile?.plan || 'free';
  const mappedPlan = currentPlan === 'free' ? 'free' : 'premium';

  const quotas = planQuotas[mappedPlan] || planQuotas.free;

  const checkQuota = (resource: keyof SubscriptionQuotas, currentUsage: number = 0) => {
    const limit = quotas[resource];
    if (typeof limit === 'number' && limit === -1) return { canUse: true, remaining: -1 };
    if (typeof limit === 'number') return { canUse: currentUsage < limit, remaining: limit - currentUsage };
    return { canUse: !!limit, remaining: limit ? 1 : 0 };
  };

  const isFeatureAvailable = (feature: keyof SubscriptionQuotas): boolean => {
    const value = quotas[feature];
    return typeof value === 'boolean' ? value : (typeof value === 'number' ? value > 0 : false);
  };

  return {
    quotas,
    currentPlan: mappedPlan,
    checkQuota,
    isFeatureAvailable,
    canCreateAgent: () => checkQuota('maxAgents', 0),
    canMakeApiCall: () => checkQuota('maxApiCalls', 0),
    canCreateIntegration: () => checkQuota('maxIntegrations', 0),
    hasAdvancedAnalytics: quotas.hasAdvancedAnalytics,
    hasPrioritySupport: quotas.hasPrioritySupport,
    hasCustomIntegrations: quotas.hasCustomIntegrations,
    canExportData: quotas.canExportData,
  };
};
