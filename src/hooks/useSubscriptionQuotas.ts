
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
    maxAgents: 1,
    maxApiCalls: 100,
    maxIntegrations: 1,
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
    hasCustomIntegrations: false,
    canExportData: false,
  },
  basic: {
    maxAgents: 5,
    maxApiCalls: 1000,
    maxIntegrations: 5,
    hasAdvancedAnalytics: false,
    hasPrioritySupport: false,
    hasCustomIntegrations: false,
    canExportData: true,
  },
  premium: {
    maxAgents: 20,
    maxApiCalls: 10000,
    maxIntegrations: 20,
    hasAdvancedAnalytics: true,
    hasPrioritySupport: true,
    hasCustomIntegrations: false,
    canExportData: true,
  },
  enterprise: {
    maxAgents: -1, // unlimited
    maxApiCalls: -1, // unlimited
    maxIntegrations: -1, // unlimited
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

  const quotas = planQuotas[currentPlan] || planQuotas.free;

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
    currentPlan,
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
