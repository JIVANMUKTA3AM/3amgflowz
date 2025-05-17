
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Documentacao = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm py-4 mb-6">
        <div className="container mx-auto flex items-center px-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Documentação</h1>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="mb-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Documentação do Sistema n8n</h2>
          <p className="text-gray-600 mb-6">
            Esta documentação fornece informações sobre como configurar, usar e estender
            o sistema de automação baseado em n8n. Ela inclui exemplos de fluxos de trabalho,
            integração com APIs externas e melhores práticas.
          </p>

          <Tabs defaultValue="fluxos" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fluxos">Fluxos de Trabalho</TabsTrigger>
              <TabsTrigger value="config">Configuração</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="fluxos" className="pt-4">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Fluxos de Trabalho</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-2">Fluxo de Processamento de Dados</h4>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`// Pseudocódigo para um fluxo de processamento de dados
name: "Processamento de Dados"
trigger:
  type: "webhook"
  endpoint: "/data-processing"
  method: "POST"
  
nodes:
  # 1. Receber dados
  - id: "receiveData"
    type: "webhook"
    parameters:
      content: "{{ $trigger.body }}"
    
  # 2. Validar e transformar dados
  - id: "processData"
    type: "function"
    parameters:
      code: |
        const data = $node.receiveData.output.data;
        // Validação e transformação dos dados
        return {
          processed: true,
          result: transformedData,
          timestamp: new Date().toISOString()
        };
      
  # 3. Armazenar no banco de dados
  - id: "storeData"
    type: "databaseQuery"
    parameters:
      operation: "insert"
      table: "processed_data"
      data: "{{ $node.processData.output }}"
      
  # 4. Notificar resultado
  - id: "notifyResult"
    type: "telegram"
    parameters:
      message: "Dados processados com sucesso. Total: {{ $node.processData.output.result.length }}"
      chatId: "12345"
`}
                    </pre>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-2">Fluxo de Notificação Automática</h4>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`// Pseudocódigo para um fluxo de notificação
name: "Sistema de Notificação"
trigger:
  type: "schedule"
  cron: "0 9 * * *"  # Todos os dias às 9h
  
nodes:
  # 1. Buscar dados pendentes
  - id: "fetchPendingItems"
    type: "databaseQuery"
    parameters:
      operation: "select"
      table: "tasks"
      where: 
        status: "pending"
        due_date: "<= NOW() + INTERVAL '1 day'"
    
  # 2. Para cada item pendente
  - id: "processItems"
    type: "loop"
    parameters:
      items: "{{ $node.fetchPendingItems.output.data }}"
      
  # 3. Buscar dados do usuário
  - id: "getUserData"
    type: "databaseQuery"
    parameters:
      operation: "select"
      table: "users"
      where:
        id: "{{ $node.processItems.output.currentItem.user_id }}"
        
  # 4. Enviar e-mail de notificação
  - id: "sendEmail"
    type: "email"
    parameters:
      to: "{{ $node.getUserData.output.data[0].email }}"
      subject: "Lembrete: Tarefa pendente"
      text: "Olá {{ $node.getUserData.output.data[0].name }}, você tem a tarefa '{{ $node.processItems.output.currentItem.title }}' com vencimento próximo."
`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Fluxo de Integração com APIs Externas</h4>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`// Pseudocódigo para integração com APIs
name: "Integração com APIs"
trigger:
  type: "webhook"
  endpoint: "/api-integration"
  
nodes:
  # 1. Receber solicitação
  - id: "receiveRequest"
    type: "webhook"
    
  # 2. Buscar dados de autenticação
  - id: "getCredentials"
    type: "databaseQuery"
    parameters:
      operation: "select"
      table: "credentials"
      where:
        type: "api_service"
        active: true
        
  # 3. Chamar API externa
  - id: "callExternalAPI"
    type: "httpRequest"
    parameters:
      url: "https://api.example.com/data"
      method: "GET"
      headers:
        Authorization: "Bearer {{ $node.getCredentials.output.data[0].token }}"
        
  # 4. Processar resposta
  - id: "processResponse"
    type: "function"
    parameters:
      code: |
        const response = $node.callExternalAPI.output;
        // Processar e transformar dados da resposta
        return {
          processed: true,
          data: transformedData
        };
        
  # 5. Retornar resultado
  - id: "returnResult"
    type: "respondToWebhook"
    parameters:
      data: "{{ $node.processResponse.output.data }}"
`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="config" className="pt-4">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Configuração do Sistema</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-2">Configuração do n8n</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    O n8n deve ser configurado com as seguintes variáveis de ambiente para 
                    integração com o sistema:
                  </p>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`# Arquivo .env para configuração do n8n
N8N_PORT=5678
N8N_PROTOCOL=https
N8N_HOST=n8n.example.com
N8N_PATH=/
N8N_ENCRYPTION_KEY=your-secure-encryption-key-here

# Configuração do banco de dados
N8N_DB_TYPE=postgresdb
N8N_DB_POSTGRESDB_HOST=postgres.example.com
N8N_DB_POSTGRESDB_PORT=5432
N8N_DB_POSTGRESDB_DATABASE=n8n
N8N_DB_POSTGRESDB_USER=n8n_user
N8N_DB_POSTGRESDB_PASSWORD=your-secure-db-password

# Configuração de e-mail
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.example.com
N8N_SMTP_PORT=587
N8N_SMTP_USER=notifications@example.com
N8N_SMTP_PASS=your-secure-smtp-password

# Configurações gerais
N8N_EDITOR_BASE_URL=https://n8n.example.com
N8N_DISABLE_PRODUCTION_MAIN_PROCESS=false
N8N_USER_MANAGEMENT_DISABLED=false
N8N_DIAGNOSTICS_ENABLED=true
N8N_HIRING_BANNER_ENABLED=false
N8N_PERSONALIZATION_ENABLED=true`}
                    </pre>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-2">Configuração de Webhooks</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Para configurar os webhooks que conectam a aplicação web com o n8n, 
                    use as seguintes URLs:
                  </p>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`# URLs de Webhook para integração

# Webhook para processamento de dados
https://n8n.example.com/webhook/data-processing

# Webhook para sistema de notificação
https://n8n.example.com/webhook/notification

# Webhook para integração com APIs
https://n8n.example.com/webhook/api-integration

# Parâmetros de segurança recomendados para todos os webhooks:
# - Adicionar um cabeçalho de autenticação
# - Usar HTTPS para todas as comunicações
# - Validar a origem das solicitações
# - Implementar limite de taxa para evitar abusos`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Configuração de Credenciais</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    As credenciais para APIs externas devem ser armazenadas com segurança:
                  </p>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`# Exemplo de inserção de credencial no banco de dados
INSERT INTO credentials (name, type, data, user_id) VALUES (
  'API Service Credentials',
  'api_service',
  '{
    "apiKey": "your-encrypted-api-key",
    "baseUrl": "https://api.example.com",
    "timeout": 30000
  }'::jsonb,
  'user-uuid-here'
);

# Nota: Nunca armazene senhas ou chaves em texto puro
# Use o sistema de gerenciamento de credenciais do n8n`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="api" className="pt-4">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Documentação da API</h3>
                
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-2">Endpoints de API</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    O sistema expõe as seguintes APIs REST para integração com outros serviços:
                  </p>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`# API REST Endpoints

# Workflows
GET /api/v1/workflows
  - Lista todos os workflows
  - Parâmetros: ?active=true/false&user_id=uuid
  - Retorno: Array de objetos workflow

GET /api/v1/workflows/:id
  - Obtém detalhes de um workflow específico
  - Retorno: Objeto workflow completo

POST /api/v1/workflows
  - Cria um novo workflow
  - Corpo: Objeto workflow (name, nodes, connections, triggers)
  - Retorno: Objeto workflow criado com ID

PUT /api/v1/workflows/:id
  - Atualiza um workflow existente
  - Corpo: Objeto workflow (parcial ou completo)
  - Retorno: Objeto workflow atualizado

DELETE /api/v1/workflows/:id
  - Remove um workflow
  - Retorno: Status 204 No Content

# Execuções
GET /api/v1/executions
  - Lista execuções de workflows
  - Parâmetros: ?workflow_id=uuid&status=pending/running/completed/error
  - Retorno: Array de objetos execution

POST /api/v1/executions
  - Inicia uma execução de workflow
  - Corpo: { workflow_id: uuid, data: {} }
  - Retorno: Objeto execution com status inicial

GET /api/v1/executions/:id
  - Obtém detalhes de uma execução específica
  - Retorno: Objeto execution com detalhes e nós

# Webhooks
POST /webhook/:endpoint
  - Endpoint para receber eventos externos
  - Corpo: Depende do tipo de webhook
  - Retorno: Status 200 ou resposta específica do workflow`}
                    </pre>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-2">Exemplos de Uso da API</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Exemplos de como usar a API REST para interagir com o sistema:
                  </p>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`// Exemplo em JavaScript para iniciar a execução de um workflow

// 1. Autenticação
const getToken = async () => {
  const response = await fetch('https://api.example.com/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'secure-password'
    })
  });
  
  const data = await response.json();
  return data.token;
};

// 2. Executar um workflow
const executeWorkflow = async (workflowId, inputData) => {
  const token = await getToken();
  
  const response = await fetch('https://api.example.com/api/v1/executions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${token}\`
    },
    body: JSON.stringify({
      workflow_id: workflowId,
      data: inputData
    })
  });
  
  const executionData = await response.json();
  return executionData;
};

// 3. Verificar status da execução
const checkExecutionStatus = async (executionId) => {
  const token = await getToken();
  
  const response = await fetch(\`https://api.example.com/api/v1/executions/\${executionId}\`, {
    headers: {
      'Authorization': \`Bearer \${token}\`
    }
  });
  
  const statusData = await response.json();
  return statusData;
};

// Uso
executeWorkflow('workflow-uuid-here', { 
  customer_id: '12345',
  action: 'process_payment',
  amount: 99.99
})
.then(execution => {
  console.log('Execution started:', execution.id);
  
  // Verificar status após alguns segundos
  setTimeout(() => {
    checkExecutionStatus(execution.id)
      .then(status => console.log('Execution status:', status));
  }, 5000);
})
.catch(error => console.error('Error:', error));`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">Autenticação e Segurança</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    A API usa autenticação JWT para proteger os endpoints:
                  </p>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <pre className="text-xs md:text-sm overflow-auto p-4 bg-gray-800 text-white rounded-md">
{`# Segurança da API

# 1. Autenticação
- Todas as requisições à API devem incluir um token JWT válido
- O token deve ser enviado no cabeçalho Authorization como "Bearer [token]"
- Tokens expiram após 24 horas e precisam ser renovados

# 2. Endpoints de Autenticação
POST /auth/token
  - Gera um novo token de acesso
  - Corpo: { username, password }
  - Retorno: { token, expires_at }

POST /auth/refresh
  - Renova um token existente
  - Corpo: { refresh_token }
  - Retorno: { token, refresh_token, expires_at }

# 3. Permissões e Papéis
- As APIs respeitam o modelo de permissão baseado em papéis
- Papéis disponíveis: admin, manager, user
- Cada endpoint requer permissões específicas
- O token JWT contém as informações de permissão do usuário

# 4. Boas Práticas de Segurança
- Use HTTPS para todas as comunicações com a API
- Nunca armazene tokens JWT em localStorage
- Implemente expiração curta para tokens
- Use limites de taxa para evitar ataques de força bruta
- Valide todos os dados de entrada para evitar injeção`}
                    </pre>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-between max-w-4xl mx-auto">
          <Link to="/modelo-dados">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft size={16} className="mr-2" /> Modelo de Dados
            </Button>
          </Link>
          <Link to="/">
            <Button>Página Inicial</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Documentacao;
