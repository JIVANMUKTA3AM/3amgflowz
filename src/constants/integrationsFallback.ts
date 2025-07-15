
import { MessageSquare, Zap, Mail, Database, Bot, Webhook } from "lucide-react";

export const integrationsFallback = [
  {
    id: 1,
    name: "WhatsApp Business",
    description: "Conecte-se com a API oficial do WhatsApp Business para automatizar conversas e atendimento ao cliente.",
    icon: MessageSquare,
    status: "available",
    type: "messaging",
    route: "/webhook-testing"
  },
  {
    id: 2,
    name: "Zapier",
    description: "Integre com mais de 5.000 aplicativos através do Zapier para automatizar fluxos de trabalho complexos.",
    icon: Zap,
    status: "available",
    type: "automation"
  },
  {
    id: 3,
    name: "Email Marketing",
    description: "Automatize campanhas de email e nutrição de leads baseada nas interações dos seus agentes IA.",
    icon: Mail,
    status: "development",
    type: "marketing"
  },
  {
    id: 4,
    name: "CRM Personalizado",
    description: "Conecte com seu CRM existente ou use nossa solução integrada para gerenciar leads e clientes.",
    icon: Database,
    status: "available",
    type: "crm"
  },
  {
    id: 5,
    name: "Slack",
    description: "Integre seus agentes IA com o Slack para notificações e colaboração em equipe.",
    icon: Bot,
    status: "development",
    type: "collaboration"
  },
  {
    id: 6,
    name: "Webhooks Personalizados",
    description: "Configure webhooks personalizados para integrar com qualquer sistema que suporte HTTP.",
    icon: Webhook,
    status: "available",
    type: "custom",
    route: "/webhook-testing"
  }
];
