
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ModeloDados = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm py-4 mb-6">
        <div className="container mx-auto flex items-center px-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Modelo de Dados</h1>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="mb-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Estrutura do Banco de Dados</h2>
          <p className="text-gray-600 mb-6">
            O modelo de dados foi projetado para suportar os fluxos de trabalho do n8n,
            armazenar configurações, logs e dados de usuários. O banco utiliza PostgreSQL
            e segue práticas de normalização para garantir a integridade dos dados.
          </p>

          <Tabs defaultValue="diagrama" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="diagrama">Diagrama ER</TabsTrigger>
              <TabsTrigger value="tabelas">Tabelas</TabsTrigger>
              <TabsTrigger value="sql">SQL</TabsTrigger>
            </TabsList>

            <TabsContent value="diagrama" className="pt-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-center">Diagrama Entidade-Relacionamento</h3>
                <div className="border border-gray-300 p-6 rounded-lg bg-gray-50 overflow-auto">
                  <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`+----------------+     +---------------+     +----------------+
|    workflows   |     |    executions  |     |     nodes      |
+----------------+     +---------------+     +----------------+
| id             |<----| workflow_id   |     | id             |
| name           |     | id            |<----| execution_id   |
| active         |     | status        |     | type           |
| nodes          |     | start_time    |     | parameters     |
| connections    |     | end_time      |     | output         |
| triggers       |     | data          |     +----------------+
+----------------+     +---------------+
       ^                      |
       |                      |
       |                      v
+----------------+     +---------------+     +----------------+
|     users      |     |     logs      |     |   credentials  |
+----------------+     +---------------+     +----------------+
| id             |<----| user_id       |     | id             |
| name           |     | id            |     | name           |
| email          |     | level         |     | type           |
| role           |     | message       |     | data           |
| active         |     | timestamp     |     | user_id        |-----+
+----------------+     +---------------+     +----------------+     |
       ^                                            ^               |
       |                                            |               |
       |                                            |               |
       +--------------------------------------------+---------------+`}
                  </pre>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tabelas" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>workflows</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium">id</span>: UUID (PK)</li>
                      <li><span className="font-medium">name</span>: VARCHAR(200)</li>
                      <li><span className="font-medium">active</span>: BOOLEAN</li>
                      <li><span className="font-medium">nodes</span>: JSONB</li>
                      <li><span className="font-medium">connections</span>: JSONB</li>
                      <li><span className="font-medium">triggers</span>: JSONB</li>
                      <li><span className="font-medium">created_at</span>: TIMESTAMP</li>
                      <li><span className="font-medium">updated_at</span>: TIMESTAMP</li>
                      <li><span className="font-medium">user_id</span>: UUID (FK)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>executions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium">id</span>: UUID (PK)</li>
                      <li><span className="font-medium">workflow_id</span>: UUID (FK)</li>
                      <li><span className="font-medium">status</span>: VARCHAR(20)</li>
                      <li><span className="font-medium">start_time</span>: TIMESTAMP</li>
                      <li><span className="font-medium">end_time</span>: TIMESTAMP</li>
                      <li><span className="font-medium">data</span>: JSONB</li>
                      <li><span className="font-medium">error</span>: TEXT</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>nodes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium">id</span>: UUID (PK)</li>
                      <li><span className="font-medium">execution_id</span>: UUID (FK)</li>
                      <li><span className="font-medium">name</span>: VARCHAR(200)</li>
                      <li><span className="font-medium">type</span>: VARCHAR(100)</li>
                      <li><span className="font-medium">parameters</span>: JSONB</li>
                      <li><span className="font-medium">output</span>: JSONB</li>
                      <li><span className="font-medium">start_time</span>: TIMESTAMP</li>
                      <li><span className="font-medium">end_time</span>: TIMESTAMP</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium">id</span>: UUID (PK)</li>
                      <li><span className="font-medium">name</span>: VARCHAR(200)</li>
                      <li><span className="font-medium">email</span>: VARCHAR(200)</li>
                      <li><span className="font-medium">role</span>: VARCHAR(50)</li>
                      <li><span className="font-medium">active</span>: BOOLEAN</li>
                      <li><span className="font-medium">created_at</span>: TIMESTAMP</li>
                      <li><span className="font-medium">last_login</span>: TIMESTAMP</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>credentials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium">id</span>: UUID (PK)</li>
                      <li><span className="font-medium">name</span>: VARCHAR(200)</li>
                      <li><span className="font-medium">type</span>: VARCHAR(100)</li>
                      <li><span className="font-medium">data</span>: JSONB</li>
                      <li><span className="font-medium">user_id</span>: UUID (FK)</li>
                      <li><span className="font-medium">created_at</span>: TIMESTAMP</li>
                      <li><span className="font-medium">updated_at</span>: TIMESTAMP</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li><span className="font-medium">id</span>: UUID (PK)</li>
                      <li><span className="font-medium">level</span>: VARCHAR(20)</li>
                      <li><span className="font-medium">message</span>: TEXT</li>
                      <li><span className="font-medium">timestamp</span>: TIMESTAMP</li>
                      <li><span className="font-medium">user_id</span>: UUID (FK)</li>
                      <li><span className="font-medium">execution_id</span>: UUID (FK)</li>
                      <li><span className="font-medium">metadata</span>: JSONB</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sql" className="pt-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Código SQL de Criação</h3>
                <div className="border border-gray-300 rounded-lg bg-gray-50">
                  <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Workflows table
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  connections JSONB NOT NULL DEFAULT '[]'::jsonb,
  triggers JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Executions table
