
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import RoleBasedRouter from './components/RoleBasedRouter';

// Import all pages
import Dashboard from './pages/Dashboard';
import SubscriptionManagement from './pages/SubscriptionManagement';
import WebhookTesting from "./pages/WebhookTesting";
import Pagamentos from './pages/Pagamentos';
import PagamentoMetodo from './pages/PagamentoMetodo';
import Integracoes from './pages/Integracoes';
import Onboarding from './pages/Onboarding';
import Index from './pages/Index';
import Auth from './pages/Auth';
import ClientDashboard from './pages/ClientDashboard';
import Agentes from './pages/Agentes';
import CRM from './pages/CRM';
import Fluxos from './pages/Fluxos';
import DatabaseManagement from './pages/DatabaseManagement';
import AdminWebhooks from './pages/AdminWebhooks';
import Documentacao from './pages/Documentacao';
import Arquitetura from './pages/Arquitetura';
import ModeloDados from './pages/ModeloDados';
import N8nManagement from './pages/N8nManagement';
import Subscription from './pages/Subscription';
import TestChat from './pages/TestChat';
import NotFound from './pages/NotFound';

function App() {
  const { user, loading } = useAuth();
  const { role } = useUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        } />
        
        {/* Role-based protected routes */}
        <Route path="/role-dashboard" element={
          <ProtectedRoute>
            <RoleBasedRouter />
          </ProtectedRoute>
        } />
        
        {/* Admin-only routes */}
        <Route path="/dashboard" element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        } />
        
        <Route path="/subscription-management" element={
          <AdminRoute>
            <SubscriptionManagement />
          </AdminRoute>
        } />
        
        <Route path="/webhook-testing" element={
          <AdminRoute>
            <WebhookTesting />
          </AdminRoute>
        } />
        
        <Route path="/database-management" element={
          <AdminRoute>
            <DatabaseManagement />
          </AdminRoute>
        } />
        
        <Route path="/admin-webhooks" element={
          <AdminRoute>
            <AdminWebhooks />
          </AdminRoute>
        } />
        
        <Route path="/documentacao" element={
          <AdminRoute>
            <Documentacao />
          </AdminRoute>
        } />
        
        <Route path="/arquitetura" element={
          <AdminRoute>
            <Arquitetura />
          </AdminRoute>
        } />
        
        <Route path="/modelo-dados" element={
          <AdminRoute>
            <ModeloDados />
          </AdminRoute>
        } />
        
        <Route path="/n8n-management" element={
          <AdminRoute>
            <N8nManagement />
          </AdminRoute>
        } />
        
        {/* User routes - require authentication but allow multiple roles */}
        <Route path="/client-dashboard" element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/pagamentos" element={
          <ProtectedRoute>
            <Pagamentos />
          </ProtectedRoute>
        } />
        
        <Route path="/pagamento-metodo" element={
          <ProtectedRoute>
            <PagamentoMetodo />
          </ProtectedRoute>
        } />
        
        <Route path="/integracoes" element={
          <ProtectedRoute>
            <Integracoes />
          </ProtectedRoute>
        } />
        
        <Route path="/agentes" element={
          <ProtectedRoute>
            <Agentes />
          </ProtectedRoute>
        } />
        
        <Route path="/crm" element={
          <ProtectedRoute>
            <CRM />
          </ProtectedRoute>
        } />
        
        <Route path="/fluxos" element={
          <ProtectedRoute>
            <Fluxos />
          </ProtectedRoute>
        } />
        
        <Route path="/subscription" element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        } />
        
        <Route path="/test-chat" element={
          <ProtectedRoute>
            <TestChat />
          </ProtectedRoute>
        } />
        
        {/* Catch all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
