
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getStatusColor, getStatusText } from "@/utils/integrationStatus";

interface Integration {
  id: number;
  name: string;
  description: string;
  icon: any;
  status: string;
  type: string;
  route?: string;
}

interface IntegrationCardProps {
  integration: Integration;
}

const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <integration.icon className="h-8 w-8 text-blue-600 mb-2" />
          <Badge className={getStatusColor(integration.status)}>
            {getStatusText(integration.status)}
          </Badge>
        </div>
        <CardTitle className="text-lg">{integration.name}</CardTitle>
        <CardDescription className="text-sm">
          {integration.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {integration.status === "available" && integration.route ? (
            <Link to={integration.route}>
              <Button className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </Link>
          ) : integration.status === "active" ? (
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
              <Button variant="ghost" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver logs
              </Button>
            </div>
          ) : (
            <Button disabled className="w-full">
              Em desenvolvimento
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
