import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Shield,
  Database,
  Brain,
  Server,
  Code2,
  Clock,
  Tag,
  ChevronRight,
  ArrowLeft,
  Layers,
  Lock,
  Zap,
  Network,
  GitBranch,
  TestTube,
  Container,
  BarChart3,
  Eye,
  RefreshCw,
  Workflow,
  Bot,
  Radio,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ModernHeader from "@/components/3amg/ModernHeader";
import Footer from "@/components/Footer";

type Difficulty = "Básico" | "Intermediário" | "Avançado";

interface Article {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  readTime: string;
  tags: string[];
  updatedAt: string;
  featured?: boolean;
  category: string;
  sections: { title: string; content: string; code?: string }[];
}

const categories = [
  {
    id: "architecture",
    title: "Arquitetura do Sistema",
    description: "Infraestrutura, backend, frontend, APIs, microserviços e escalabilidade",
    icon: Layers,
    gradient: "from-blue-500/20 to-blue-600/5",
    borderColor: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    id: "security",
    title: "Segurança e Proteção",
    description: "Autenticação, criptografia, RLS, isolamento de dados e auditoria",
    icon: Shield,
    gradient: "from-emerald-500/20 to-emerald-600/5",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    id: "database",
    title: "Banco de Dados e Performance",
    description: "Modelagem, indexação, queries otimizadas, replicação e caching",
    icon: Database,
    gradient: "from-purple-500/20 to-purple-600/5",
    borderColor: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    id: "automation",
    title: "Automação e Inteligência",
    description: "Agentes inteligentes, fluxos automatizados e processamento real-time",
    icon: Brain,
    gradient: "from-pink-500/20 to-pink-600/5",
    borderColor: "border-pink-500/30",
    iconColor: "text-pink-400",
  },
  {
    id: "devops",
    title: "DevOps e Infraestrutura",
    description: "Deploy contínuo, monitoramento, observabilidade e containers",
    icon: Server,
    gradient: "from-orange-500/20 to-orange-600/5",
    borderColor: "border-orange-500/30",
    iconColor: "text-orange-400",
  },
  {
    id: "practices",
    title: "Boas Práticas de Engenharia",
    description: "Padrões de código, versionamento, testes e segurança by design",
    icon: Code2,
    gradient: "from-cyan-500/20 to-cyan-600/5",
    borderColor: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
];

const articles: Article[] = [
  // Architecture
  {
    id: "arch-overview",
    title: "Como funciona a arquitetura do sistema",
    description: "Visão geral da arquitetura distribuída da plataforma 3AMG Flowz, cobrindo frontend, backend, edge functions e orquestração de agentes.",
    difficulty: "Intermediário",
    readTime: "12 min",
    tags: ["Supabase", "React", "Edge Functions", "PostgreSQL"],
    updatedAt: "2026-02-10",
    featured: true,
    category: "architecture",
    sections: [
      {
        title: "Visão Geral",
        content: "A plataforma 3AMG Flowz utiliza uma arquitetura serverless baseada em Supabase, com frontend React/Vite e Edge Functions Deno para lógica de backend. A comunicação entre camadas é feita via REST e Realtime subscriptions.",
      },
      {
        title: "Frontend Layer",
        content: "O frontend é construído com React 18, TypeScript, Tailwind CSS e shadcn/ui. Utilizamos TanStack Query para gerenciamento de estado servidor e React Router para navegação SPA.",
        code: `// Stack principal do frontend
React 18 + TypeScript
Vite (build tool)
Tailwind CSS + shadcn/ui
TanStack Query v5
React Router v6
Framer Motion (animações)`,
      },
      {
        title: "Backend Layer",
        content: "O backend é totalmente serverless, utilizando Supabase Edge Functions (Deno runtime) para processamento, PostgreSQL como banco de dados principal com Row Level Security, e Supabase Auth para autenticação.",
      },
      {
        title: "Orquestração",
        content: "Agentes inteligentes são orquestrados via edge functions dedicadas (agents-route, agents-execute) que processam mensagens, aplicam regras de roteamento e executam workflows configurados.",
      },
    ],
  },
  {
    id: "arch-multi-tenant",
    title: "Isolamento Multi-Tenant",
    description: "Como garantimos o isolamento completo de dados entre provedores usando RLS e tenant_id em todas as tabelas.",
    difficulty: "Avançado",
    readTime: "8 min",
    tags: ["Multi-tenant", "RLS", "PostgreSQL", "Segurança"],
    updatedAt: "2026-02-08",
    category: "architecture",
    sections: [
      {
        title: "Modelo Multi-Tenant",
        content: "Cada provedor (ISP) opera em um tenant isolado. Todas as tabelas de dados possuem a coluna tenant_id, e políticas RLS garantem que cada usuário acesse apenas dados do seu tenant.",
        code: `-- Exemplo de política RLS multi-tenant
CREATE POLICY "tenant_isolation" ON public.agent_profiles
  FOR ALL USING (
    tenant_id = (
      SELECT tenant_id FROM public.user_profiles
      WHERE user_id = auth.uid()
    )
  );`,
      },
    ],
  },
  // Security
  {
    id: "sec-rls",
    title: "Como implementamos Row Level Security (RLS)",
    description: "Detalhamento completo da implementação de RLS em todas as tabelas do sistema, garantindo segurança no nível do banco de dados.",
    difficulty: "Avançado",
    readTime: "15 min",
    tags: ["RLS", "PostgreSQL", "Supabase", "Segurança"],
    updatedAt: "2026-02-12",
    featured: true,
    category: "security",
    sections: [
      {
        title: "O que é RLS",
        content: "Row Level Security (RLS) é uma funcionalidade do PostgreSQL que permite definir políticas de acesso no nível de cada linha da tabela. Isso significa que mesmo que um usuário tenha acesso à tabela, ele só verá as linhas que suas políticas permitem.",
      },
      {
        title: "Implementação no 3AMG",
        content: "Todas as tabelas com dados de usuário possuem RLS habilitado. As políticas verificam o auth.uid() para garantir que cada usuário acesse apenas seus próprios dados.",
        code: `-- Habilitando RLS
ALTER TABLE public.agent_configurations
  ENABLE ROW LEVEL SECURITY;

-- Política de leitura
CREATE POLICY "Users can view own configs"
  ON public.agent_configurations
  FOR SELECT USING (auth.uid() = user_id);

-- Política de escrita
CREATE POLICY "Users can insert own configs"
  ON public.agent_configurations
  FOR INSERT WITH CHECK (auth.uid() = user_id);`,
      },
      {
        title: "Benefícios",
        content: "Com RLS, a segurança é enforced no nível do banco de dados, independente de bugs no frontend ou backend. Mesmo que um endpoint seja comprometido, os dados de outros usuários permanecem protegidos.",
      },
    ],
  },
  {
    id: "sec-auth",
    title: "Autenticação e controle de acesso",
    description: "Sistema de autenticação via Supabase Auth com suporte a email/senha, OAuth e controle de roles.",
    difficulty: "Intermediário",
    readTime: "10 min",
    tags: ["Auth", "JWT", "OAuth", "RBAC"],
    updatedAt: "2026-02-05",
    featured: true,
    category: "security",
    sections: [
      {
        title: "Supabase Auth",
        content: "Utilizamos Supabase Auth para gerenciamento completo de autenticação. Suporta login via email/senha com verificação, reset de senha e tokens JWT automaticamente gerenciados.",
      },
      {
        title: "Role-Based Access",
        content: "O sistema possui roles hierárquicos (admin, provider, client) que determinam acesso a funcionalidades e dashboards específicos. A verificação é feita tanto no frontend (routing) quanto no backend (RLS policies).",
      },
    ],
  },
  {
    id: "sec-data-protection",
    title: "Proteção de dados dos clientes",
    description: "Camadas de proteção de dados sensíveis incluindo criptografia, sanitização e compliance.",
    difficulty: "Intermediário",
    readTime: "7 min",
    tags: ["Criptografia", "LGPD", "Dados Sensíveis"],
    updatedAt: "2026-01-28",
    featured: true,
    category: "security",
    sections: [
      {
        title: "Criptografia em Trânsito",
        content: "Todas as comunicações são feitas via HTTPS/TLS. As conexões com o banco de dados são criptografadas end-to-end via Supabase.",
      },
      {
        title: "Sanitização de Dados",
        content: "Inputs do usuário passam por validação com Zod schemas antes de serem processados. Queries parametrizadas previnem SQL injection.",
      },
    ],
  },
  // Database
  {
    id: "db-modeling",
    title: "Modelagem de dados da plataforma",
    description: "Estrutura do banco de dados com mais de 50 tabelas, relacionamentos, índices e estratégias de performance.",
    difficulty: "Avançado",
    readTime: "20 min",
    tags: ["PostgreSQL", "Schema", "Modelagem", "Índices"],
    updatedAt: "2026-02-14",
    category: "database",
    sections: [
      {
        title: "Visão Geral do Schema",
        content: "O banco possui 54+ tabelas organizadas em domínios: Agentes, Autenticação, Billing, CRM, Monitoramento, Workflows e Configurações. Cada domínio é projetado para operar de forma independente com referências cruzadas mínimas.",
      },
      {
        title: "Tabelas Principais",
        content: "As tabelas core incluem: tenants (provedores), agent_profiles (agentes IA), agent_configurations, olt_configurations, invoices, e service_sessions para o modelo de billing por consumo.",
        code: `-- Exemplo: Tabela de sessões de serviço
CREATE TABLE service_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  agent_id UUID REFERENCES agent_profiles(id),
  channel TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  token_count INTEGER DEFAULT 0,
  cost_estimate NUMERIC(10,4)
);`,
      },
    ],
  },
  // Automation
  {
    id: "auto-agents",
    title: "Estrutura dos agentes inteligentes",
    description: "Como os agentes de IA são configurados, treinados e executados para atendimento automatizado via WhatsApp e webchat.",
    difficulty: "Intermediário",
    readTime: "14 min",
    tags: ["IA", "Agentes", "LLM", "WhatsApp"],
    updatedAt: "2026-02-11",
    featured: true,
    category: "automation",
    sections: [
      {
        title: "Tipos de Agentes",
        content: "A plataforma suporta 4 tipos de agentes: Triagem (classificação inicial), Técnico (suporte de rede), Comercial (vendas e planos) e Financeiro (cobranças e pagamentos). Cada tipo tem prompts e configurações específicas.",
      },
      {
        title: "Fluxo de Execução",
        content: "1) Mensagem chega via webhook (WhatsApp/Telegram)\n2) Edge function agents-route identifica o tenant e seleciona o agente\n3) agents-execute processa com o LLM configurado\n4) Resposta é enviada de volta pelo canal de origem",
      },
      {
        title: "Configuração",
        content: "Cada agente pode ser configurado com: modelo de IA (GPT-4, Claude, Gemini), temperatura, max_tokens, prompt personalizado e integrações com sistemas externos.",
        code: `// Configuração de agente
{
  "name": "Agente Técnico ISP",
  "type": "tecnico",
  "model": "gpt-4o-mini",
  "temperature": 0.3,
  "max_tokens": 2048,
  "prompt": "Você é um assistente técnico...",
  "integrations": ["olt_monitoring", "snmp"]
}`,
      },
    ],
  },
  // DevOps
  {
    id: "devops-deploy",
    title: "Pipeline de deploy contínuo",
    description: "Processo automatizado de build, teste e deploy da plataforma com zero downtime.",
    difficulty: "Intermediário",
    readTime: "8 min",
    tags: ["CI/CD", "Deploy", "Vite", "Supabase"],
    updatedAt: "2026-02-01",
    category: "devops",
    sections: [
      {
        title: "Build Pipeline",
        content: "O frontend é compilado com Vite, gerando bundles otimizados com code splitting automático. Edge functions são deployadas independentemente via Supabase CLI.",
      },
      {
        title: "Monitoramento",
        content: "Logs de edge functions, métricas de banco de dados e analytics de uso são monitorados em tempo real via Supabase Dashboard e ferramentas customizadas.",
      },
    ],
  },
  {
    id: "devops-observability",
    title: "Observabilidade e monitoramento",
    description: "Stack de observabilidade para monitoramento de infraestrutura, performance e detecção de anomalias.",
    difficulty: "Avançado",
    readTime: "11 min",
    tags: ["Logs", "Métricas", "Alertas", "Telemetria"],
    updatedAt: "2026-02-09",
    category: "devops",
    sections: [
      {
        title: "Coleta de Métricas",
        content: "O sistema coleta métricas de token usage, tempo de resposta dos agentes, latência de queries e health check de OLTs/ONTs. Dados são agregados na tabela usage_aggregates para billing e dashboards.",
      },
    ],
  },
  // Best Practices
  {
    id: "bp-code-standards",
    title: "Padrões de código e arquitetura",
    description: "Convenções de código, estrutura de componentes, hooks customizados e patterns utilizados no projeto.",
    difficulty: "Básico",
    readTime: "6 min",
    tags: ["TypeScript", "React", "Patterns", "Clean Code"],
    updatedAt: "2026-01-20",
    category: "practices",
    sections: [
      {
        title: "Estrutura de Componentes",
        content: "Componentes seguem o padrão de separação por domínio: /components/agents, /components/client, /components/monitoring, etc. Cada componente é focado e pequeno, com lógica extraída para hooks customizados.",
        code: `// Estrutura de diretórios
src/
├── components/
│   ├── ui/          # shadcn/ui base
│   ├── agents/      # Componentes de agentes
│   ├── client/      # Dashboard do cliente
│   ├── monitoring/  # Monitoramento
│   └── 3amg/        # Landing page
├── hooks/           # Custom hooks
├── pages/           # Páginas/rotas
├── services/        # Lógica de negócio
└── utils/           # Utilitários`,
      },
    ],
  },
  {
    id: "bp-security-design",
    title: "Segurança por design",
    description: "Princípios de segurança aplicados desde o design até a implementação de cada funcionalidade.",
    difficulty: "Intermediário",
    readTime: "9 min",
    tags: ["Security by Design", "OWASP", "Validação"],
    updatedAt: "2026-02-03",
    category: "practices",
    sections: [
      {
        title: "Princípios Fundamentais",
        content: "1) Least Privilege: cada componente tem acesso mínimo necessário\n2) Defense in Depth: múltiplas camadas de proteção\n3) Fail Secure: falhas resultam em negação de acesso\n4) Input Validation: todos os inputs são validados com Zod",
      },
    ],
  },
];

const difficultyColors: Record<Difficulty, string> = {
  "Básico": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Intermediário": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Avançado": "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const categoryIcons: Record<string, React.ElementType> = {
  architecture: Layers,
  security: Shield,
  database: Database,
  automation: Brain,
  devops: Server,
  practices: Code2,
};

const Conhecimento = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeSection, setActiveSection] = useState(0);

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [search, selectedCategory]);

  const featuredArticles = articles.filter((a) => a.featured);

  // Article detail view
  if (selectedArticle) {
    return (
      <div className="min-h-screen">
        <ModernHeader />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex gap-8">
              {/* Sidebar navigation */}
              <aside className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-28 space-y-2">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-2 text-sm text-blue-300/70 hover:text-white transition-colors mb-6"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar aos artigos
                  </button>
                  <p className="text-xs uppercase tracking-wider text-blue-300/60 mb-3 font-semibold">
                    Índice
                  </p>
                  {selectedArticle.sections.map((sec, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSection(i)}
                      className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        activeSection === i
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "text-blue-200/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {sec.title}
                    </button>
                  ))}
                </div>
              </aside>

              {/* Article content */}
              <article className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className={difficultyColors[selectedArticle.difficulty]}>
                      {selectedArticle.difficulty}
                    </Badge>
                    <span className="text-sm text-blue-200/70 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {selectedArticle.readTime}
                    </span>
                    <span className="text-sm text-blue-200/60">
                      Atualizado em{" "}
                      {new Date(selectedArticle.updatedAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ textShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}>
                    {selectedArticle.title}
                  </h1>
                  <p className="text-lg text-blue-200/80 mb-6">
                    {selectedArticle.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-10">
                    {selectedArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-blue-200/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Mobile back */}
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="lg:hidden flex items-center gap-2 text-sm text-blue-300/70 hover:text-white transition-colors mb-6"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                  </button>

                  {/* Sections */}
                  <div className="space-y-10">
                    {selectedArticle.sections.map((sec, i) => (
                      <motion.section
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="scroll-mt-28"
                      >
                        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                          <div className="w-1 h-6 rounded-full bg-primary" />
                          {sec.title}
                        </h2>
                        <p className="text-blue-100/80 leading-relaxed whitespace-pre-line">
                          {sec.content}
                        </p>
                        {sec.code && (
                          <pre className="mt-4 p-4 rounded-xl bg-black/60 border border-white/10 overflow-x-auto">
                            <code className="text-sm text-emerald-300 font-mono">
                              {sec.code}
                            </code>
                          </pre>
                        )}
                      </motion.section>
                    ))}
                  </div>
                </motion.div>
              </article>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main listing view
  return (
    <div className="min-h-screen">
      <ModernHeader />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Centro de Conhecimento
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ textShadow: '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.15)' }}>
              Centro de Conhecimento{" "}
              <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent">
                Técnico
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200/80 max-w-2xl mx-auto mb-10">
              Explore a arquitetura, segurança e tecnologias que sustentam a
              plataforma 3AMG Flowz.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300/60" />
              <Input
                placeholder="Buscar por tecnologia, segurança, arquitetura..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-white/5 border-white/15 text-white placeholder:text-blue-300/50 rounded-xl text-base focus-visible:ring-primary/50 focus-visible:border-primary/40"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-20 space-y-16">
        {/* Categories */}
        {!search && !selectedCategory && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              Categorias
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                const count = articles.filter(
                  (a) => a.category === cat.id
                ).length;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left p-5 rounded-2xl bg-gradient-to-br ${cat.gradient} border ${cat.borderColor} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300 group`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-white/5 ${cat.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant="secondary" className="bg-white/10 text-blue-200/90 border-white/10 text-xs">
                        {count} artigos
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-1 group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-blue-200/70">
                      {cat.description}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </section>
        )}

        {/* Category header */}
        {selectedCategory && !search && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-blue-300/70 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Todas as categorias
            </button>
            <span className="text-blue-300/40">/</span>
            <span className="text-white font-medium">
              {categories.find((c) => c.id === selectedCategory)?.title}
            </span>
          </div>
        )}

        {/* Featured */}
        {!search && !selectedCategory && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Artigos em Destaque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredArticles.map((article, i) => {
                const CatIcon = categoryIcons[article.category] || BookOpen;
                return (
                  <motion.button
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setSelectedArticle(article);
                      setActiveSection(0);
                    }}
                    className="text-left p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <CatIcon className="h-4 w-4 text-primary" />
                      <span className="text-xs text-blue-300/60 uppercase tracking-wider">
                        {categories.find((c) => c.id === article.category)?.title}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-blue-200/70 mb-3 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-blue-200/60">
                      <Badge className={`text-[10px] ${difficultyColors[article.difficulty]}`}>
                        {article.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>
        )}

        {/* Article List */}
        {(search || selectedCategory) && (
          <section>
            <p className="text-sm text-blue-200/60 mb-4">
              {filteredArticles.length} artigo{filteredArticles.length !== 1 ? "s" : ""} encontrado{filteredArticles.length !== 1 ? "s" : ""}
            </p>
            <div className="space-y-3">
              <AnimatePresence>
                {filteredArticles.map((article, i) => {
                  const CatIcon = categoryIcons[article.category] || BookOpen;
                  return (
                    <motion.button
                      key={article.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => {
                        setSelectedArticle(article);
                        setActiveSection(0);
                      }}
                      className="w-full text-left p-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-200 flex items-center gap-4 group"
                    >
                      <div className="p-2 rounded-lg bg-white/5 text-primary shrink-0">
                        <CatIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white group-hover:text-primary transition-colors truncate">
                          {article.title}
                        </h3>
                        <p className="text-sm text-blue-200/70 truncate">
                          {article.description}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-3 shrink-0">
                        <Badge className={`text-[10px] ${difficultyColors[article.difficulty]}`}>
                          {article.difficulty}
                        </Badge>
                      <span className="text-xs text-blue-200/60 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {article.readTime}
                      </span>
                      <ChevronRight className="h-4 w-4 text-blue-200/50 group-hover:text-primary transition-colors" />
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              {filteredArticles.length === 0 && (
                <p className="text-center text-blue-200/60 py-12">
                  Nenhum artigo encontrado para "{search}".
                </p>
              )}
            </div>
          </section>
        )}

        {/* All articles by category (default view) */}
        {!search && !selectedCategory && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">
              Todos os Artigos
            </h2>
            <div className="space-y-3">
              {articles.map((article, i) => {
                const CatIcon = categoryIcons[article.category] || BookOpen;
                return (
                  <motion.button
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => {
                      setSelectedArticle(article);
                      setActiveSection(0);
                    }}
                    className="w-full text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-200 flex items-center gap-4 group"
                  >
                    <div className="p-2 rounded-lg bg-white/5 text-primary shrink-0">
                      <CatIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white group-hover:text-primary transition-colors text-sm truncate">
                        {article.title}
                      </h3>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                      <Badge className={`text-[10px] ${difficultyColors[article.difficulty]}`}>
                        {article.difficulty}
                      </Badge>
                      <span className="text-xs text-blue-200/60">{article.readTime}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Conhecimento;
