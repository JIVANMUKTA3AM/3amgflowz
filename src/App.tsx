
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import RoleBasedRouter from "@/components/RoleBasedRouter";

// Pages
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import AdminWebhooks from "@/pages/AdminWebhooks";
import Onboarding from "@/pages/Onboarding";
import TestChat from "@/pages/TestChat";
import ClientDashboard from "@/pages/ClientDashboard";
import ResetPassword from "@/pages/ResetPassword";
import NotFound from "@/pages/NotFound";
import Subscription from "@/pages/Subscription";
import Agentes from "@/pages/Agentes";
import BillingConfig from "@/pages/BillingConfig";
import CRM from "@/pages/CRM";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } />
            <Route path="/test-chat" element={
              <ProtectedRoute>
                <TestChat />
              </ProtectedRoute>
            } />
            <Route path="/client-dashboard" element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            } />
            <Route path="/subscription" element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <RoleBasedRouter />
              </ProtectedRoute>
            } />
            <Route path="/admin-webhooks" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminWebhooks />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/agentes" element={
              <ProtectedRoute>
                <Agentes />
              </ProtectedRoute>
            } />
            <Route path="/integracoes" element={
              <ProtectedRoute>
                <BillingConfig />
              </ProtectedRoute>
            } />
            <Route path="/fluxos" element={
              <ProtectedRoute>
                <TestChat />
              </ProtectedRoute>
            } />
            <Route path="/database-management" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/subscription-management" element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            } />
            <Route path="/documentacao" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
            <Route path="/arquitetura" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
            <Route path="/modelo-dados" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
            <Route path="/n8n-management" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
            <Route path="/pagamentos" element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            } />
            <Route path="/crm" element={
              <ProtectedRoute>
                <CRM />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
