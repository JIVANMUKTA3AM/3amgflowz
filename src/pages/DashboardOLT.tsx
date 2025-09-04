import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OLTDashboard from '@/components/monitoring/OLTDashboard';
import { useWorkflow } from '@/hooks/useWorkflow';

const DashboardOLT = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #FF6B35 0%, #8B5CF6 50%, #7C3AED 100%)'}}>
      <Header handleWorkflowTrigger={handleWorkflowTrigger} isLoading={workflowLoading} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <OLTDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardOLT;