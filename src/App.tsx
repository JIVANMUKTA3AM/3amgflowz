import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PasswordReset from './pages/PasswordReset';
import PasswordUpdate from './pages/PasswordUpdate';
import Agents from './pages/Agents';
import AgentDetail from './pages/AgentDetail';
import NewAgent from './pages/NewAgent';
import EditAgent from './pages/EditAgent';
import Invoices from './pages/Invoices';
import NewInvoice from './pages/NewInvoice';
import EditInvoice from './pages/EditInvoice';
import SubscriptionManagement from './pages/SubscriptionManagement';
import Payments from './pages/Payments';
import PaymentMethod from './pages/PaymentMethod';
import Webhooks from './pages/Webhooks';
import NewWebhook from './pages/NewWebhook';
import EditWebhook from './pages/EditWebhook';
import Workflow from './pages/Workflow';
import WebhookTesting from "@/pages/WebhookTesting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/password-update" element={<PasswordUpdate />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/:id" element={<AgentDetail />} />
        <Route path="/new-agent" element={<NewAgent />} />
        <Route path="/edit-agent/:id" element={<EditAgent />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/new-invoice" element={<NewInvoice />} />
        <Route path="/edit-invoice/:id" element={<EditInvoice />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="/pagamentos" element={<Payments />} />
        <Route path="/pagamento-metodo" element={<PaymentMethod />} />
        <Route path="/webhooks" element={<Webhooks />} />
        <Route path="/new-webhook" element={<NewWebhook />} />
        <Route path="/edit-webhook/:id" element={<EditWebhook />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/webhook-testing" element={<WebhookTesting />} />
      </Routes>
    </Router>
  );
}

export default App;
