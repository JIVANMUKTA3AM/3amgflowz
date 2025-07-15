
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubscriptionManagement from './pages/SubscriptionManagement';
import WebhookTesting from "./pages/WebhookTesting";
import Pagamentos from './pages/Pagamentos';
import PagamentoMetodo from './pages/PagamentoMetodo';
import Integracoes from './pages/Integracoes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="/webhook-testing" element={<WebhookTesting />} />
        <Route path="/pagamentos" element={<Pagamentos />} />
        <Route path="/pagamento-metodo" element={<PagamentoMetodo />} />
        <Route path="/integracoes" element={<Integracoes />} />
      </Routes>
    </Router>
  );
}

export default App;
