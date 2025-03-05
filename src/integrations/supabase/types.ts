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
      called_numbers: {
        Row: {
          called_at: string
          id: string
          number: number
          room_id: string
        }
        Insert: {
          called_at?: string
          id?: string
          number: number
          room_id: string
        }
        Update: {
          called_at?: string
          id?: string
          number?: number
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "called_numbers_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      current_number: {
        Row: {
          id: number
          number: number
          timestamp: string | null
        }
        Insert: {
          id?: number
          number: number
          timestamp?: string | null
        }
        Update: {
          id?: number
          number?: number
          timestamp?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          id: string
          is_host: boolean
          is_ready: boolean
          joined_at: string
          name: string
          room_id: string
        }
        Insert: {
          id?: string
          is_host?: boolean
          is_ready?: boolean
          joined_at?: string
          name: string
          room_id: string
        }
        Update: {
          id?: string
          is_host?: boolean
          is_ready?: boolean
          joined_at?: string
          name?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          auto_mark_enabled: boolean
          code: string
          created_at: string
          host_id: string
          host_name: string
          id: string
          max_players: number
          number_call_speed: number
          status: string
          ticket_price: number
          winning_patterns: Json
        }
        Insert: {
          auto_mark_enabled?: boolean
          code: string
          created_at?: string
          host_id: string
          host_name: string
          id?: string
          max_players?: number
          number_call_speed?: number
          status?: string
          ticket_price?: number
          winning_patterns?: Json
        }
        Update: {
          auto_mark_enabled?: boolean
          code?: string
          created_at?: string
          host_id?: string
          host_name?: string
          id?: string
          max_players?: number
          number_call_speed?: number
          status?: string
          ticket_price?: number
          winning_patterns?: Json
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          id: string
          marked_numbers: Json
          numbers: Json
          player_id: string
          room_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          marked_numbers?: Json
          numbers: Json
          player_id: string
          room_id: string
        }
        Update: {
          created_at?: string
          id?: string
          marked_numbers?: Json
          numbers?: Json
          player_id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      winners: {
        Row: {
          claimed_at: string
          id: string
          pattern: string
          player_id: string
          room_id: string
        }
        Insert: {
          claimed_at?: string
          id?: string
          pattern: string
          player_id: string
          room_id: string
        }
        Update: {
          claimed_at?: string
          id?: string
          pattern?: string
          player_id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winners_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winners_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_room_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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
