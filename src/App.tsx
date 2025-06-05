
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
