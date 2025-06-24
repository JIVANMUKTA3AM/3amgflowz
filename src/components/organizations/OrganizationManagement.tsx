
import { useState } from "react";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Plus, Users, Settings, UserPlus, Crown, Shield, User } from "lucide-react";

const OrganizationManagement = () => {
  const { organizations, memberships, isLoading, createOrganization, isCreating, inviteMember, isInviting } = useOrganizations();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const handleCreateOrganization = () => {
    if (newOrgName.trim()) {
      createOrganization({ name: newOrgName.trim() });
      setNewOrgName('');
      setShowCreateDialog(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin': return <Shield className="h-4 w-4 text-blue-600" />;
      case 'member': return <User className="h-4 w-4 text-gray-600" />;
      default: return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Carregando organizações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Organizações</h2>
          <p className="text-gray-600">Configure sua empresa e gerencie membros</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Criar Organização
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Organização</DialogTitle>
              <DialogDescription>
                Crie uma organização para gerenciar agentes e membros da sua empresa
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="org-name">Nome da Organização</Label>
                <Input
                  id="org-name"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="Ex: Minha Empresa Ltda"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateOrganization} disabled={isCreating || !newOrgName.trim()}>
                  {isCreating ? 'Criando...' : 'Criar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {organizations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma organização encontrada</h3>
            <p className="text-gray-600 mb-4">
              Crie sua primeira organização para começar a gerenciar agentes e colaboradores
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Organização
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Organizações */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Suas Organizações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedOrg === org.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedOrg(org.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{org.name}</h4>
                        <p className="text-sm text-gray-600">
                          Criada em {new Date(org.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Ativa
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Detalhes da Organização Selecionada */}
          <div className="lg:col-span-2">
            {selectedOrg ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Membros da Organização</CardTitle>
                    <CardDescription>
                      Gerencie quem tem acesso aos agentes desta organização
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          {memberships.filter(m => m.organization_id === selectedOrg).length} membros
                        </span>
                      </div>
                      <Button size="sm" className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Convidar Membro
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Membro</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead>Data de Entrada</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {memberships
                          .filter(membership => membership.organization_id === selectedOrg)
                          .map((membership) => (
                            <TableRow key={membership.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {getRoleIcon(membership.role)}
                                  <span>{membership.user_id}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getRoleBadgeColor(membership.role)}>
                                  {membership.role === 'owner' ? 'Proprietário' :
                                   membership.role === 'admin' ? 'Administrador' : 'Membro'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(membership.created_at).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configurações da Organização</CardTitle>
                    <CardDescription>
                      Configure limites e permissões da organização
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Limite de Agentes</Label>
                        <Input value="10" readOnly />
                        <p className="text-xs text-gray-500 mt-1">
                          Baseado no seu plano atual
                        </p>
                      </div>
                      <div>
                        <Label>Limite de API Calls/mês</Label>
                        <Input value="50.000" readOnly />
                        <p className="text-xs text-gray-500 mt-1">
                          Renovado mensalmente
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button variant="outline" className="mr-2">
                        Editar Organização
                      </Button>
                      <Button variant="destructive">
                        Excluir Organização
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Selecione uma organização</h3>
                  <p className="text-gray-600">
                    Escolha uma organização à esquerda para ver detalhes e gerenciar membros
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement;
