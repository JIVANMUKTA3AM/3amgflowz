export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      invoices: {
        Row: {
          amount: number
          created_at: string
          description: string
          due_date: string
          id: string
          organization_id: string | null
          payment_data: Json | null
          payment_date: string | null
          payment_id: string | null
          payment_method: string | null
          payment_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          due_date: string
          id?: string
          organization_id?: string | null
          payment_data?: Json | null
          payment_date?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_url?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          organization_id?: string | null
          payment_data?: Json | null
          payment_date?: string | null
          payment_id?: string | null
          payment_method?: string | null
          payment_url?: string | null
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
      profiles: {
        Row: {
          agent_settings: Json | null
          created_at: string
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          agent_settings?: Json | null
          created_at?: string
          id: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          agent_settings?: Json | null
          created_at?: string
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
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
      membership_role: "owner" | "admin" | "member" | "viewer"
      subscription_plan: "free" | "pro" | "enterprise"
      subscription_plan_type: "free" | "basic" | "premium" | "enterprise"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "unpaid"
        | "incomplete"
      user_role: "admin" | "user" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_type: ["atendimento", "comercial", "suporte_tecnico"],
      membership_role: ["owner", "admin", "member", "viewer"],
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
    },
  },
} as const
