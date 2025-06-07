
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Settings, Calendar } from "lucide-react";
import { Organization } from "@/hooks/useOrganizations";

interface OrganizationCardProps {
  organization: Organization;
  memberCount?: number;
  userRole?: string;
  onManage?: () => void;
}

const OrganizationCard = ({ 
  organization, 
  memberCount = 0, 
  userRole = 'member',
  onManage 
}: OrganizationCardProps) => {
  const getRoleBadge = (role: string) => {
    const variants = {
      owner: "default",
      admin: "secondary", 
      member: "outline"
    } as const;
    
    return (
      <Badge variant={variants[role as keyof typeof variants] || "outline"}>
        {role === 'owner' ? 'Proprietário' : role === 'admin' ? 'Admin' : 'Membro'}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{organization.name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            Criada em {new Date(organization.created_at).toLocaleDateString('pt-BR')}
          </div>
        </div>
        {getRoleBadge(userRole)}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-1" />
            {memberCount} {memberCount === 1 ? 'membro' : 'membros'}
          </div>
          
          {(userRole === 'owner' || userRole === 'admin') && onManage && (
            <Button variant="outline" size="sm" onClick={onManage}>
              <Settings className="w-4 h-4 mr-1" />
              Gerenciar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrganizationCard;
