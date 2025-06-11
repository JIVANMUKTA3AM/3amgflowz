import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import RoleBasedRouter from "@/components/RoleBasedRouter";

import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import Onboarding from "@/pages/Onboarding";
import Agentes from "@/pages/Agentes";
import Integracoes from "@/pages/Integracoes";
import Dashboard from "@/pages/Dashboard";
import DatabaseManagement from "@/pages/DatabaseManagement";
import Subscription from "@/pages/Subscription";
import SubscriptionManagement from "@/pages/SubscriptionManagement";
import Pagamentos from "@/pages/Pagamentos";
import IntegrationsManagement from "@/pages/IntegrationsManagement";
import WhatsAppConfig from "@/pages/WhatsAppConfig";
import SlackConfig from "@/pages/SlackConfig";
import RdStationConfig from "@/pages/RdStationConfig";
import PipedriveConfig from "@/pages/PipedriveConfig";
import OltConfig from "@/pages/OltConfig";
import BillingConfig from "@/pages/BillingConfig";
import PagamentoMetodo from "@/pages/PagamentoMetodo";
import ClientWebhook from "@/pages/ClientWebhook";
import Arquitetura from "@/pages/Arquitetura";
import ModeloDados from "@/pages/ModeloDados";
import Fluxos from "@/pages/Fluxos";
import Documentacao from "@/pages/Documentacao";
import NotFound from "@/pages/NotFound";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <RoleBasedRouter />
                </ProtectedRoute>
              } />
              <Route path="/agentes" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Agentes />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/integracoes" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Integracoes />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/database" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <DatabaseManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/subscription" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Subscription />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/subscription-management" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <SubscriptionManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/pagamentos" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Pagamentos />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              <Route path="/integrations-management" element={
                <ProtectedRoute>
                  <AdminRoute>
                    <IntegrationsManagement />
                  </AdminRoute>
                </ProtectedRoute>
              } />
              
              {/* Rotas públicas de configuração */}
              <Route path="/whatsapp-config" element={<WhatsAppConfig />} />
              <Route path="/slack-config" element={<SlackConfig />} />
              <Route path="/rd-station-config" element={<RdStationConfig />} />
              <Route path="/pipedrive-config" element={<PipedriveConfig />} />
              <Route path="/olt-config" element={<OltConfig />} />
              <Route path="/billing-config" element={<BillingConfig />} />
              <Route path="/pagamento-metodo" element={<PagamentoMetodo />} />
              <Route path="/client-webhook" element={<ClientWebhook />} />
              
              {/* Rotas informativas */}
              <Route path="/arquitetura" element={<Arquitetura />} />
              <Route path="/modelo-dados" element={<ModeloDados />} />
              <Route path="/fluxos" element={<Fluxos />} />
              <Route path="/documentacao" element={<Documentacao />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
