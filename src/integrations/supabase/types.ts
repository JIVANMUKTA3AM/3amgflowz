export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      Agendamentos: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      agent_configurations: {
        Row: {
          agent_type: string
          created_at: string
          id: string
          is_active: boolean | null
          max_tokens: number | null
          model: string
          name: string
          prompt: string
          temperature: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_tokens?: number | null
          model?: string
          name: string
          prompt: string
          temperature?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_tokens?: number | null
          model?: string
          name?: string
          prompt?: string
          temperature?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agent_conversations: {
        Row: {
          agent_configuration_id: string
          agent_response: string
          created_at: string
          id: string
          model_used: string | null
          response_time_ms: number | null
          session_id: string
          tokens_used: number | null
          user_id: string
          user_message: string
        }
        Insert: {
          agent_configuration_id: string
          agent_response: string
          created_at?: string
          id?: string
          model_used?: string | null
          response_time_ms?: number | null
          session_id: string
          tokens_used?: number | null
          user_id: string
          user_message: string
        }
        Update: {
          agent_configuration_id?: string
          agent_response?: string
          created_at?: string
          id?: string
          model_used?: string | null
          response_time_ms?: number | null
          session_id?: string
          tokens_used?: number | null
          user_id?: string
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_conversations_agent_configuration_id_fkey"
            columns: ["agent_configuration_id"]
            isOneToOne: false
            referencedRelation: "agent_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_integrations: {
        Row: {
          agent_configuration_id: string
          api_credentials: Json | null
          created_at: string
          id: string
          integration_name: string
          integration_type: string
          is_active: boolean
          last_sync_at: string | null
          settings: Json | null
          telegram_config: Json | null
          updated_at: string
          webhook_endpoints: Json | null
        }
        Insert: {
          agent_configuration_id: string
          api_credentials?: Json | null
          created_at?: string
          id?: string
          integration_name: string
          integration_type: string
          is_active?: boolean
          last_sync_at?: string | null
          settings?: Json | null
          telegram_config?: Json | null
          updated_at?: string
          webhook_endpoints?: Json | null
        }
        Update: {
          agent_configuration_id?: string
          api_credentials?: Json | null
          created_at?: string
          id?: string
          integration_name?: string
          integration_type?: string
          is_active?: boolean
          last_sync_at?: string | null
          settings?: Json | null
          telegram_config?: Json | null
          updated_at?: string
          webhook_endpoints?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_integrations_agent_configuration_id_fkey"
            columns: ["agent_configuration_id"]
            isOneToOne: false
            referencedRelation: "agent_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_metrics: {
        Row: {
          agent_configuration_id: string
          avg_response_time_ms: number | null
          created_at: string
          date: string
          id: string
          total_conversations: number | null
          total_tokens_used: number | null
          updated_at: string
          user_satisfaction_avg: number | null
        }
        Insert: {
          agent_configuration_id: string
          avg_response_time_ms?: number | null
          created_at?: string
          date: string
          id?: string
          total_conversations?: number | null
          total_tokens_used?: number | null
          updated_at?: string
          user_satisfaction_avg?: number | null
        }
        Update: {
          agent_configuration_id?: string
          avg_response_time_ms?: number | null
          created_at?: string
          date?: string
          id?: string
          total_conversations?: number | null
          total_tokens_used?: number | null
          updated_at?: string
          user_satisfaction_avg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_metrics_agent_configuration_id_fkey"
            columns: ["agent_configuration_id"]
            isOneToOne: false
            referencedRelation: "agent_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_workflows: {
        Row: {
          agent_configuration_id: string
          configuration: Json | null
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          webhook_secret: string | null
          webhook_url: string | null
          workflow_name: string
          workflow_type: string
        }
        Insert: {
          agent_configuration_id: string
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
          workflow_name: string
          workflow_type: string
        }
        Update: {
          agent_configuration_id?: string
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
          workflow_name?: string
          workflow_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_workflows_agent_configuration_id_fkey"
            columns: ["agent_configuration_id"]
            isOneToOne: false
            referencedRelation: "agent_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          base_price: number
          created_at: string
          description: string
          features: Json
          id: string
          name: string
          type: Database["public"]["Enums"]["agent_type"]
          updated_at: string
        }
        Insert: {
          base_price: number
          created_at?: string
          description: string
          features: Json
          id?: string
          name: string
          type: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Update: {
          base_price?: number
          created_at?: string
          description?: string
          features?: Json
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Relationships: []
      }
      atendimentos_gerais: {
        Row: {
          agent_id: string
          cliente_contato: string | null
          cliente_nome: string
          created_at: string | null
          data_abertura: string | null
          data_conclusao: string | null
          descricao: string
          id: string
          observacoes: string | null
          prioridade: Database["public"]["Enums"]["prioridade_level"] | null
          status: Database["public"]["Enums"]["atividade_status"] | null
          tipo_atendimento: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          cliente_contato?: string | null
          cliente_nome: string
          created_at?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          descricao: string
          id?: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_level"] | null
          status?: Database["public"]["Enums"]["atividade_status"] | null
          tipo_atendimento: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          cliente_contato?: string | null
          cliente_nome?: string
          created_at?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          descricao?: string
          id?: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_level"] | null
          status?: Database["public"]["Enums"]["atividade_status"] | null
          tipo_atendimento?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      automation_data: {
        Row: {
          agent_configuration_id: string
          created_at: string
          data_key: string
          data_type: string
          data_value: Json
          expires_at: string | null
          id: string
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          agent_configuration_id: string
          created_at?: string
          data_key: string
          data_type: string
          data_value: Json
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          agent_configuration_id?: string
          created_at?: string
          data_key?: string
          data_type?: string
          data_value?: Json
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_data_agent_configuration_id_fkey"
            columns: ["agent_configuration_id"]
            isOneToOne: false
            referencedRelation: "agent_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_logs: {
        Row: {
          error_message: string | null
          executed_at: string
          execution_status: string
          execution_time_ms: number | null
          id: string
          result_data: Json | null
          rule_id: string
          trigger_data: Json | null
        }
        Insert: {
          error_message?: string | null
          executed_at?: string
          execution_status: string
          execution_time_ms?: number | null
          id?: string
          result_data?: Json | null
          rule_id: string
          trigger_data?: Json | null
        }
        Update: {
          error_message?: string | null
          executed_at?: string
          execution_status?: string
          execution_time_ms?: number | null
          id?: string
          result_data?: Json | null
          rule_id?: string
          trigger_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_logs_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          action_config: Json
          action_type: string
          created_at: string
          description: string | null
          execution_count: number | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          name: string
          trigger_config: Json
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_config: Json
          action_type: string
          created_at?: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name: string
          trigger_config: Json
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_config?: Json
          action_type?: string
          created_at?: string
          description?: string | null
          execution_count?: number | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          name?: string
          trigger_config?: Json
          trigger_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      client_interactions: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          interaction_type: string
          metadata: Json | null
          next_action: string | null
          next_action_date: string | null
          outcome: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          interaction_type: string
          metadata?: Json | null
          next_action?: string | null
          next_action_date?: string | null
          outcome?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          interaction_type?: string
          metadata?: Json | null
          next_action?: string | null
          next_action_date?: string | null
          outcome?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_interactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: Json | null
          company_name: string | null
          created_at: string
          custom_fields: Json | null
          document: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          segment: string | null
          status: string | null
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: Json | null
          company_name?: string | null
          created_at?: string
          custom_fields?: Json | null
          document?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          segment?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: Json | null
          company_name?: string | null
          created_at?: string
          custom_fields?: Json | null
          document?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          segment?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      dashboard_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number | null
          period_date: string
          period_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value?: number | null
          period_date: string
          period_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number | null
          period_date?: string
          period_type?: string
          user_id?: string
        }
        Relationships: []
      }
      historico_financeiro: {
        Row: {
          agent_id: string | null
          created_at: string
          dados_extras: Json | null
          data_processamento: string | null
          data_transacao: string
          descricao: string
          id: string
          metodo_pagamento: string | null
          referencia_id: string | null
          referencia_tipo: string | null
          status: string
          tipo_transacao: string
          user_id: string
          valor: number
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          dados_extras?: Json | null
          data_processamento?: string | null
          data_transacao?: string
          descricao: string
          id?: string
          metodo_pagamento?: string | null
          referencia_id?: string | null
          referencia_tipo?: string | null
          status?: string
          tipo_transacao: string
          user_id: string
          valor: number
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          dados_extras?: Json | null
          data_processamento?: string | null
          data_transacao?: string
          descricao?: string
          id?: string
          metodo_pagamento?: string | null
          referencia_id?: string | null
          referencia_tipo?: string | null
          status?: string
          tipo_transacao?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      integracoes_n8n: {
        Row: {
          created_at: string | null
          created_by: string
          descricao: string | null
          evento_associado: Database["public"]["Enums"]["evento_type"]
          id: string
          is_active: boolean | null
          nome: string
          tipo_execucao: string | null
          updated_at: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          descricao?: string | null
          evento_associado: Database["public"]["Enums"]["evento_type"]
          id?: string
          is_active?: boolean | null
          nome: string
          tipo_execucao?: string | null
          updated_at?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          descricao?: string | null
          evento_associado?: Database["public"]["Enums"]["evento_type"]
          id?: string
          is_active?: boolean | null
          nome?: string
          tipo_execucao?: string | null
          updated_at?: string | null
          webhook_url?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          agent_id: string | null
          amount: number
          cliente_nome: string | null
          cliente_telefone: string | null
          created_at: string
          dados_servico: Json | null
          description: string
          due_date: string
          id: string
          organization_id: string | null
          payment_data: Json | null
          payment_date: string | null
          payment_id: string | null
          payment_method: string | null
          payment_url: string | null
          servico_tipo: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          amount: number
          cliente_nome?: string | null
          cliente_telefone?: string | null
          created_at?: string
          dados_servico?: Json | null
          description: string
          due_date: string
          id?: string
          organization_id?: string | null
          payment_data?: Json | null
          payment_date?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_url?: string | null
          servico_tipo?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_id?: string | null
          amount?: number
          cliente_nome?: string | null
          cliente_telefone?: string | null
          created_at?: string
          dados_servico?: Json | null
          description?: string
          due_date?: string
          id?: string
          organization_id?: string | null
          payment_data?: Json | null
          payment_date?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_url?: string | null
          servico_tipo?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["membership_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: Database["public"]["Enums"]["membership_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["membership_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      mensalidades: {
        Row: {
          agent_id: string | null
          cliente_email: string | null
          cliente_nome: string
          cliente_telefone: string | null
          created_at: string
          data_pagamento: string | null
          data_vencimento: string
          id: string
          metodo_pagamento: string | null
          observacoes: string | null
          plano_tipo: string
          status: string
          updated_at: string
          user_id: string
          valor_mensal: number
        }
        Insert: {
          agent_id?: string | null
          cliente_email?: string | null
          cliente_nome: string
          cliente_telefone?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          plano_tipo: string
          status?: string
          updated_at?: string
          user_id: string
          valor_mensal: number
        }
        Update: {
          agent_id?: string | null
          cliente_email?: string | null
          cliente_nome?: string
          cliente_telefone?: string | null
          created_at?: string
          data_pagamento?: string | null
          data_vencimento?: string
          id?: string
          metodo_pagamento?: string | null
          observacoes?: string | null
          plano_tipo?: string
          status?: string
          updated_at?: string
          user_id?: string
          valor_mensal?: number
        }
        Relationships: []
      }
      n8n_execution_logs: {
        Row: {
          erro_message: string | null
          executado_por: string | null
          id: string
          integracao_id: string
          payload_enviado: Json | null
          resposta_recebida: Json | null
          status_resposta: number | null
          timestamp_execucao: string | null
          tipo_execucao: string | null
        }
        Insert: {
          erro_message?: string | null
          executado_por?: string | null
          id?: string
          integracao_id: string
          payload_enviado?: Json | null
          resposta_recebida?: Json | null
          status_resposta?: number | null
          timestamp_execucao?: string | null
          tipo_execucao?: string | null
        }
        Update: {
          erro_message?: string | null
          executado_por?: string | null
          id?: string
          integracao_id?: string
          payload_enviado?: Json | null
          resposta_recebida?: Json | null
          status_resposta?: number | null
          timestamp_execucao?: string | null
          tipo_execucao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "n8n_execution_logs_integracao_id_fkey"
            columns: ["integracao_id"]
            isOneToOne: false
            referencedRelation: "integracoes_n8n"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          created_at: string
          email_enabled: boolean | null
          frequency: string | null
          id: string
          preferences: Json | null
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          sms_enabled: boolean | null
          system_enabled: boolean | null
          updated_at: string
          user_id: string
          whatsapp_enabled: boolean | null
        }
        Insert: {
          created_at?: string
          email_enabled?: boolean | null
          frequency?: string | null
          id?: string
          preferences?: Json | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean | null
          system_enabled?: boolean | null
          updated_at?: string
          user_id: string
          whatsapp_enabled?: boolean | null
        }
        Update: {
          created_at?: string
          email_enabled?: boolean | null
          frequency?: string | null
          id?: string
          preferences?: Json | null
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          sms_enabled?: boolean | null
          system_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          whatsapp_enabled?: boolean | null
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          subject: string | null
          type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string | null
          type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channel: string
          content: string
          created_at: string
          id: string
          metadata: Json | null
          read_at: string | null
          sent_at: string | null
          status: string
          template_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          channel: string
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          template_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          channel?: string
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read_at?: string | null
          sent_at?: string | null
          status?: string
          template_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      olt_configurations: {
        Row: {
          brand: string
          created_at: string | null
          id: string
          ip_address: string
          is_active: boolean | null
          model: string
          name: string
          password: string | null
          port: string | null
          snmp_community: string | null
          updated_at: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          brand: string
          created_at?: string | null
          id?: string
          ip_address: string
          is_active?: boolean | null
          model: string
          name: string
          password?: string | null
          port?: string | null
          snmp_community?: string | null
          updated_at?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          brand?: string
          created_at?: string | null
          id?: string
          ip_address?: string
          is_active?: boolean | null
          model?: string
          name?: string
          password?: string | null
          port?: string | null
          snmp_community?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      onboarding_configurations: {
        Row: {
          agent_configs: Json
          created_at: string
          crm_config: Json | null
          id: string
          is_completed: boolean
          olt_configs: Json | null
          selected_services: Json
          updated_at: string
          user_id: string
          webhook_config: Json | null
          whatsapp_config: Json | null
        }
        Insert: {
          agent_configs?: Json
          created_at?: string
          crm_config?: Json | null
          id?: string
          is_completed?: boolean
          olt_configs?: Json | null
          selected_services?: Json
          updated_at?: string
          user_id: string
          webhook_config?: Json | null
          whatsapp_config?: Json | null
        }
        Update: {
          agent_configs?: Json
          created_at?: string
          crm_config?: Json | null
          id?: string
          is_completed?: boolean
          olt_configs?: Json | null
          selected_services?: Json
          updated_at?: string
          user_id?: string
          webhook_config?: Json | null
          whatsapp_config?: Json | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          configuration: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          method_type: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          method_type: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          method_type?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          description: string | null
          external_transaction_id: string | null
          id: string
          metadata: Json | null
          payment_method_id: string | null
          processed_at: string | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          description?: string | null
          external_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          processed_at?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          description?: string | null
          external_transaction_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method_id?: string | null
          processed_at?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          agent_settings: Json | null
          created_at: string
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_role_type: Database["public"]["Enums"]["user_role_type"] | null
        }
        Insert: {
          agent_settings?: Json | null
          created_at?: string
          id: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_role_type?: Database["public"]["Enums"]["user_role_type"] | null
        }
        Update: {
          agent_settings?: Json | null
          created_at?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_role_type?: Database["public"]["Enums"]["user_role_type"] | null
        }
        Relationships: []
      }
      propostas_comerciais: {
        Row: {
          agent_id: string
          cliente_email: string | null
          cliente_nome: string
          cliente_telefone: string | null
          created_at: string | null
          data_abertura: string | null
          data_conclusao: string | null
          id: string
          observacoes: string | null
          plano_interesse: string
          prioridade: Database["public"]["Enums"]["prioridade_level"] | null
          status: Database["public"]["Enums"]["atividade_status"] | null
          updated_at: string | null
          valor_proposto: number | null
        }
        Insert: {
          agent_id: string
          cliente_email?: string | null
          cliente_nome: string
          cliente_telefone?: string | null
          created_at?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          id?: string
          observacoes?: string | null
          plano_interesse: string
          prioridade?: Database["public"]["Enums"]["prioridade_level"] | null
          status?: Database["public"]["Enums"]["atividade_status"] | null
          updated_at?: string | null
          valor_proposto?: number | null
        }
        Update: {
          agent_id?: string
          cliente_email?: string | null
          cliente_nome?: string
          cliente_telefone?: string | null
          created_at?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          id?: string
          observacoes?: string | null
          plano_interesse?: string
          prioridade?: Database["public"]["Enums"]["prioridade_level"] | null
          status?: Database["public"]["Enums"]["atividade_status"] | null
          updated_at?: string | null
          valor_proposto?: number | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          data: Json | null
          expires_at: string | null
          file_url: string | null
          generated_at: string | null
          id: string
          parameters: Json | null
          report_name: string
          report_type: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          file_url?: string | null
          generated_at?: string | null
          id?: string
          parameters?: Json | null
          report_name: string
          report_type: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          file_url?: string | null
          generated_at?: string | null
          id?: string
          parameters?: Json | null
          report_name?: string
          report_type?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sales_pipeline: {
        Row: {
          actual_close_date: string | null
          client_id: string
          created_at: string
          expected_close_date: string | null
          id: string
          notes: string | null
          opportunity_name: string
          probability: number | null
          source: string | null
          stage: string
          updated_at: string
          user_id: string
          value: number | null
        }
        Insert: {
          actual_close_date?: string | null
          client_id: string
          created_at?: string
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          opportunity_name: string
          probability?: number | null
          source?: string | null
          stage: string
          updated_at?: string
          user_id: string
          value?: number | null
        }
        Update: {
          actual_close_date?: string | null
          client_id?: string
          created_at?: string
          expected_close_date?: string | null
          id?: string
          notes?: string | null
          opportunity_name?: string
          probability?: number | null
          source?: string | null
          stage?: string
          updated_at?: string
          user_id?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_pipeline_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_id: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_id?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscribers_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_history: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          new_plan: Database["public"]["Enums"]["subscription_plan_type"] | null
          new_status: Database["public"]["Enums"]["subscription_status"] | null
          old_plan: Database["public"]["Enums"]["subscription_plan_type"] | null
          old_status: Database["public"]["Enums"]["subscription_status"] | null
          stripe_event_id: string | null
          subscription_id: string
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          new_plan?:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          new_status?: Database["public"]["Enums"]["subscription_status"] | null
          old_plan?:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          old_status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_event_id?: string | null
          subscription_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          new_plan?:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          new_status?: Database["public"]["Enums"]["subscription_status"] | null
          old_plan?:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          old_status?: Database["public"]["Enums"]["subscription_status"] | null
          stripe_event_id?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          billing_interval: string
          created_at: string
          description: string | null
          features: Json
          id: string
          is_active: boolean | null
          name: string
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          price_amount: number
          price_currency: string
          sort_order: number | null
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          billing_interval?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          name: string
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          price_amount: number
          price_currency?: string
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          billing_interval?: string
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          name?: string
          plan_type?: Database["public"]["Enums"]["subscription_plan_type"]
          price_amount?: number
          price_currency?: string
          sort_order?: number | null
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          price_amount: number | null
          price_currency: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["subscription_plan_type"]
          price_amount?: number | null
          price_currency?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["subscription_plan_type"]
          price_amount?: number | null
          price_currency?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          id: string
          is_encrypted: boolean | null
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_encrypted?: boolean | null
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_encrypted?: boolean | null
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      telegram_configurations: {
        Row: {
          bot_token: string
          bot_username: string | null
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          bot_token: string
          bot_username?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          bot_token?: string
          bot_username?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      tickets_tecnicos: {
        Row: {
          agent_id: string
          cliente_endereco: string | null
          cliente_nome: string
          cliente_telefone: string | null
          created_at: string | null
          data_abertura: string | null
          data_conclusao: string | null
          descricao: string
          id: string
          observacoes: string | null
          prioridade: Database["public"]["Enums"]["prioridade_level"] | null
          status: Database["public"]["Enums"]["atividade_status"] | null
          tipo_servico: string
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          cliente_endereco?: string | null
          cliente_nome: string
          cliente_telefone?: string | null
          created_at?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          descricao: string
          id?: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_level"] | null
          status?: Database["public"]["Enums"]["atividade_status"] | null
          tipo_servico: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          cliente_endereco?: string | null
          cliente_nome?: string
          cliente_telefone?: string | null
          created_at?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          descricao?: string
          id?: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_level"] | null
          status?: Database["public"]["Enums"]["atividade_status"] | null
          tipo_servico?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_agents: {
        Row: {
          agent_type: Database["public"]["Enums"]["agent_type"]
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          agent_type: Database["public"]["Enums"]["agent_type"]
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          agent_type?: Database["public"]["Enums"]["agent_type"]
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          agent_id: string | null
          agent_type: string | null
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          source: string | null
          status: string | null
          timestamp: string
        }
        Insert: {
          agent_id?: string | null
          agent_type?: string | null
          created_at?: string
          event_type: string
          id?: string
          payload?: Json | null
          source?: string | null
          status?: string | null
          timestamp?: string
        }
        Update: {
          agent_id?: string | null
          agent_type?: string | null
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          source?: string | null
          status?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          erro_message: string | null
          id: string
          payload_enviado: Json | null
          resposta_recebida: Json | null
          status_http: number | null
          timestamp_execucao: string | null
          webhook_id: string
        }
        Insert: {
          erro_message?: string | null
          id?: string
          payload_enviado?: Json | null
          resposta_recebida?: Json | null
          status_http?: number | null
          timestamp_execucao?: string | null
          webhook_id: string
        }
        Update: {
          erro_message?: string | null
          id?: string
          payload_enviado?: Json | null
          resposta_recebida?: Json | null
          status_http?: number | null
          timestamp_execucao?: string | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          created_by: string
          evento: Database["public"]["Enums"]["evento_type"]
          headers: Json | null
          id: string
          is_active: boolean | null
          nome: string
          updated_at: string | null
          url_destino: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          evento: Database["public"]["Enums"]["evento_type"]
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          nome: string
          updated_at?: string | null
          url_destino: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          evento?: Database["public"]["Enums"]["evento_type"]
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          nome?: string
          updated_at?: string | null
          url_destino?: string
        }
        Relationships: []
      }
      workflow_executions: {
        Row: {
          agent_configuration_id: string
          completed_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          result_data: Json | null
          started_at: string
          status: string
          trigger_data: Json | null
          trigger_type: string
          workflow_id: string
        }
        Insert: {
          agent_configuration_id: string
          completed_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          result_data?: Json | null
          started_at?: string
          status?: string
          trigger_data?: Json | null
          trigger_type: string
          workflow_id: string
        }
        Update: {
          agent_configuration_id?: string
          completed_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          result_data?: Json | null
          started_at?: string
          status?: string
          trigger_data?: Json | null
          trigger_type?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_agent_configuration_id_fkey"
            columns: ["agent_configuration_id"]
            isOneToOne: false
            referencedRelation: "agent_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "agent_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_member_of: {
        Args: { org_id: string }
        Returns: boolean
      }
      mark_invoice_as_paid: {
        Args: {
          p_invoice_id: string
          p_payment_method: string
          p_payment_id: string
          p_payment_data: Json
        }
        Returns: boolean
      }
    }
    Enums: {
      agent_type: "atendimento" | "comercial" | "suporte_tecnico"
      atividade_status:
        | "pendente"
        | "em_andamento"
        | "concluida"
        | "cancelada"
        | "pausada"
      evento_type:
        | "novo_ticket"
        | "conclusao_servico"
        | "venda_concluida"
        | "instalacao_agendada"
        | "pagamento_recebido"
        | "cliente_cadastrado"
      membership_role: "owner" | "admin" | "member" | "viewer"
      prioridade_level: "baixa" | "media" | "alta" | "urgente"
      subscription_plan: "free" | "pro" | "enterprise"
      subscription_plan_type: "free" | "basic" | "premium" | "enterprise"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "unpaid"
        | "incomplete"
      user_role: "admin" | "user" | "viewer"
      user_role_type: "tecnico" | "comercial" | "geral" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_type: ["atendimento", "comercial", "suporte_tecnico"],
      atividade_status: [
        "pendente",
        "em_andamento",
        "concluida",
        "cancelada",
        "pausada",
      ],
      evento_type: [
        "novo_ticket",
        "conclusao_servico",
        "venda_concluida",
        "instalacao_agendada",
        "pagamento_recebido",
        "cliente_cadastrado",
      ],
      membership_role: ["owner", "admin", "member", "viewer"],
      prioridade_level: ["baixa", "media", "alta", "urgente"],
      subscription_plan: ["free", "pro", "enterprise"],
      subscription_plan_type: ["free", "basic", "premium", "enterprise"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "unpaid",
        "incomplete",
      ],
      user_role: ["admin", "user", "viewer"],
      user_role_type: ["tecnico", "comercial", "geral", "admin"],
    },
  },
} as const
