
import { Webhook, MessageCircle, Router, Database, Cloud, Zap } from "lucide-react";

export const integrations = [
  {
    id: 1,
    name: "Webhook de Recebimento",
    description: "Configure onde você quer receber as respostas dos agentes IA",
    icon: Webhook,
    status: "available",
    type: "webhook",
    route: "/webhook"
  },
  {
    id: 2,
    name: "WhatsApp Business API",
    description: "Integração com WhatsApp para atendimento via chat",
    icon: MessageCircle,
    status: "available",
    type: "chat",
    route: "/whatsapp-config"
  },
  {
    id: 3,
    name: "APIs de OLT",
    description: "Conecte com diferentes marcas de OLT (VSol, Datacom, etc.) para automação",
    icon: Router,
    status: "available",
    type: "olt",
    route: "/olt-config"
  },
  {
    id: 4,
    name: "CRM Pipedrive",
    description: "Sincronização automática de leads e tickets com Pipedrive",
    icon: Database,
    status: "available",
    type: "crm",
    route: "/pipedrive-config"
  },
  {
    id: 5,
    name: "CRM RD Station",
    description: "Integração com RD Station para automação de marketing e vendas",
    icon: Database,
    status: "available",
    type: "crm",
    route: "/rdstation-config"
  },
  {
    id: 6,
    name: "Slack",
    description: "Notificações de tickets e alertas em tempo real",
    icon: Cloud,
    status: "available",
    type: "notification",
    route: "/slack-config"
  },
  {
    id: 7,
    name: "Sistema de Billing",
    description: "Integração com sistemas de cobrança e faturamento",
    icon: Zap,
    status: "available",
    type: "billing",
    route: "/billing-config"
  }
];
