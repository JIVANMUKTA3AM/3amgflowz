
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SubscriptionManagement from './pages/SubscriptionManagement';
import WebhookTesting from "./pages/WebhookTesting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subscription-management" element={<SubscriptionManagement />} />
        <Route path="/webhook-testing" element={<WebhookTesting />} />
      </Routes>
    </Router>
  );
}

export default App;
