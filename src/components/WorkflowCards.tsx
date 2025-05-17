
import WorkflowCard from "./WorkflowCard";

type WorkflowCardsProps = {
  handleWorkflowTrigger: (workflowType: string) => Promise<void>;
  isLoading: boolean;
  webhookUrl: string;
}

const WorkflowCards = ({ handleWorkflowTrigger, isLoading, webhookUrl }: WorkflowCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <WorkflowCard
        title="Processamento de Dados"
        description="Automação de ETL e manipulação de dados"
        content="Processe, transforme e carregue dados automaticamente entre diferentes sistemas com fluxos de trabalho personalizáveis."
        workflowType="processamento_dados"
        handleWorkflowTrigger={handleWorkflowTrigger}
        isLoading={isLoading}
        webhookUrl={webhookUrl}
      />
      
      <WorkflowCard
        title="Sistema de Notificação"
        description="Alertas e comunicações automatizadas"
        content="Configure notificações por e-mail, SMS ou webhooks baseadas em eventos ou em intervalos regulares."
        workflowType="notificacao"
        handleWorkflowTrigger={handleWorkflowTrigger}
        isLoading={isLoading}
        webhookUrl={webhookUrl}
      />
      
      <WorkflowCard
        title="Integração com APIs"
        description="Conecte serviços e plataformas externas"
        content="Integre com APIs de terceiros para sincronizar dados, processar pagamentos ou automatizar tarefas entre plataformas."
        workflowType="integracao"
        handleWorkflowTrigger={handleWorkflowTrigger}
        isLoading={isLoading}
        webhookUrl={webhookUrl}
      />
    </div>
  );
};

export default WorkflowCards;
