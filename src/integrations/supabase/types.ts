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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achieved_on: string | null
          category: string
          created_at: string
          credential_url: string
          description: string
          id: string
          image_path: string | null
          organization: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          achieved_on?: string | null
          category?: string
          created_at?: string
          credential_url?: string
          description?: string
          id?: string
          image_path?: string | null
          organization?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          achieved_on?: string | null
          category?: string
          created_at?: string
          credential_url?: string
          description?: string
          id?: string
          image_path?: string | null
          organization?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          summary: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          summary?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          summary?: string
        }
        Relationships: []
      }
      admin_allowlist: {
        Row: {
          created_at: string
          email: string
        }
        Insert: {
          created_at?: string
          email: string
        }
        Update: {
          created_at?: string
          email?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_url: string
          expiry_date: string | null
          id: string
          image_path: string | null
          issue_date: string | null
          issuer: string
          name: string
          pdf_path: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          credential_url?: string
          expiry_date?: string | null
          id?: string
          image_path?: string | null
          issue_date?: string | null
          issuer?: string
          name: string
          pdf_path?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          credential_url?: string
          expiry_date?: string | null
          id?: string
          image_path?: string | null
          issue_date?: string | null
          issuer?: string
          name?: string
          pdf_path?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      coding_profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          platform: string
          sort_order: number
          stats: Json
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          url: string
          username: string
        }
        Insert: {
          created_at?: string
          display_name?: string
          id?: string
          platform: string
          sort_order?: number
          stats?: Json
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          url?: string
          username?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          platform?: string
          sort_order?: number
          stats?: Json
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          url?: string
          username?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          subject?: string
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          snapshot: Json
        }
        Insert: {
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          snapshot: Json
        }
        Update: {
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          snapshot?: Json
        }
        Relationships: []
      }
      custom_field_definitions: {
        Row: {
          created_at: string
          default_value: Json | null
          description: string
          display_location: string
          display_style: string
          field_type: string
          id: string
          is_public: boolean
          key: string
          label: string
          name: string
          options: Json
          placeholder: string
          required: boolean
          section_id: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          target: string
          updated_at: string
          validation: Json
        }
        Insert: {
          created_at?: string
          default_value?: Json | null
          description?: string
          display_location?: string
          display_style?: string
          field_type: string
          id?: string
          is_public?: boolean
          key: string
          label: string
          name?: string
          options?: Json
          placeholder?: string
          required?: boolean
          section_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          target: string
          updated_at?: string
          validation?: Json
        }
        Update: {
          created_at?: string
          default_value?: Json | null
          description?: string
          display_location?: string
          display_style?: string
          field_type?: string
          id?: string
          is_public?: boolean
          key?: string
          label?: string
          name?: string
          options?: Json
          placeholder?: string
          required?: boolean
          section_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          target?: string
          updated_at?: string
          validation?: Json
        }
        Relationships: [
          {
            foreignKeyName: "custom_field_definitions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "custom_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_field_values: {
        Row: {
          created_at: string
          entity_id: string
          field_id: string
          id: string
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          value: Json | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          field_id: string
          id?: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          value?: Json | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          field_id?: string
          id?: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "custom_field_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_section_entries: {
        Row: {
          created_at: string
          id: string
          section_id: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          section_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          section_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_section_entries_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "custom_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_sections: {
        Row: {
          category: string
          created_at: string
          description: string
          eyebrow: string
          icon: string
          id: string
          image_path: string | null
          layout: string
          name: string
          show_in_nav: boolean
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          eyebrow?: string
          icon?: string
          id?: string
          image_path?: string | null
          layout?: string
          name?: string
          show_in_nav?: boolean
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          eyebrow?: string
          icon?: string
          id?: string
          image_path?: string | null
          layout?: string
          name?: string
          show_in_nav?: boolean
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          academic_year: string
          achievements: string[]
          certifications: string[]
          cgpa: string
          coursework: string[]
          created_at: string
          degree: string
          department: string
          description: string
          end_year: string
          id: string
          institution: string
          is_current: boolean
          sort_order: number
          start_year: string
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          academic_year?: string
          achievements?: string[]
          certifications?: string[]
          cgpa?: string
          coursework?: string[]
          created_at?: string
          degree?: string
          department?: string
          description?: string
          end_year?: string
          id?: string
          institution: string
          is_current?: boolean
          sort_order?: number
          start_year?: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          academic_year?: string
          achievements?: string[]
          certifications?: string[]
          cgpa?: string
          coursework?: string[]
          created_at?: string
          degree?: string
          department?: string
          description?: string
          end_year?: string
          id?: string
          institution?: string
          is_current?: boolean
          sort_order?: number
          start_year?: string
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      experience: {
        Row: {
          achievements: string[]
          created_at: string
          description: string
          end_date: string | null
          id: string
          is_current: boolean
          kind: string
          organization: string
          position: string
          responsibilities: string[]
          sort_order: number
          start_date: string | null
          status: Database["public"]["Enums"]["content_status"]
          technologies: string[]
          updated_at: string
        }
        Insert: {
          achievements?: string[]
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          kind?: string
          organization: string
          position?: string
          responsibilities?: string[]
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          technologies?: string[]
          updated_at?: string
        }
        Update: {
          achievements?: string[]
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          is_current?: boolean
          kind?: string
          organization?: string
          position?: string
          responsibilities?: string[]
          sort_order?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          technologies?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_about: {
        Row: {
          blocks: Json
          career_objectives: string[]
          current_focus: string
          exploring_focus_note: string
          exploring_focus_topic: string
          exploring_heading: string
          exploring_topics: Json
          heading: string
          highlights: Json
          id: boolean
          interests: string[]
          intro: string
          paragraphs: string[]
          personal_interests: string[]
          philosophy: string[]
          updated_at: string
        }
        Insert: {
          blocks?: Json
          career_objectives?: string[]
          current_focus?: string
          exploring_focus_note?: string
          exploring_focus_topic?: string
          exploring_heading?: string
          exploring_topics?: Json
          heading?: string
          highlights?: Json
          id?: boolean
          interests?: string[]
          intro?: string
          paragraphs?: string[]
          personal_interests?: string[]
          philosophy?: string[]
          updated_at?: string
        }
        Update: {
          blocks?: Json
          career_objectives?: string[]
          current_focus?: string
          exploring_focus_note?: string
          exploring_focus_topic?: string
          exploring_heading?: string
          exploring_topics?: Json
          heading?: string
          highlights?: Json
          id?: boolean
          interests?: string[]
          intro?: string
          paragraphs?: string[]
          personal_interests?: string[]
          philosophy?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_profile: {
        Row: {
          availability_label: string
          availability_open: boolean
          email: string
          full_name: string
          github_url: string
          id: boolean
          initials: string
          institution: string
          linkedin_url: string
          location: string
          logo_path: string | null
          phone: string
          photo_path: string | null
          roles: string[]
          short_intro: string
          tagline: string
          updated_at: string
        }
        Insert: {
          availability_label?: string
          availability_open?: boolean
          email?: string
          full_name?: string
          github_url?: string
          id?: boolean
          initials?: string
          institution?: string
          linkedin_url?: string
          location?: string
          logo_path?: string | null
          phone?: string
          photo_path?: string | null
          roles?: string[]
          short_intro?: string
          tagline?: string
          updated_at?: string
        }
        Update: {
          availability_label?: string
          availability_open?: boolean
          email?: string
          full_name?: string
          github_url?: string
          id?: boolean
          initials?: string
          institution?: string
          linkedin_url?: string
          location?: string
          logo_path?: string | null
          phone?: string
          photo_path?: string | null
          roles?: string[]
          short_intro?: string
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          alt: string
          created_at: string
          id: string
          is_concept: boolean
          path: string
          project_id: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          is_concept?: boolean
          path: string
          project_id: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          is_concept?: boolean
          path?: string
          project_id?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sections: {
        Row: {
          body: string
          created_at: string
          id: string
          items: string[]
          kind: string
          project_id: string
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          items?: string[]
          kind: string
          project_id: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          items?: string[]
          kind?: string
          project_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "project_sections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          category: string
          cover_alt: string
          cover_is_concept: boolean
          cover_path: string | null
          created_at: string
          description: string
          featured: boolean
          github_url: string
          id: string
          live_url: string
          progress: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          summary: string
          tags: string[]
          technologies: string[]
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          category?: string
          cover_alt?: string
          cover_is_concept?: boolean
          cover_path?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          github_url?: string
          id?: string
          live_url?: string
          progress?: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          tags?: string[]
          technologies?: string[]
          title: string
          updated_at?: string
          year?: string
        }
        Update: {
          category?: string
          cover_alt?: string
          cover_is_concept?: boolean
          cover_path?: string | null
          created_at?: string
          description?: string
          featured?: boolean
          github_url?: string
          id?: string
          live_url?: string
          progress?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          tags?: string[]
          technologies?: string[]
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      resume_versions: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          id: string
          is_active: boolean
          note: string
          size_bytes: number
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          file_name?: string
          file_path: string
          id?: string
          is_active?: boolean
          note?: string
          size_bytes?: number
          updated_at?: string
          version?: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          is_active?: boolean
          note?: string
          size_bytes?: number
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          coding_topics: Json
          default_theme: string
          experience_fallback: string
          favicon_path: string | null
          footer_statement: string
          hero_description: string
          hero_gallery: Json
          hero_headline_muted: string
          hero_headline_strong: string
          hero_pills: string[]
          id: boolean
          meta_description: string
          og_image_path: string | null
          scenic_bg_path: string | null
          sections: Json
          signature_muted: string
          signature_strong: string
          site_title: string
          updated_at: string
        }
        Insert: {
          coding_topics?: Json
          default_theme?: string
          experience_fallback?: string
          favicon_path?: string | null
          footer_statement?: string
          hero_description?: string
          hero_gallery?: Json
          hero_headline_muted?: string
          hero_headline_strong?: string
          hero_pills?: string[]
          id?: boolean
          meta_description?: string
          og_image_path?: string | null
          scenic_bg_path?: string | null
          sections?: Json
          signature_muted?: string
          signature_strong?: string
          site_title?: string
          updated_at?: string
        }
        Update: {
          coding_topics?: Json
          default_theme?: string
          experience_fallback?: string
          favicon_path?: string | null
          footer_statement?: string
          hero_description?: string
          hero_gallery?: Json
          hero_headline_muted?: string
          hero_headline_strong?: string
          hero_pills?: string[]
          id?: boolean
          meta_description?: string
          og_image_path?: string | null
          scenic_bg_path?: string | null
          sections?: Json
          signature_muted?: string
          signature_strong?: string
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_categories: {
        Row: {
          code: string
          created_at: string
          description: string
          icon: string
          id: string
          label: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          code?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          label: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string
          icon?: string
          id?: string
          label?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string
          created_at: string
          icon: string
          id: string
          name: string
          note: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          icon?: string
          id?: string
          name: string
          note?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          icon?: string
          id?: string
          name?: string
          note?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_field_value_public: {
        Args: { _entity_id: string; _field_id: string }
        Returns: boolean
      }
      is_public_asset: { Args: { _path: string }; Returns: boolean }
      set_active_resume: { Args: { _id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin"
      content_status: "draft" | "published" | "archived"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
      content_status: ["draft", "published", "archived"],
    },
  },
} as const
