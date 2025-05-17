
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type WorkflowCardProps = {
  title: string;
  description: string;
  content: string;
  workflowType: string;
  handleWorkflowTrigger: (workflowType: string) => Promise<void>;
  isLoading: boolean;
  webhookUrl: string;
}

const WorkflowCard = ({
  title,
  description,
  content,
  workflowType,
  handleWorkflowTrigger,
  isLoading,
  webhookUrl,
}: WorkflowCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{content}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => handleWorkflowTrigger(workflowType)}
          disabled={isLoading || !webhookUrl}
          className="w-full"
        >
          Executar Workflow
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkflowCard;
