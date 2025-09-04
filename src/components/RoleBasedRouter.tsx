
import { useProfile } from "@/hooks/useProfile";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigate, useLocation, Routes, Route } from "react-router-dom";
import RoleBasedDashboard from "./RoleBasedDashboard";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import AdminWebhooks from "@/pages/AdminWebhooks";
import Agentes from "@/pages/Agentes";
import Arquitetura from "@/pages/Arquitetura";
import BillingConfig from "@/pages/BillingConfig";
import CRM from "@/pages/CRM";
import ClientDashboard from "@/pages/ClientDashboard";
import ClientWebhook from "@/pages/ClientWebhook";
import DatabaseManagement from "@/pages/DatabaseManagement";
import Documentacao from "@/pages/Documentacao";
import Fluxos from "@/pages/Fluxos";
import Integracoes from "@/pages/Integracoes";
import IntegrationsManagement from "@/pages/IntegrationsManagement";
import ModeloDados from "@/pages/ModeloDados";
import N8nManagement from "@/pages/N8nManagement";
import OltConfig from "@/pages/OltConfig";
import PagamentoMetodo from "@/pages/PagamentoMetodo";
import Pagamentos from "@/pages/Pagamentos";
import PipedriveConfig from "@/pages/PipedriveConfig";
import RdStationConfig from "@/pages/RdStationConfig";
import ResetPassword from "@/pages/ResetPassword";
import SlackConfig from "@/pages/SlackConfig";
import Subscription from "@/pages/Subscription";
import SubscriptionManagement from "@/pages/SubscriptionManagement";
import TestePagamentos from "@/pages/TestePagamentos";
import TestChat from "@/pages/TestChat";
import WebhookTesting from "@/pages/WebhookTesting";
import WebhooksManagement from "@/pages/WebhooksManagement";
import WhatsAppConfig from "@/pages/WhatsAppConfig";
import MonitoramentoSNMP from "@/pages/MonitoramentoSNMP";
import DashboardOLT from "@/pages/DashboardOLT";
import NotFound from "@/pages/NotFound";
import { Loader2 } from "lucide-react";

const RoleBasedRouter = () => {
  const { profile, isLoading } = useProfile();
  const { role } = useUserRole();
  const location = useLocation();

  console.log('RoleBasedRouter - Current path:', location.pathname);
  console.log('RoleBasedRouter - Profile:', profile);
  console.log('RoleBasedRouter - Role:', role);
  console.log('RoleBasedRouter - Loading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-300">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Rota principal */}
      <Route path="/" element={<Index />} />
      
      {/* Rota de autenticação */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Rota de onboarding */}
      <Route path="/onboarding" element={<Onboarding />} />
      
      {/* Dashboard principal */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Dashboard baseado em role para usuários */}
      <Route path="/client-dashboard" element={<RoleBasedDashboard />} />
      
      {/* Páginas administrativas */}
      <Route path="/admin-webhooks" element={<AdminWebhooks />} />
      <Route path="/agentes" element={<Agentes />} />
      <Route path="/arquitetura" element={<Arquitetura />} />
      <Route path="/billing-config" element={<BillingConfig />} />
      <Route path="/crm" element={<CRM />} />
      <Route path="/database-management" element={<DatabaseManagement />} />
      <Route path="/documentacao" element={<Documentacao />} />
      <Route path="/fluxos" element={<Fluxos />} />
      <Route path="/integracoes" element={<Integracoes />} />
      <Route path="/integrations-management" element={<IntegrationsManagement />} />
      <Route path="/modelo-dados" element={<ModeloDados />} />
      <Route path="/n8n-management" element={<N8nManagement />} />
      <Route path="/olt-config" element={<OltConfig />} />
      <Route path="/pagamento-metodo" element={<PagamentoMetodo />} />
      <Route path="/pagamentos" element={<Pagamentos />} />
      <Route path="/pipedrive-config" element={<PipedriveConfig />} />
      <Route path="/rdstation-config" element={<RdStationConfig />} />
      <Route path="/slack-config" element={<SlackConfig />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/subscription-management" element={<SubscriptionManagement />} />
      <Route path="/teste-pagamentos" element={<TestePagamentos />} />
      <Route path="/test-chat" element={<TestChat />} />
      <Route path="/webhook-testing" element={<WebhookTesting />} />
      <Route path="/webhooks-management" element={<WebhooksManagement />} />
      <Route path="/whatsapp-config" element={<WhatsAppConfig />} />
      <Route path="/monitoramento-snmp" element={<MonitoramentoSNMP />} />
      <Route path="/dashboard-olt" element={<DashboardOLT />} />
      
      {/* Cliente específico */}
      <Route path="/client-webhook" element={<ClientWebhook />} />
      
      {/* Fallback para qualquer outra rota */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoleBasedRouter;
