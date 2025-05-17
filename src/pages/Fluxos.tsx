
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Fluxos = () => {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  
  const handleFlowSelect = (flowName: string) => {
    setSelectedFlow(flowName);
  };
  
  const renderFlowCode = (flowName: string) => {
    switch(flowName) {
      case "whatsapp_entry":
        return `
# Fluxo de entrada de mensagens do WhatsApp

trigger:
  type: webhook
  endpoint: /webhook/whatsapp
  method: POST

nodes:
  - id: receiveMessage
    type: webhook
    position: [0, 0]

  - id: extractData
    type: function
    position: [220, 0]
    parameters:
      code: |
        // Extrai informações da mensagem do WhatsApp
        const message = $input.body.messages[0];
        return {
          phone: message.from,
          text: message.text.body,
          timestamp: message.timestamp,
          name: $input.body.contacts?.[0]?.profile?.name || "Cliente"
        };

  - id: checkCustomerExists
    type: supabase
    position: [440, 0]
    parameters:
      operation: select
      table: customers
      where: 
        phone: "{{ $node.extractData.output.phone }}"

  - id: routeBasedOnCustomer
    type: switch
    position: [660, 0]
    parameters:
      rules:
        - condition: "{{ $node.checkCustomerExists.output.data.length > 0 }}"
          destinationNode: classifyMessage
        - condition: "{{ $node.checkCustomerExists.output.data.length === 0 }}"
          destinationNode: createNewCustomer

  - id: createNewCustomer
    type: supabase
    position: [880, -100]
    parameters:
      operation: insert
      table: customers
      data:
        name: "{{ $node.extractData.output.name }}"
        phone: "{{ $node.extractData.output.phone }}"
        status: "lead"

  - id: classifyMessage
    type: httpRequest
    position: [880, 100]
    parameters:
      url: "{{ $env.AI_CLASSIFIER_URL }}"
      method: POST
      body:
        text: "{{ $node.extractData.output.text }}"
        phone: "{{ $node.extractData.output.phone }}"
        customer: "{{ $node.checkCustomerExists.output.data[0] || {} }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: routeToAgent
    type: switch
    position: [1100, 0]
    parameters:
      value: "{{ $node.classifyMessage.output.category }}"
      routes:
        - value: "technical"
          next: "technicalAgentWorkflow"
        - value: "financial"
          next: "financialAgentWorkflow"
        - value: "commercial"
          next: "commercialAgentWorkflow"
      default: "commercialAgentWorkflow"

  - id: technicalAgentWorkflow
    type: subworkflow
    position: [1320, -100]
    parameters:
      workflowId: "technical_agent_workflow"
      data: 
        text: "{{ $node.extractData.output.text }}"
        phone: "{{ $node.extractData.output.phone }}"
        customer: "{{ $node.checkCustomerExists.output.data[0] || $node.createNewCustomer.output.data[0] }}"
        intent: "{{ $node.classifyMessage.output.intent }}"

  - id: financialAgentWorkflow
    type: subworkflow
    position: [1320, 0]
    parameters:
      workflowId: "financial_agent_workflow"
      data: 
        text: "{{ $node.extractData.output.text }}"
        phone: "{{ $node.extractData.output.phone }}"
        customer: "{{ $node.checkCustomerExists.output.data[0] || $node.createNewCustomer.output.data[0] }}"
        intent: "{{ $node.classifyMessage.output.intent }}"

  - id: commercialAgentWorkflow
    type: subworkflow
    position: [1320, 100]
    parameters:
      workflowId: "commercial_agent_workflow"
      data: 
        text: "{{ $node.extractData.output.text }}"
        phone: "{{ $node.extractData.output.phone }}"
        customer: "{{ $node.checkCustomerExists.output.data[0] || $node.createNewCustomer.output.data[0] }}"
        intent: "{{ $node.classifyMessage.output.intent }}"

  - id: mergeResponses
    type: function
    position: [1540, 0]
    parameters:
      code: |
        // Combina as respostas dos diferentes agentes
        const technical = $node.technicalAgentWorkflow?.output || {};
        const financial = $node.financialAgentWorkflow?.output || {};
        const commercial = $node.commercialAgentWorkflow?.output || {};
        
        // Pega a resposta do agente que foi ativado
        const response = technical.response || financial.response || commercial.response;
        const agentType = technical.response ? 'technical' : financial.response ? 'financial' : 'commercial';
        
        return { 
          response, 
          agentType,
          phoneNumber: $node.extractData.output.phone,
          interactionData: {
            customer_id: ($node.checkCustomerExists.output.data[0] || $node.createNewCustomer.output.data[0]).id,
            message_received: $node.extractData.output.text,
            message_sent: response,
            agent_type: agentType,
          }
        };

  - id: saveInteraction
    type: supabase
    position: [1760, -100]
    parameters:
      operation: insert
      table: interactions
      data: "{{ $node.mergeResponses.output.interactionData }}"

  - id: sendWhatsAppResponse
    type: httpRequest
    position: [1760, 100]
    parameters:
      url: "{{ $env.WHATSAPP_API_URL }}"
      method: POST
      body:
        to: "{{ $node.mergeResponses.output.phoneNumber }}"
        text: "{{ $node.mergeResponses.output.response }}"
      authentication: bearer
      token: "{{ $env.WHATSAPP_API_TOKEN }}"
`;
      case "technical_agent":
        return `
# Fluxo do Agente Técnico

name: "Technical Agent Workflow"
trigger:
  type: "webhook"
  endpoint: "/technical-agent"

nodes:
  - id: receiveRequest
    type: webhook
    position: [0, 0]

  - id: analyzeIssue
    type: httpRequest
    position: [220, 0]
    parameters:
      url: "{{ $env.AI_TECHNICAL_AGENT_URL }}"
      method: POST
      body:
        message: "{{ $input.body.text }}"
        customer_id: "{{ $input.body.customer.id }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: checkIssueType
    type: switch
    position: [440, 0]
    parameters:
      value: "{{ $node.analyzeIssue.output.issue_type }}"
      routes:
        - value: "connectivity"
          next: "checkONUStatus"
        - value: "speed"
          next: "runSpeedTest"
        - value: "equipment"
          next: "troubleshootEquipment"
      default: "generateGenericResponse"

  - id: checkONUStatus
    type: httpRequest
    position: [660, -100]
    parameters:
      url: "{{ $env.OLT_API_URL }}/onu-status"
      method: POST
      body:
        customer_id: "{{ $input.body.customer.id }}"
      authentication: bearer
      token: "{{ $env.OLT_API_TOKEN }}"

  - id: runSpeedTest
    type: httpRequest
    position: [660, 0]
    parameters:
      url: "{{ $env.SPEEDTEST_API_URL }}"
      method: POST
      body:
        customer_id: "{{ $input.body.customer.id }}"
      authentication: bearer
      token: "{{ $env.SPEEDTEST_API_TOKEN }}"

  - id: troubleshootEquipment
    type: httpRequest
    position: [660, 100]
    parameters:
      url: "{{ $env.TROUBLESHOOT_API_URL }}"
      method: POST
      body:
        equipment_data: "{{ $input.body.customer.equipment }}"
        issue_description: "{{ $input.body.text }}"
      authentication: bearer
      token: "{{ $env.TROUBLESHOOT_API_TOKEN }}"

  - id: generateGenericResponse
    type: httpRequest
    position: [660, 200]
    parameters:
      url: "{{ $env.AI_RESPONSE_GENERATOR_URL }}"
      method: POST
      body:
        context: "technical_support"
        message: "{{ $input.body.text }}"
        customer_data: "{{ $input.body.customer }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: checkIfTicketNeeded
    type: function
    position: [880, 0]
    parameters:
      code: |
        // Determina se um ticket deve ser criado
        const issueType = $node.analyzeIssue.output.issue_type;
        const onuStatus = $node.checkONUStatus?.output?.status;
        const speedTest = $node.runSpeedTest?.output?.results;
        const troubleshoot = $node.troubleshootEquipment?.output?.diagnosis;
        
        // Critérios para criar ticket
        let needsTicket = false;
        let reason = "";
        
        if (onuStatus === "offline") {
          needsTicket = true;
          reason = "ONU Offline detectada";
        } else if (speedTest && speedTest.download < speedTest.expected_download * 0.7) {
          needsTicket = true;
          reason = "Velocidade muito abaixo do contratado";
        } else if (troubleshoot && troubleshoot.severity === "high") {
          needsTicket = true;
          reason = "Problema crítico com o equipamento";
        }
        
        return {
          needs_ticket: needsTicket,
          ticket_reason: reason,
          customer_id: $input.body.customer.id
        };

  - id: createTicketConditional
    type: if
    position: [1100, 0]
    parameters:
      condition: "{{ $node.checkIfTicketNeeded.output.needs_ticket }}"

  - id: createTicket
    type: supabase
    position: [1320, -100]
    parameters:
      operation: insert
      table: tickets
      data:
        customer_id: "{{ $node.checkIfTicketNeeded.output.customer_id }}"
        title: "Problema técnico detectado"
        description: "{{ $node.checkIfTicketNeeded.output.ticket_reason }}"
        priority: "high"
        status: "open"
        type: "technical"
    runAfter:
      - createTicketConditional
    when: "{{ $node.createTicketConditional.output === true }}"

  - id: prepareResponse
    type: function
    position: [1320, 100]
    parameters:
      code: |
        // Prepara a resposta com base em todas as análises
        const onuResponse = $node.checkONUStatus?.output ? 
          \`Status do seu equipamento: \${$node.checkONUStatus.output.status}. \${$node.checkONUStatus.output.details}\` : "";
        
        const speedResponse = $node.runSpeedTest?.output ? 
          \`Teste de velocidade: Download \${$node.runSpeedTest.output.results.download}Mbps / Upload \${$node.runSpeedTest.output.results.upload}Mbps\` : "";
        
        const troubleshootResponse = $node.troubleshootEquipment?.output ? 
          \`Diagnóstico: \${$node.troubleshootEquipment.output.diagnosis.message}\` : "";
        
        const genericResponse = $node.generateGenericResponse?.output?.response || "";
        
        let response = genericResponse;
        
        // Adiciona informações específicas se disponíveis
        if (onuResponse) response += "\\n\\n" + onuResponse;
        if (speedResponse) response += "\\n\\n" + speedResponse;
        if (troubleshootResponse) response += "\\n\\n" + troubleshootResponse;
        
        // Adiciona informação sobre ticket criado
        if ($node.checkIfTicketNeeded.output.needs_ticket) {
          response += "\\n\\nUm ticket de suporte foi aberto para resolver seu problema. Um técnico entrará em contato em breve.";
        }
        
        return { response };

  - id: finalResponse
    type: respond
    position: [1540, 0]
    parameters:
      response: "{{ $node.prepareResponse.output }}"
`;
      case "financial_agent":
        return `
# Fluxo do Agente Financeiro

name: "Financial Agent Workflow"
trigger:
  type: "webhook"
  endpoint: "/financial-agent"

nodes:
  - id: receiveRequest
    type: webhook
    position: [0, 0]

  - id: analyzeQuery
    type: httpRequest
    position: [220, 0]
    parameters:
      url: "{{ $env.AI_FINANCIAL_AGENT_URL }}"
      method: POST
      body:
        message: "{{ $input.body.text }}"
        customer_id: "{{ $input.body.customer.id }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: routeFinancialQuery
    type: switch
    position: [440, 0]
    parameters:
      value: "{{ $node.analyzeQuery.output.query_type }}"
      routes:
        - value: "invoice"
          next: "getInvoiceInfo"
        - value: "payment"
          next: "getPaymentHistory"
        - value: "debt"
          next: "getNegotiationOptions"
      default: "generateGenericFinancialResponse"

  - id: getInvoiceInfo
    type: supabase
    position: [660, -100]
    parameters:
      operation: select
      table: financial_records
      where: 
        customer_id: "{{ $input.body.customer.id }}"
        status: "pending"
      order_by:
        due_date: ASC

  - id: generateInvoiceLink
    type: httpRequest
    position: [880, -100]
    parameters:
      url: "{{ $env.PAYMENT_GATEWAY_API }}/generate-link"
      method: POST
      body:
        invoice_id: "{{ $node.getInvoiceInfo.output.data[0]?.id }}"
        amount: "{{ $node.getInvoiceInfo.output.data[0]?.amount }}"
        description: "Fatura {{ $node.getInvoiceInfo.output.data[0]?.invoice_number }}"
        customer_name: "{{ $input.body.customer.name }}"
        customer_email: "{{ $input.body.customer.email }}"
      authentication: bearer
      token: "{{ $env.PAYMENT_GATEWAY_TOKEN }}"

  - id: getPaymentHistory
    type: supabase
    position: [660, 0]
    parameters:
      operation: select
      table: financial_records
      where: 
        customer_id: "{{ $input.body.customer.id }}"
      order_by:
        due_date: DESC
      limit: 5

  - id: getNegotiationOptions
    type: httpRequest
    position: [660, 100]
    parameters:
      url: "{{ $env.DEBT_NEGOTIATION_API }}/options"
      method: POST
      body:
        customer_id: "{{ $input.body.customer.id }}"
        debt_amount: "{{ $input.body.customer.debt_amount }}"
      authentication: bearer
      token: "{{ $env.DEBT_API_TOKEN }}"

  - id: generateGenericFinancialResponse
    type: httpRequest
    position: [660, 200]
    parameters:
      url: "{{ $env.AI_RESPONSE_GENERATOR_URL }}"
      method: POST
      body:
        context: "financial_support"
        message: "{{ $input.body.text }}"
        customer_data: "{{ $input.body.customer }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: updateFinancialRecords
    type: supabase
    position: [880, 100]
    parameters:
      operation: update
      table: financial_records
      data:
        payment_link: "{{ $node.generateInvoiceLink.output.payment_url || null }}"
        status: "{{ $node.generateInvoiceLink.output ? 'processing' : $node.getNegotiationOptions.output ? 'negotiating' : null }}"
      where:
        id: "{{ $node.getInvoiceInfo.output.data[0]?.id }}"

  - id: prepareFinancialResponse
    type: function
    position: [1100, 0]
    parameters:
      code: |
        // Prepara a resposta com base em todas as análises financeiras
        const invoiceInfo = $node.getInvoiceInfo?.output?.data;
        const paymentHistory = $node.getPaymentHistory?.output?.data;
        const negotiationOptions = $node.getNegotiationOptions?.output?.options;
        const genericResponse = $node.generateGenericFinancialResponse?.output?.response || "";
        const paymentLink = $node.generateInvoiceLink?.output?.payment_url;
        
        let response = genericResponse;
        
        // Adiciona informações de fatura
        if (invoiceInfo && invoiceInfo.length > 0) {
          const latestInvoice = invoiceInfo[0];
          response = \`Você tem uma fatura pendente no valor de R$ \${latestInvoice.amount} com vencimento em \${new Date(latestInvoice.due_date).toLocaleDateString()}.\`;
          
          if (paymentLink) {
            response += \`\\n\\nVocê pode pagar sua fatura através do link: \${paymentLink}\`;
          }
        }
        
        // Adiciona histórico de pagamento
        if (paymentHistory && paymentHistory.length > 0) {
          response += "\\n\\nHistórico de pagamentos recentes:\\n";
          paymentHistory.forEach(payment => {
            const status = payment.status === 'paid' ? 'Pago' : 
                         payment.status === 'pending' ? 'Pendente' : 
                         payment.status === 'overdue' ? 'Vencido' : payment.status;
            
            response += \`- Fatura \${payment.invoice_number}: R$ \${payment.amount} - Status: \${status} - Vencimento: \${new Date(payment.due_date).toLocaleDateString()}\\n\`;
          });
        }
        
        // Adiciona opções de negociação
        if (negotiationOptions && negotiationOptions.length > 0) {
          response += "\\n\\nTemos as seguintes opções de negociação disponíveis para você:\\n";
          negotiationOptions.forEach((option, index) => {
            response += \`Opção \${index + 1}: \${option.description} - Desconto: \${option.discount_percentage}% - Parcelas: \${option.installments}x\\n\`;
          });
          response += "\\n\\nPara escolher uma opção de negociação, responda com o número da opção desejada.";
        }
        
        return { response };

  - id: finalResponse
    type: respond
    position: [1320, 0]
    parameters:
      response: "{{ $node.prepareFinancialResponse.output }}"
`;
      case "commercial_agent":
        return `
# Fluxo do Agente Comercial

name: "Commercial Agent Workflow"
trigger:
  type: "webhook"
  endpoint: "/commercial-agent"

nodes:
  - id: receiveRequest
    type: webhook
    position: [0, 0]

  - id: analyzeCommercialQuery
    type: httpRequest
    position: [220, 0]
    parameters:
      url: "{{ $env.AI_COMMERCIAL_AGENT_URL }}"
      method: POST
      body:
        message: "{{ $input.body.text }}"
        customer_id: "{{ $input.body.customer.id }}"
        is_new_customer: "{{ $input.body.is_new_customer }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: routeCommercialQuery
    type: switch
    position: [440, 0]
    parameters:
      value: "{{ $node.analyzeCommercialQuery.output.query_type }}"
      routes:
        - value: "plans"
          next: "getAvailablePlans"
        - value: "upgrade"
          next: "getUpgradeOptions"
        - value: "promotions"
          next: "getActivePromotions"
        - value: "new_customer"
          next: "getNewCustomerOffers"
      default: "generateGenericCommercialResponse"

  - id: getAvailablePlans
    type: supabase
    position: [660, -150]
    parameters:
      operation: select
      table: plans
      where:
        is_active: true
      order_by:
        price: ASC

  - id: getUpgradeOptions
    type: function
    position: [660, -50]
    parameters:
      code: |
        // Obtém o plano atual do cliente e sugere upgrades
        const currentPlan = $input.body.customer.plan_id;
        
        // Busca planos de upgrade no cache
        const cachedPlans = $cache.get('plans') || [];
        
        // Filtra planos que são upgrades (maior velocidade/preço)
        const upgradeOptions = cachedPlans
          .filter(plan => plan.price > $input.body.customer.plan_price)
          .sort((a, b) => a.price - b.price)
          .slice(0, 3); // Top 3 opções de upgrade
        
        return { upgradeOptions };

  - id: getActivePromotions
    type: supabase
    position: [660, 50]
    parameters:
      operation: select
      table: promotions
      where:
        is_active: true
        start_date: "<= NOW()"
        end_date: ">= NOW()"

  - id: getNewCustomerOffers
    type: supabase
    position: [660, 150]
    parameters:
      operation: select
      table: promotions
      where:
        is_active: true
        new_customers_only: true
        start_date: "<= NOW()"
        end_date: ">= NOW()"

  - id: generateGenericCommercialResponse
    type: httpRequest
    position: [660, 250]
    parameters:
      url: "{{ $env.AI_RESPONSE_GENERATOR_URL }}"
      method: POST
      body:
        context: "commercial_support"
        message: "{{ $input.body.text }}"
        customer_data: "{{ $input.body.customer }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: scoreLead
    type: httpRequest
    position: [880, 150]
    parameters:
      url: "{{ $env.LEAD_SCORING_API }}"
      method: POST
      body:
        customer: "{{ $input.body.customer }}"
        message: "{{ $input.body.text }}"
        query_type: "{{ $node.analyzeCommercialQuery.output.query_type }}"
      authentication: bearer
      token: "{{ $env.LEAD_API_TOKEN }}"

  - id: updateCustomerInterest
    type: supabase
    position: [880, -50]
    parameters:
      operation: update
      table: customers
      data:
        interested_in_plan: "{{ $node.getAvailablePlans.output.data[0]?.id || $node.getUpgradeOptions.output.upgradeOptions[0]?.id }}"
        interested_in_promotion: "{{ $node.getActivePromotions.output.data[0]?.id || $node.getNewCustomerOffers.output.data[0]?.id }}"
        lead_score: "{{ $node.scoreLead.output.score || $input.body.customer.lead_score || 0 }}"
        last_contact: "NOW()"
      where:
        id: "{{ $input.body.customer.id }}"

  - id: prepareCommercialResponse
    type: function
    position: [1100, 0]
    parameters:
      code: |
        // Prepara a resposta comercial com base nas consultas
        const availablePlans = $node.getAvailablePlans?.output?.data;
        const upgradeOptions = $node.getUpgradeOptions?.output?.upgradeOptions;
        const activePromotions = $node.getActivePromotions?.output?.data;
        const newCustomerOffers = $node.getNewCustomerOffers?.output?.data;
        const genericResponse = $node.generateGenericCommercialResponse?.output?.response || "";
        
        let response = genericResponse;
        
        // Formata planos disponíveis
        if (availablePlans && availablePlans.length > 0) {
          response = "Temos os seguintes planos disponíveis para você:\\n\\n";
          availablePlans.forEach(plan => {
            response += \`- \${plan.name}: \${plan.download_speed}Mbps de download / \${plan.upload_speed}Mbps de upload por R$ \${plan.price}/mês\\n\`;
          });
          response += "\\n\\nPara contratar um plano, responda com o nome do plano desejado.";
        }
        
        // Formata opções de upgrade
        if (upgradeOptions && upgradeOptions.length > 0) {
          response = "Identificamos estas opções para melhorar seu plano atual:\\n\\n";
          upgradeOptions.forEach((plan, index) => {
            const percentageFaster = Math.round((plan.download_speed / $input.body.customer.current_plan_speed - 1) * 100);
            response += \`- Opção \${index + 1}: \${plan.name} - \${plan.download_speed}Mbps (\${percentageFaster}% mais rápido) por apenas R$ \${plan.price}/mês\\n\`;
          });
          response += "\\n\\nInteressado em fazer um upgrade? Responda com o número da opção desejada.";
        }
        
        // Formata promoções ativas
        if (activePromotions && activePromotions.length > 0) {
          response = "Confira nossas promoções ativas:\\n\\n";
          activePromotions.forEach(promo => {
            response += \`- \${promo.name}: \${promo.description}\\n   Válido até: \${new Date(promo.end_date).toLocaleDateString()}\\n\`;
          });
        }
        
        // Formata ofertas para novos clientes
        if (newCustomerOffers && newCustomerOffers.length > 0) {
          response = "Aproveite nossas ofertas especiais para novos clientes:\\n\\n";
          newCustomerOffers.forEach(offer => {
            response += \`- \${offer.name}: \${offer.description}\\n   Válido até: \${new Date(offer.end_date).toLocaleDateString()}\\n\`;
          });
          response += "\\n\\nGostaria de conhecer mais sobre alguma dessas ofertas?";
        }
        
        return { response };

  - id: scheduleFutureFollowUp
    type: function
    position: [1320, 100]
    parameters:
      code: |
        // Verifica se deve agendar um follow-up comercial
        const leadScore = $node.scoreLead?.output?.score || 0;
        const queryType = $node.analyzeCommercialQuery.output.query_type;
        
        // Determina o melhor momento para follow-up baseado no interesse
        let shouldFollowUp = leadScore > 70;
        let followUpDays = 0;
        
        if (queryType === "plans" || queryType === "upgrade") {
          followUpDays = 2; // Follow-up mais rápido para interessados em planos
        } else if (queryType === "promotions") {
          followUpDays = 3;
        } else if (queryType === "new_customer") {
          followUpDays = 1; // Novos clientes precisam de atenção rápida
        }
        
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + followUpDays);
        
        return { 
          should_follow_up: shouldFollowUp, 
          follow_up_date: followUpDate.toISOString(),
          customer_id: $input.body.customer.id
        };

  - id: createFollowUpTask
    type: supabase
    position: [1540, 100]
    parameters:
      operation: insert
      table: follow_up_tasks
      data:
        customer_id: "{{ $node.scheduleFutureFollowUp.output.customer_id }}"
        scheduled_date: "{{ $node.scheduleFutureFollowUp.output.follow_up_date }}"
        type: "commercial_follow_up"
        status: "pending"
        description: "Follow up comercial baseado no interesse demonstrado"
      when: "{{ $node.scheduleFutureFollowUp.output.should_follow_up === true }}"

  - id: finalResponse
    type: respond
    position: [1320, 0]
    parameters:
      response: "{{ $node.prepareCommercialResponse.output }}"
`;
      case "follow_up":
        return `
# Fluxo de Follow-Up de Clientes

name: "Customer Follow-Up Workflow"
trigger:
  type: "schedule"
  schedule: "0 10 * * *" # Diariamente às 10:00

nodes:
  - id: getDueFollowUps
    type: supabase
    position: [0, 0]
    parameters:
      operation: select
      table: follow_up_tasks
      where:
        scheduled_date: "<= NOW()"
        status: "pending"
      join:
        customers:
          field: "customer_id"
          on: "id"
          select: ["name", "phone", "email", "lead_score"]

  - id: processPendingFollowUps
    type: loop
    position: [220, 0]
    parameters:
      items: "{{ $node.getDueFollowUps.output.data }}"
    
  - id: determineFollowUpType
    type: switch
    position: [440, 0]
    parameters:
      value: "{{ $node.processPendingFollowUps.output.currentItem.type }}"
      routes:
        - value: "commercial_follow_up"
          next: "prepareCommercialFollowUp"
        - value: "support_follow_up"
          next: "prepareSupportFollowUp"
        - value: "payment_reminder"
          next: "preparePaymentReminder"
      default: "prepareGenericFollowUp"

  - id: prepareCommercialFollowUp
    type: httpRequest
    position: [660, -100]
    parameters:
      url: "{{ $env.AI_RESPONSE_GENERATOR_URL }}"
      method: POST
      body:
        context: "commercial_follow_up"
        customer_data:
          id: "{{ $node.processPendingFollowUps.output.currentItem.customer_id }}"
          name: "{{ $node.processPendingFollowUps.output.currentItem.name }}"
          lead_score: "{{ $node.processPendingFollowUps.output.currentItem.lead_score }}"
        description: "{{ $node.processPendingFollowUps.output.currentItem.description }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: prepareSupportFollowUp
    type: httpRequest
    position: [660, 0]
    parameters:
      url: "{{ $env.AI_RESPONSE_GENERATOR_URL }}"
      method: POST
      body:
        context: "support_follow_up"
        customer_data:
          id: "{{ $node.processPendingFollowUps.output.currentItem.customer_id }}"
          name: "{{ $node.processPendingFollowUps.output.currentItem.name }}"
        ticket_id: "{{ $node.processPendingFollowUps.output.currentItem.related_id }}"
        description: "{{ $node.processPendingFollowUps.output.currentItem.description }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: preparePaymentReminder
    type: httpRequest
    position: [660, 100]
    parameters:
      url: "{{ $env.AI_RESPONSE_GENERATOR_URL }}"
      method: POST
      body:
        context: "payment_reminder"
        customer_data:
          id: "{{ $node.processPendingFollowUps.output.currentItem.customer_id }}"
          name: "{{ $node.processPendingFollowUps.output.currentItem.name }}"
        invoice_id: "{{ $node.processPendingFollowUps.output.currentItem.related_id }}"
        description: "{{ $node.processPendingFollowUps.output.currentItem.description }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: prepareGenericFollowUp
    type: httpRequest
    position: [660, 200]
    parameters:
      url: "{{ $env.AI_RESPONSE_GENERATOR_URL }}"
      method: POST
      body:
        context: "generic_follow_up"
        customer_data:
          id: "{{ $node.processPendingFollowUps.output.currentItem.customer_id }}"
          name: "{{ $node.processPendingFollowUps.output.currentItem.name }}"
        description: "{{ $node.processPendingFollowUps.output.currentItem.description }}"
      authentication: bearer
      token: "{{ $env.AI_API_KEY }}"

  - id: sendWhatsAppFollowUp
    type: httpRequest
    position: [880, 0]
    parameters:
      url: "{{ $env.WHATSAPP_API_URL }}"
      method: POST
      body:
        to: "{{ $node.processPendingFollowUps.output.currentItem.phone }}"
        text: "{{ $node.prepareCommercialFollowUp.output.response || $node.prepareSupportFollowUp.output.response || $node.preparePaymentReminder.output.response || $node.prepareGenericFollowUp.output.response }}"
      authentication: bearer
      token: "{{ $env.WHATSAPP_API_TOKEN }}"

  - id: updateFollowUpStatus
    type: supabase
    position: [1100, 0]
    parameters:
      operation: update
      table: follow_up_tasks
      data:
        status: "completed"
        completed_at: "NOW()"
      where:
        id: "{{ $node.processPendingFollowUps.output.currentItem.id }}"

  - id: logFollowUpActivity
    type: supabase
    position: [1320, 0]
    parameters:
      operation: insert
      table: interactions
      data:
        customer_id: "{{ $node.processPendingFollowUps.output.currentItem.customer_id }}"
        message_sent: "{{ $node.sendWhatsAppFollowUp.output.text }}"
        message_received: null
        interaction_type: "follow_up"
        agent_type: "automated"
`;
      case "equipment_monitor":
        return `
# Fluxo de Monitoramento de Equipamentos

name: "Equipment Monitoring Workflow"
trigger:
  type: "schedule"
  schedule: "*/30 * * * *" # A cada 30 minutos

nodes:
  - id: checkOfflineEquipment
    type: supabase
    position: [0, 0]
    parameters:
      operation: select
      table: customer_equipment
      where:
        status: "offline"
        last_online: "<= NOW() - INTERVAL '4 hours'"  # Offline há pelo menos 4 horas
      join:
        customers:
          field: "customer_id"
          on: "id"
          select: ["name", "phone", "email"]

  - id: filterNewOfflineEquipment
    type: function
    position: [220, 0]
    parameters:
      code: |
        // Filtra equipamentos que ainda não têm tickets
        // Usa o estado global para rastrear equipamentos já notificados
        const offlineEquipment = $node.checkOfflineEquipment.output.data || [];
        const notifiedEquipment = $workflow.state.notifiedEquipment || {};
        
        const newOfflineEquipment = offlineEquipment.filter(eq => {
          // Verifica se o equipamento não foi notificado nas últimas 24h
          const lastNotified = notifiedEquipment[eq.id];
          const notRecent = !lastNotified || 
            (new Date() - new Date(lastNotified)) > 24 * 60 * 60 * 1000;
          
          return notRecent;
        });
        
        return { newOfflineEquipment };

  - id: processOfflineEquipment
    type: loop
    position: [440, 0]
    parameters:
      items: "{{ $node.filterNewOfflineEquipment.output.newOfflineEquipment }}"

  - id: checkExistingTickets
    type: supabase
    position: [660, 0]
    parameters:
      operation: select
      table: tickets
      where:
        customer_id: "{{ $node.processOfflineEquipment.output.currentItem.customer_id }}"
        type: "technical"
        status: ["open", "in_progress"]
      limit: 1

  - id: createTicketDecision
    type: if
    position: [880, 0]
    parameters:
      condition: "{{ $node.checkExistingTickets.output.data.length === 0 }}"

  - id: createOfflineEquipmentTicket
    type: supabase
    position: [1100, -100]
    parameters:
      operation: insert
      table: tickets
      data:
        customer_id: "{{ $node.processOfflineEquipment.output.currentItem.customer_id }}"
        title: "Equipamento Offline Detectado"
        description: "O equipamento {{ $node.processOfflineEquipment.output.currentItem.onu_serial }} está offline há mais de 4 horas."
        type: "technical"
        status: "open"
        priority: "high"
      runAfter:
        - createTicketDecision
      when: "{{ $node.createTicketDecision.output === true }}"

  - id: prepareOfflineNotification
    type: function
    position: [1100, 100]
    parameters:
      code: |
        // Prepara notificação para o cliente sobre equipamento offline
        const equipment = $node.processOfflineEquipment.output.currentItem;
        const customerName = equipment.name || "Cliente";
        
        // Formata a mensagem de notificação
        const message = \`Olá \${customerName}, 
        
        Identificamos que seu equipamento de internet está offline há algumas horas. 
        
        Já criamos um ticket técnico para analisar a situação. Por favor, verifique se:
        1. Seu equipamento está ligado
        2. Os cabos estão conectados corretamente
        3. Houve queda de energia no local
        
        Se precisar de ajuda imediata, responda esta mensagem.
        
        Atenciosamente,
        Equipe de Suporte\`;
        
        return { 
          message,
          phone: equipment.phone,
          ticket_id: $node.createOfflineEquipmentTicket?.output?.data?.[0]?.id
        };

  - id: notifyCustomerAboutOffline
    type: httpRequest
    position: [1320, 0]
    parameters:
      url: "{{ $env.WHATSAPP_API_URL }}"
      method: POST
      body:
        to: "{{ $node.prepareOfflineNotification.output.phone }}"
        text: "{{ $node.prepareOfflineNotification.output.message }}"
      authentication: bearer
      token: "{{ $env.WHATSAPP_API_TOKEN }}"

  - id: updateTrackingState
    type: function
    position: [1540, 0]
    parameters:
      code: |
        // Atualiza o estado para rastrear notificações enviadas
        const notifiedEquipment = $workflow.state.notifiedEquipment || {};
        const equipmentId = $node.processOfflineEquipment.output.currentItem.id;
        
        // Marca este equipamento como notificado com o timestamp atual
        notifiedEquipment[equipmentId] = new Date().toISOString();
        
        // Salva no estado global do workflow
        $workflow.state.notifiedEquipment = notifiedEquipment;
        
        return { success: true };

  - id: logNotificationSent
    type: supabase
    position: [1760, 0]
    parameters:
      operation: insert
      table: interactions
      data:
        customer_id: "{{ $node.processOfflineEquipment.output.currentItem.customer_id }}"
        message_sent: "{{ $node.prepareOfflineNotification.output.message }}"
        message_received: null
        interaction_type: "offline_notification"
        agent_type: "automated"
        metadata:
          equipment_id: "{{ $node.processOfflineEquipment.output.currentItem.id }}"
          ticket_id: "{{ $node.prepareOfflineNotification.output.ticket_id }}"
`;
      default:
        return 'Selecione um fluxo para ver seu código.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white shadow-sm py-4 mb-6">
        <div className="container mx-auto flex items-center px-4">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center mr-4">
            <ArrowLeft size={16} className="mr-1" /> Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Fluxos n8n</h1>
        </div>
      </header>

      <main className="container mx-auto px-4">
        <div className="mb-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Workflows de Automação</h2>
          <p className="text-gray-600 mb-6">
            Estes são os fluxos de trabalho configurados no n8n para gerenciar as interações entre
            clientes, agentes de IA e sistemas externos. Cada fluxo representa um componente específico
            da arquitetura de automação.
          </p>

          <Tabs defaultValue="workflow_list" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="workflow_list">Lista de Fluxos</TabsTrigger>
              <TabsTrigger value="workflow_detail">Detalhes do Fluxo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="workflow_list">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFlowSelect('whatsapp_entry')}>
                  <CardHeader>
                    <CardTitle>Fluxo Principal de WhatsApp</CardTitle>
                    <CardDescription>Processamento inicial de mensagens do WhatsApp</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Este fluxo recebe mensagens do WhatsApp, classifica o conteúdo e encaminha para o agente especializado.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFlowSelect('technical_agent')}>
                  <CardHeader>
                    <CardTitle>Agente Técnico</CardTitle>
                    <CardDescription>Suporte técnico e diagnóstico</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Verifica status de equipamentos, problemas de conexão e cria tickets de suporte quando necessário.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFlowSelect('financial_agent')}>
                  <CardHeader>
                    <CardTitle>Agente Financeiro</CardTitle>
                    <CardDescription>Faturas, pagamentos e negociações</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Permite consultar faturas pendentes, histórico de pagamentos e negociação de débitos.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFlowSelect('commercial_agent')}>
                  <CardHeader>
                    <CardTitle>Agente Comercial</CardTitle>
                    <CardDescription>Planos, promoções e vendas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Apresenta planos e promoções disponíveis, processa upgrades e avalia oportunidades comerciais.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFlowSelect('follow_up')}>
                  <CardHeader>
                    <CardTitle>Fluxo de Follow-Up</CardTitle>
                    <CardDescription>Acompanhamento automatizado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Envia mensagens de acompanhamento para oportunidades comerciais e suporte técnico.
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleFlowSelect('equipment_monitor')}>
                  <CardHeader>
                    <CardTitle>Monitor de Equipamentos</CardTitle>
                    <CardDescription>Monitoramento preventivo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      Verifica status de equipamentos periodicamente e notifica sobre problemas detectados.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="workflow_detail">
              {selectedFlow ? (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">
                      {selectedFlow === 'whatsapp_entry' && 'Fluxo Principal de WhatsApp'}
                      {selectedFlow === 'technical_agent' && 'Agente Técnico'}
                      {selectedFlow === 'financial_agent' && 'Agente Financeiro'}
                      {selectedFlow === 'commercial_agent' && 'Agente Comercial'}
                      {selectedFlow === 'follow_up' && 'Fluxo de Follow-Up'}
                      {selectedFlow === 'equipment_monitor' && 'Monitor de Equipamentos'}
                    </h3>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ExternalLink size={14} /> Abrir no n8n
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[600px]">
                        <pre className="text-xs md:text-sm whitespace-pre-wrap">
                          {renderFlowCode(selectedFlow)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Este fluxo pode ser importado diretamente no n8n através do formato JSON. A estrutura acima representa o pseudocódigo do workflow.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 border rounded-md bg-gray-50">
                  <p className="text-gray-500 mb-4">Selecione um fluxo na aba "Lista de Fluxos" para visualizar seus detalhes.</p>
                  <Button variant="outline" onClick={() => document.querySelector('[value="workflow_list"]')?.click()}>
                    Ver Lista de Fluxos
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-between max-w-4xl mx-auto mt-10">
          <Link to="/">
            <Button variant="outline" className="flex items-center">
              <ArrowLeft size={16} className="mr-2" /> Página Inicial
            </Button>
          </Link>
          <Link to="/arquitetura">
            <Button className="flex items-center">
              Arquitetura <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Fluxos;
