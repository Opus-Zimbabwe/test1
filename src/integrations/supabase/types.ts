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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string
          created_at: string
          date_text: string
          id: string
          image_url: string | null
          location: string | null
          sort_order: number
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          date_text?: string
          id?: string
          image_url?: string | null
          location?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          date_text?: string
          id?: string
          image_url?: string | null
          location?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      app_config: {
        Row: {
          client_admin_email: string | null
          first_login_code_hash: string | null
          first_login_completed: boolean
          id: number
          paynow_integration_id: string | null
          paynow_integration_key: string | null
          paynow_key_configured: boolean
          setup_code: string | null
          setup_code_hash: string | null
          updated_at: string
        }
        Insert: {
          client_admin_email?: string | null
          first_login_code_hash?: string | null
          first_login_completed?: boolean
          id?: number
          paynow_integration_id?: string | null
          paynow_integration_key?: string | null
          paynow_key_configured?: boolean
          setup_code?: string | null
          setup_code_hash?: string | null
          updated_at?: string
        }
        Update: {
          client_admin_email?: string | null
          first_login_code_hash?: string | null
          first_login_completed?: boolean
          id?: number
          paynow_integration_id?: string | null
          paynow_integration_key?: string | null
          paynow_key_configured?: boolean
          setup_code?: string | null
          setup_code_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      books: {
        Row: {
          active: boolean
          author: string
          cover_url: string | null
          created_at: string
          description: string
          file_kind: string | null
          file_url: string | null
          id: string
          isbn: string | null
          price_usd: number
          stock: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          author?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          file_kind?: string | null
          file_url?: string | null
          id?: string
          isbn?: string | null
          price_usd?: number
          stock?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          author?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          file_kind?: string | null
          file_url?: string | null
          id?: string
          isbn?: string | null
          price_usd?: number
          stock?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          sort_order: number
          src: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          src: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          src?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          meta: Json | null
          read: boolean
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          kind: string
          meta?: Json | null
          read?: boolean
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          meta?: Json | null
          read?: boolean
          title?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          items: Json
          method: string
          paynow_instructions: string | null
          paynow_poll_url: string | null
          paynow_reference: string | null
          receipt_token: string | null
          status: string
          total_usd: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          items?: Json
          method: string
          paynow_instructions?: string | null
          paynow_poll_url?: string | null
          paynow_reference?: string | null
          receipt_token?: string | null
          status?: string
          total_usd: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          items?: Json
          method?: string
          paynow_instructions?: string | null
          paynow_poll_url?: string | null
          paynow_reference?: string | null
          receipt_token?: string | null
          status?: string
          total_usd?: number
          updated_at?: string
        }
        Relationships: []
      }
      server_secrets: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_paynow_result: {
        Args: { _field_values: string[]; _fields: Json; _order_id: string }
        Returns: Json
      }
      begin_client_admin_activation: {
        Args: { _email: string; _setup_code: string }
        Returns: Json
      }
      claim_client_admin: { Args: { _setup_code: string }; Returns: Json }
      complete_paynow_setup: {
        Args: { _integration_key: string }
        Returns: Json
      }
      create_paynow_checkout: {
        Args: {
          _customer_email: string
          _customer_name: string
          _customer_phone: string
          _items: Json
          _method: string
          _origin: string
        }
        Returns: Json
      }
      get_public_receipt: {
        Args: { _order_id: string; _receipt_token: string }
        Returns: Json
      }
      get_setup_status: {
        Args: never
        Returns: {
          client_admin_activated: boolean
          first_login_completed: boolean
          integration_id: string
          paynow_configured: boolean
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      site_admin_delete_announcement: {
        Args: { _id: string; _passcode: string }
        Returns: Json
      }
      site_admin_delete_gallery_image: {
        Args: { _id: string; _passcode: string }
        Returns: Json
      }
      site_admin_save_announcement: {
        Args: {
          _body?: string
          _date_text?: string
          _id: string
          _image_url?: string
          _location?: string
          _passcode: string
          _sort_order?: number
          _title: string
        }
        Returns: Json
      }
      site_admin_save_gallery_image: {
        Args: {
          _caption?: string
          _id: string
          _passcode: string
          _sort_order?: number
          _src: string
        }
        Returns: Json
      }
      update_checkout_paynow_details: {
        Args: {
          _instructions?: string
          _order_id: string
          _poll_url?: string
          _receipt_token: string
          _status?: string
        }
        Returns: Json
      }
      verify_site_admin_passcode: {
        Args: { _passcode: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "site_admin" | "client_admin"
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
      app_role: ["site_admin", "client_admin"],
    },
  },
} as const