CREATE TABLE executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  data JSONB,
  error TEXT
);

-- Nodes table
CREATE TABLE nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL,
  parameters JSONB,
  output JSONB,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE
);

-- Credentials table
CREATE TABLE credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Logs table
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  execution_id UUID REFERENCES executions(id) ON DELETE SET NULL,
  metadata JSONB
);

-- Create indexes
CREATE INDEX idx_workflows_user_id ON workflows(user_id);
CREATE INDEX idx_executions_workflow_id ON executions(workflow_id);
CREATE INDEX idx_nodes_execution_id ON nodes(execution_id);
CREATE INDEX idx_credentials_user_id ON credentials(user_id);
CREATE INDEX idx_logs_user_id ON logs(user_id);
CREATE INDEX idx_logs_execution_id ON logs(execution_id);
CREATE INDEX idx_logs_timestamp ON logs(timestamp);`}
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Relações entre tabelas */}
          <h3 className="text-2xl font-bold mb-4">Relações entre Tabelas</h3>
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <ul className="list-disc pl-5 space-y-3">
              <li className="text-gray-700">
                <span className="font-medium">workflows → users</span>: Cada workflow pertence a um usuário
                que o criou. A relação é implementada através da chave estrangeira <code>user_id</code> na tabela
                <code>workflows</code>.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">executions → workflows</span>: Cada execução está relacionada a um
                workflow específico. A relação é implementada através da chave estrangeira <code>workflow_id</code> na tabela
                <code>executions</code>.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">nodes → executions</span>: Cada nó pertence a uma execução específica.
                A relação é implementada através da chave estrangeira <code>execution_id</code> na tabela <code>nodes</code>.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">credentials → users</span>: Cada credencial pertence a um usuário.
                A relação é implementada através da chave estrangeira <code>user_id</code> na tabela <code>credentials</code>.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">logs → users</span>: Os logs podem estar associados a usuários específicos.
                A relação é implementada através da chave estrangeira <code>user_id</code> na tabela <code>logs</code>.
              </li>
              <li className="text-gray-700">
                <span className="font-medium">logs → executions</span>: Os logs podem estar associados a execuções específicas.
                A relação é implementada através da chave estrangeira <code>execution_id</code> na tabela <code>logs</code>.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between max-w-4xl mx-auto">
          <Link to="/arquitetura">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft size={16} className="mr-2" /> Arquitetura
            </Button>
          </Link>
          <Link to="/documentacao">
            <Button className="flex items-center">
              Documentação <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ModeloDados;
