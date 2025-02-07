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
      bookmarks: {
        Row: {
          created_at: string
          id: number
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string
          id: string
          request_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          request_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchased_users: {
        Row: {
          created_at: string
          id: string
          response_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          response_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          response_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_users_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "response_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchased_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      request_posts: {
        Row: {
          category: string[]
          content: string
          country_city: string
          created_at: string
          credit: number
          date_end: string | null
          id: string
          title: string
          translated_content: string | null
          translated_title: string | null
          user_id: string
        }
        Insert: {
          category: string[]
          content: string
          country_city: string
          created_at?: string
          credit: number
          date_end?: string | null
          id?: string
          title: string
          translated_content?: string | null
          translated_title?: string | null
          user_id: string
        }
        Update: {
          category?: string[]
          content?: string
          country_city?: string
          created_at?: string
          credit?: number
          date_end?: string | null
          id?: string
          title?: string
          translated_content?: string | null
          translated_title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_post_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      response_posts: {
        Row: {
          content_html: string
          created_at: string
          free_content: string
          id: number
          request_id: string
          title: string
          translated_content: string
          translated_free_content: string
          translated_title: string
          user_id: string
          verified_country: string | null
        }
        Insert: {
          content_html: string
          created_at?: string
          free_content: string
          id?: number
          request_id?: string
          title: string
          translated_content: string
          translated_free_content: string
          translated_title: string
          user_id: string
          verified_country?: string | null
        }
        Update: {
          content_html?: string
          created_at?: string
          free_content?: string
          id?: number
          request_id?: string
          title?: string
          translated_content?: string
          translated_free_content?: string
          translated_title?: string
          user_id?: string
          verified_country?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "response_post_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "response_posts_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "request_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          id: number
          response_id: number
          review: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          response_id: number
          review: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          response_id?: number
          review?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "response_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          authenticated: boolean | null
          country: string | null
          country_verified: boolean | null
          created_at: string
          credit: number | null
          email: string | null
          id: string
          introduction: string | null
          nickname: string | null
          profile_img: string | null
        }
        Insert: {
          authenticated?: boolean | null
          country?: string | null
          country_verified?: boolean | null
          created_at?: string
          credit?: number | null
          email?: string | null
          id: string
          introduction?: string | null
          nickname?: string | null
          profile_img?: string | null
        }
        Update: {
          authenticated?: boolean | null
          country?: string | null
          country_verified?: boolean | null
          created_at?: string
          credit?: number | null
          email?: string | null
          id?: string
          introduction?: string | null
          nickname?: string | null
          profile_img?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_and_sort_posts: {
        Args: {
          keyword: string
          page_limit?: number
          page_offset?: number
        }
        Returns: Json
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
