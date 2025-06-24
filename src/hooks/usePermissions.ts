
import { useUserProfile } from "@/hooks/useUserProfile";
import { useMemo } from "react";

export type Permission = 
  | 'view_dashboard'
  | 'manage_agents' 
  | 'manage_users'
  | 'manage_organization'
  | 'view_analytics'
  | 'manage_billing'
  | 'admin_access'
  | 'create_agents'
  | 'edit_agents'
  | 'delete_agents'
  | 'view_logs'
  | 'manage_integrations'
  | 'manage_webhooks';

const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'view_dashboard',
    'manage_agents',
    'manage_users',
    'manage_organization',
    'view_analytics',
    'manage_billing',
    'admin_access',
    'create_agents',
    'edit_agents',
    'delete_agents',
    'view_logs',
    'manage_integrations',
    'manage_webhooks'
  ],
  tecnico: [
    'view_dashboard',
    'manage_agents',
    'create_agents',
    'edit_agents',
    'view_logs',
    'manage_integrations',
    'manage_webhooks'
  ],
  comercial: [
    'view_dashboard',
    'view_analytics',
    'view_logs'
  ],
  geral: [
    'view_dashboard',
    'view_logs'
  ]
};

const planPermissions: Record<string, Permission[]> = {
  enterprise: [
    'manage_organization',
    'manage_users',
    'admin_access'
  ],
  premium: [
    'manage_integrations',
    'manage_webhooks',
    'view_analytics'
  ],
  basic: [
    'create_agents',
    'edit_agents'
  ],
  free: [
    'view_dashboard'
  ]
};

export const usePermissions = () => {
  const { profile } = useUserProfile();

  const permissions = useMemo(() => {
    if (!profile) return [];

    const userRolePermissions = rolePermissions[profile.user_role_type] || [];
    const userPlanPermissions = planPermissions[profile.plan] || [];
    
    // Combine role and plan permissions, removing duplicates
    return [...new Set([...userRolePermissions, ...userPlanPermissions])];
  }, [profile]);

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList: Permission[]): boolean => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionList: Permission[]): boolean => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  const canAccess = {
    dashboard: hasPermission('view_dashboard'),
    agents: hasPermission('manage_agents'),
    createAgents: hasPermission('create_agents'),
    editAgents: hasPermission('edit_agents'),
    deleteAgents: hasPermission('delete_agents'),
    analytics: hasPermission('view_analytics'),
    billing: hasPermission('manage_billing'),
    admin: hasPermission('admin_access'),
    organization: hasPermission('manage_organization'),
    users: hasPermission('manage_users'),
    logs: hasPermission('view_logs'),
    integrations: hasPermission('manage_integrations'),
    webhooks: hasPermission('manage_webhooks')
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    userRole: profile?.user_role_type,
    userPlan: profile?.plan,
    isAdmin: profile?.role === 'admin' || profile?.user_role_type === 'admin'
  };
};
