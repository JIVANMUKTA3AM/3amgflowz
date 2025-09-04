import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OLTDashboard from '@/components/monitoring/OLTDashboard';
import { useWorkflow } from '@/hooks/useWorkflow';

const DashboardOLT = () => {
  const { handleWorkflowTrigger, isLoading: workflowLoading } = useWorkflow();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
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