
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="/webhook-testing" element={<WebhookTesting />} />
        <Route path="/pagamentos" element={<Pagamentos />} />
        <Route path="/pagamento-metodo" element={<PagamentoMetodo />} />
        <Route path="/integracoes" element={<Integracoes />} />
        <Route path="/agentes" element={<Agentes />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/fluxos" element={<Fluxos />} />
        <Route path="/database-management" element={<DatabaseManagement />} />
        <Route path="/admin-webhooks" element={<AdminWebhooks />} />
        <Route path="/documentacao" element={<Documentacao />} />
        <Route path="/arquitetura" element={<Arquitetura />} />
        <Route path="/modelo-dados" element={<ModeloDados />} />
        <Route path="/n8n-management" element={<N8nManagement />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/test-chat" element={<TestChat />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
