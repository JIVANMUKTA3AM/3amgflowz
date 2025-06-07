
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Arquitetura from "./pages/Arquitetura";
import ModeloDados from "./pages/ModeloDados";
import Documentacao from "./pages/Documentacao";
import NotFound from "./pages/NotFound";
import Fluxos from "./pages/Fluxos";
import Pagamentos from "./pages/Pagamentos";
import PagamentoMetodo from "./pages/PagamentoMetodo";
import Agentes from "./pages/Agentes";
import Integracoes from "./pages/Integracoes";
import Subscription from "./pages/Subscription";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import IntegrationsManagement from "./pages/IntegrationsManagement";
import DatabaseManagement from "./pages/DatabaseManagement";
import ClientWebhook from "./pages/ClientWebhook";
import WhatsAppConfig from "./pages/WhatsAppConfig";
import OltConfig from "./pages/OltConfig";
import PipedriveConfig from "./pages/PipedriveConfig";
import RdStationConfig from "./pages/RdStationConfig";
import SlackConfig from "./pages/SlackConfig";
import BillingConfig from "./pages/BillingConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/subscription" element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            } />
            <Route path="/subscription-management" element={
              <ProtectedRoute>
                <SubscriptionManagement />
              </ProtectedRoute>
            } />
            <Route path="/webhook" element={
              <ProtectedRoute>
                <ClientWebhook />
              </ProtectedRoute>
            } />
            <Route path="/whatsapp-config" element={
              <ProtectedRoute>
                <WhatsAppConfig />
              </ProtectedRoute>
            } />
            <Route path="/olt-config" element={
              <ProtectedRoute>
                <OltConfig />
              </ProtectedRoute>
            } />
            <Route path="/pipedrive-config" element={
              <ProtectedRoute>
                <PipedriveConfig />
              </ProtectedRoute>
            } />
            <Route path="/rdstation-config" element={
              <ProtectedRoute>
                <RdStationConfig />
              </ProtectedRoute>
            } />
            <Route path="/slack-config" element={
              <ProtectedRoute>
                <SlackConfig />
              </ProtectedRoute>
            } />
            <Route path="/billing-config" element={
              <ProtectedRoute>
                <BillingConfig />
              </ProtectedRoute>
            } />
            <Route path="/arquitetura" element={
              <ProtectedRoute>
                <Arquitetura />
              </ProtectedRoute>
            } />
            <Route path="/modelo-dados" element={
              <ProtectedRoute>
                <ModeloDados />
              </ProtectedRoute>
            } />
            <Route path="/documentacao" element={
              <ProtectedRoute>
                <Documentacao />
              </ProtectedRoute>
            } />
            <Route path="/fluxos" element={
              <ProtectedRoute>
                <Fluxos />
              </ProtectedRoute>
            } />
            <Route path="/pagamentos" element={
              <ProtectedRoute>
                <Pagamentos />
              </ProtectedRoute>
            } />
            <Route path="/pagamentos/metodo" element={
              <ProtectedRoute>
                <PagamentoMetodo />
              </ProtectedRoute>
            } />
            <Route path="/agentes" element={
              <ProtectedRoute>
                <Agentes />
              </ProtectedRoute>
            } />
            <Route path="/integracoes" element={
              <ProtectedRoute>
                <Integracoes />
              </ProtectedRoute>
            } />
            <Route path="/integracoes/gerenciar" element={
              <ProtectedRoute>
                <IntegrationsManagement />
              </ProtectedRoute>
            } />
            <Route path="/database" element={
              <ProtectedRoute>
                <DatabaseManagement />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
