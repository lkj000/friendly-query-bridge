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
      api_integrations: {
        Row: {
          created_at: string
          headers: Json | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          url: string
        }
        Update: {
          created_at?: string
          headers?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      incidents_caused_by_change: {
        Row: {
          count: number | null
        }
        Insert: {
          count?: number | null
        }
        Update: {
          count?: number | null
        }
        Relationships: []
      }
      incidents_with_mcis: {
        Row: {
          count: number | null
        }
        Insert: {
          count?: number | null
        }
        Update: {
          count?: number | null
        }
        Relationships: []
      }
      incidents_with_problems: {
        Row: {
          count: number | null
        }
        Insert: {
          count?: number | null
        }
        Update: {
          count?: number | null
        }
        Relationships: []
      }
      incidentstatedata_awaitingvendorresolved: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      incidentstatedata_canceled: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      incidentstatedata_closed: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      incidentstatedata_inprogress: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      incidentstatedata_new: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      incidentstatedata_onhold: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      incidentstatedata_resolved: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      majorincidentdata_accepted: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      majorincidentdata_canceled: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      majorincidentdata_rejected: {
        Row: {
          count: number | null
          month_year: string | null
        }
        Insert: {
          count?: number | null
          month_year?: string | null
        }
        Update: {
          count?: number | null
          month_year?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      total_incidents: {
        Row: {
          count: number | null
        }
        Insert: {
          count?: number | null
        }
        Update: {
          count?: number | null
        }
        Relationships: []
      }
      vulnerability_scans: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          file_path: string | null
          id: string
          line_number: number | null
          severity: string
          source: string
          status: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          file_path?: string | null
          id?: string
          line_number?: number | null
          severity: string
          source: string
          status?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          file_path?: string | null
          id?: string
          line_number?: number | null
          severity?: string
          source?: string
          status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
