export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
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
          webhook_url: string | null
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
          webhook_url?: string | null
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
          webhook_url?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
      agent_profiles: {
        Row: {
          ativo: boolean
          configuracoes: Json
          created_at: string
          id: string
          nome: string
          prompt_ref: string
          setor: Database["public"]["Enums"]["agent_sector"]
          tenant_id: string
          tipo: Database["public"]["Enums"]["agent_type"]
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          configuracoes?: Json
          created_at?: string
          id?: string
          nome: string
          prompt_ref: string
          setor: Database["public"]["Enums"]["agent_sector"]
          tenant_id: string
          tipo: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          configuracoes?: Json
          created_at?: string
          id?: string
          nome?: string
          prompt_ref?: string
          setor?: Database["public"]["Enums"]["agent_sector"]
          tenant_id?: string
          tipo?: Database["public"]["Enums"]["agent_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_routes: {
        Row: {
          ativo: boolean
          created_at: string
          de_setor: Database["public"]["Enums"]["agent_sector"]
          id: string
          para_setor: Database["public"]["Enums"]["agent_sector"]
          prioridade: number
          regra: Json
          tenant_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          de_setor: Database["public"]["Enums"]["agent_sector"]
          id?: string
          para_setor: Database["public"]["Enums"]["agent_sector"]
          prioridade?: number
          regra?: Json
          tenant_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          de_setor?: Database["public"]["Enums"]["agent_sector"]
          id?: string
          para_setor?: Database["public"]["Enums"]["agent_sector"]
          prioridade?: number
          regra?: Json
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_routes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
      audit_logs: {
        Row: {
          acao: string
          actor: string | null
          created_at: string
          id: string
          ip_address: string | null
          payload: Json
          tenant_id: string
          user_agent: string | null
        }
        Insert: {
          acao: string
          actor?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          payload?: Json
          tenant_id: string
          user_agent?: string | null
        }
        Update: {
          acao?: string
          actor?: string | null
          created_at?: string
          id?: string
          ip_address?: string | null
          payload?: Json
          tenant_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
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
      billing_adapters: {
        Row: {
          ativo: boolean
          created_at: string
          credenciais: Json
          id: string
          last_sync_at: string | null
          provedor: Database["public"]["Enums"]["adapter_provider"]
          status_map: Json
          tenant_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          credenciais?: Json
          id?: string
          last_sync_at?: string | null
          provedor: Database["public"]["Enums"]["adapter_provider"]
          status_map?: Json
          tenant_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          credenciais?: Json
          id?: string
          last_sync_at?: string | null
          provedor?: Database["public"]["Enums"]["adapter_provider"]
          status_map?: Json
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_adapters_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_session_id: string
          content: string
          id: string
          message_type: string
          metadata: Json | null
          sent_at: string
        }
        Insert: {
          chat_session_id: string
          content: string
          id?: string
          message_type: string
          metadata?: Json | null
          sent_at?: string
        }
        Update: {
          chat_session_id?: string
          content?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_session_id_fkey"
            columns: ["chat_session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          agent_configuration_id: string
          channel_type: string
          created_at: string
          id: string
          is_active: boolean | null
          metadata: Json | null
          session_id: string
          telegram_chat_id: string | null
          updated_at: string
          user_id: string
          whatsapp_phone: string | null
        }
        Insert: {
          agent_configuration_id: string
          channel_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          session_id: string
          telegram_chat_id?: string | null
          updated_at?: string
          user_id: string
          whatsapp_phone?: string | null
        }
        Update: {
          agent_configuration_id?: string
          channel_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          session_id?: string
          telegram_chat_id?: string | null
          updated_at?: string
          user_id?: string
          whatsapp_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_agent_configuration_id_fkey"
            columns: ["agent_configuration_id"]
            isOneToOne: false
            referencedRelation: "agent_configurations"
            referencedColumns: ["id"]
          },
        ]
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
      fiscal_api_configs: {
        Row: {
          api_token: string
          api_url: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          organization_id: string | null
          provider: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          api_token: string
          api_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          provider: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          api_token?: string
          api_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string | null
          provider?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_api_configs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fiscal_notes: {
        Row: {
          cancelled_at: string | null
          created_at: string | null
          error_message: string | null
          external_id: string | null
          id: string
          invoice_id: string | null
          issued_at: string | null
          metadata: Json | null
          note_key: string | null
          note_number: string | null
          organization_id: string | null
          pdf_url: string | null
          provider: string
          status: string
          updated_at: string | null
          user_id: string
          xml_url: string | null
        }
        Insert: {
          cancelled_at?: string | null
          created_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          invoice_id?: string | null
          issued_at?: string | null
          metadata?: Json | null
          note_key?: string | null
          note_number?: string | null
          organization_id?: string | null
          pdf_url?: string | null
          provider: string
          status?: string
          updated_at?: string | null
          user_id: string
          xml_url?: string | null
        }
        Update: {
          cancelled_at?: string | null
          created_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          invoice_id?: string | null
          issued_at?: string | null
          metadata?: Json | null
          note_key?: string | null
          note_number?: string | null
          organization_id?: string | null
          pdf_url?: string | null
          provider?: string
          status?: string
          updated_at?: string | null
          user_id?: string
          xml_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fiscal_notes_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiscal_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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
      messages: {
        Row: {
          channel: string | null
          confidence: number | null
          context: string | null
          created_at: string | null
          id: number
          intent: string | null
          message_text: string | null
          sender_id: string | null
          tenant_id: string | null
        }
        Insert: {
          channel?: string | null
          confidence?: number | null
          context?: string | null
          created_at?: string | null
          id?: number
          intent?: string | null
          message_text?: string | null
          sender_id?: string | null
          tenant_id?: string | null
        }
        Update: {
          channel?: string | null
          confidence?: number | null
          context?: string | null
          created_at?: string | null
          id?: number
          intent?: string | null
          message_text?: string | null
          sender_id?: string | null
          tenant_id?: string | null
        }
        Relationships: []
      }
      monitoring_adapters: {
        Row: {
          ativo: boolean
          configuracoes: Json
          created_at: string
          credenciais: Json
          id: string
          last_sync_at: string | null
          tenant_id: string
          tipo: Database["public"]["Enums"]["monitoring_type"]
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          configuracoes?: Json
          created_at?: string
          credenciais?: Json
          id?: string
          last_sync_at?: string | null
          tenant_id: string
          tipo: Database["public"]["Enums"]["monitoring_type"]
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          configuracoes?: Json
          created_at?: string
          credenciais?: Json
          id?: string
          last_sync_at?: string | null
          tenant_id?: string
          tipo?: Database["public"]["Enums"]["monitoring_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitoring_adapters_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
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
          numero_assinantes: number | null
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
          numero_assinantes?: number | null
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
          numero_assinantes?: number | null
          olt_configs?: Json | null
          selected_services?: Json
          updated_at?: string
          user_id?: string
          webhook_config?: Json | null
          whatsapp_config?: Json | null
        }
        Relationships: []
      }
      ont_monitoring: {
        Row: {
          created_at: string
          id: string
          interface_id: string
          last_seen: string | null
          olt_configuration_id: string
          ont_id: string
          ont_serial: string
          optical_power_rx: number | null
          optical_power_tx: number | null
          status: string
          temperature: number | null
          updated_at: string
          user_id: string
          voltage: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          interface_id: string
          last_seen?: string | null
          olt_configuration_id: string
          ont_id: string
          ont_serial: string
          optical_power_rx?: number | null
          optical_power_tx?: number | null
          status?: string
          temperature?: number | null
          updated_at?: string
          user_id: string
          voltage?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          interface_id?: string
          last_seen?: string | null
          olt_configuration_id?: string
          ont_id?: string
          ont_serial?: string
          optical_power_rx?: number | null
          optical_power_tx?: number | null
          status?: string
          temperature?: number | null
          updated_at?: string
          user_id?: string
          voltage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ont_monitoring_olt_configuration_id_fkey"
            columns: ["olt_configuration_id"]
            isOneToOne: false
            referencedRelation: "olt_configurations"
            referencedColumns: ["id"]
          },
        ]
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
      planos_provedores: {
        Row: {
          ativo: boolean
          condicoes: string | null
          created_at: string
          id: string
          nome_plano: string
          preco: number
          promocao: string | null
          provedor_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          condicoes?: string | null
          created_at?: string
          id?: string
          nome_plano: string
          preco: number
          promocao?: string | null
          provedor_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          condicoes?: string | null
          created_at?: string
          id?: string
          nome_plano?: string
          preco?: number
          promocao?: string | null
          provedor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planos_provedores_provedor_id_fkey"
            columns: ["provedor_id"]
            isOneToOne: false
            referencedRelation: "providers"
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
      provider_agents: {
        Row: {
          agent_configuration_id: string | null
          agent_type: string
          created_at: string
          id: string
          is_active: boolean | null
          provider_id: string
          updated_at: string
        }
        Insert: {
          agent_configuration_id?: string | null
          agent_type: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          provider_id: string
          updated_at?: string
        }
        Update: {
          agent_configuration_id?: string | null
          agent_type?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_agents_agent_configuration_id_fkey"
            columns: ["agent_configuration_id"]
            isOneToOne: false
            referencedRelation: "agent_configurations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_agents_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_integrations: {
        Row: {
          created_at: string
          credentials: Json
          id: string
          integration_type: string
          is_active: boolean | null
          last_test_at: string | null
          last_test_result: Json | null
          last_test_status: string | null
          mode: string
          polling_interval_secs: number | null
          provider_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          credentials?: Json
          id?: string
          integration_type: string
          is_active?: boolean | null
          last_test_at?: string | null
          last_test_result?: Json | null
          last_test_status?: string | null
          mode: string
          polling_interval_secs?: number | null
          provider_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          credentials?: Json
          id?: string
          integration_type?: string
          is_active?: boolean | null
          last_test_at?: string | null
          last_test_result?: Json | null
          last_test_status?: string | null
          mode?: string
          polling_interval_secs?: number | null
          provider_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_integrations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          cnpj_id: string
          contact: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cnpj_id: string
          contact: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cnpj_id?: string
          contact?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
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
      snmp_data: {
        Row: {
          created_at: string
          data_type: string
          description: string | null
          id: string
          interface_index: number | null
          oid: string
          olt_configuration_id: string
          ont_id: string | null
          timestamp: string
          user_id: string
          value: string
        }
        Insert: {
          created_at?: string
          data_type?: string
          description?: string | null
          id?: string
          interface_index?: number | null
          oid: string
          olt_configuration_id: string
          ont_id?: string | null
          timestamp?: string
          user_id: string
          value: string
        }
        Update: {
          created_at?: string
          data_type?: string
          description?: string | null
          id?: string
          interface_index?: number | null
          oid?: string
          olt_configuration_id?: string
          ont_id?: string | null
          timestamp?: string
          user_id?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "snmp_data_olt_configuration_id_fkey"
            columns: ["olt_configuration_id"]
            isOneToOne: false
            referencedRelation: "olt_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      snmp_logs: {
        Row: {
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          oid: string | null
          olt_configuration_id: string
          operation_type: string
          response_data: Json | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          oid?: string | null
          olt_configuration_id: string
          operation_type: string
          response_data?: Json | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          oid?: string | null
          olt_configuration_id?: string
          operation_type?: string
          response_data?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "snmp_logs_olt_configuration_id_fkey"
            columns: ["olt_configuration_id"]
            isOneToOne: false
            referencedRelation: "olt_configurations"
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
      tenant_memberships: {
        Row: {
          created_at: string
          id: string
          role: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_memberships_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_plans: {
        Row: {
          ativo: boolean
          condicoes: string | null
          created_at: string
          features: Json
          id: string
          nome_plano: string
          preco: number
          promocao: string | null
          tenant_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          condicoes?: string | null
          created_at?: string
          features?: Json
          id?: string
          nome_plano: string
          preco: number
          promocao?: string | null
          tenant_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          condicoes?: string | null
          created_at?: string
          features?: Json
          id?: string
          nome_plano?: string
          preco?: number
          promocao?: string | null
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_plans_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_tickets: {
        Row: {
          assigned_to: string | null
          contato_cliente: Json
          created_at: string
          descricao: string | null
          id: string
          metadata: Json
          setor: Database["public"]["Enums"]["agent_sector"]
          status: Database["public"]["Enums"]["ticket_status"]
          tenant_id: string
          titulo: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          contato_cliente?: Json
          created_at?: string
          descricao?: string | null
          id?: string
          metadata?: Json
          setor: Database["public"]["Enums"]["agent_sector"]
          status?: Database["public"]["Enums"]["ticket_status"]
          tenant_id: string
          titulo: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          contato_cliente?: Json
          created_at?: string
          descricao?: string | null
          id?: string
          metadata?: Json
          setor?: Database["public"]["Enums"]["agent_sector"]
          status?: Database["public"]["Enums"]["ticket_status"]
          tenant_id?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_tickets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          ativo: boolean
          cnpj: string
          configuracoes: Json
          contato: Json
          created_at: string
          id: string
          nome: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cnpj: string
          configuracoes?: Json
          contato?: Json
          created_at?: string
          id?: string
          nome: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cnpj?: string
          configuracoes?: Json
          contato?: Json
          created_at?: string
          id?: string
          nome?: string
          owner_id?: string
          updated_at?: string
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
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
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
      decrypt_credential: { Args: { encrypted_text: string }; Returns: string }
      decrypt_jsonb_credentials: {
        Args: { encrypted_credentials: Json }
        Returns: Json
      }
      encrypt_credential: { Args: { credential_text: string }; Returns: string }
      encrypt_jsonb_credentials: { Args: { credentials: Json }; Returns: Json }
      get_user_tenant_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_member_of: { Args: { org_id: string }; Returns: boolean }
      is_tenant_member: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
      is_tenant_owner: {
        Args: { _tenant_id: string; _user_id: string }
        Returns: boolean
      }
      mark_invoice_as_paid: {
        Args: {
          p_invoice_id: string
          p_payment_data: Json
          p_payment_id: string
          p_payment_method: string
        }
        Returns: boolean
      }
    }
    Enums: {
      adapter_provider: "asaas" | "gerencianet" | "omie" | "outro"
      agent_sector: "triagem" | "tecnico" | "comercial" | "financeiro"
      agent_type: "atendimento" | "comercial" | "suporte_tecnico"
      app_role: "admin" | "moderator" | "user"
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
      monitoring_type: "snmp" | "vendor_api"
      prioridade_level: "baixa" | "media" | "alta" | "urgente"
      subscription_plan: "free" | "pro" | "enterprise"
      subscription_plan_type: "free" | "basic" | "premium" | "enterprise"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "unpaid"
        | "incomplete"
      ticket_status: "aberto" | "em_andamento" | "resolvido" | "fechado"
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
      adapter_provider: ["asaas", "gerencianet", "omie", "outro"],
      agent_sector: ["triagem", "tecnico", "comercial", "financeiro"],
      agent_type: ["atendimento", "comercial", "suporte_tecnico"],
      app_role: ["admin", "moderator", "user"],
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
      monitoring_type: ["snmp", "vendor_api"],
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
      ticket_status: ["aberto", "em_andamento", "resolvido", "fechado"],
      user_role: ["admin", "user", "viewer"],
      user_role_type: ["tecnico", "comercial", "geral", "admin"],
    },
  },
} as const
