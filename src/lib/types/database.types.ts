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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_audit_logs: {
        Row: {
          conversation_id: string | null
          created_at: string
          id: string
          input_data: Json | null
          output_data: Json | null
          source_references: Json | null
          tool_name: string
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          source_references?: Json | null
          tool_name: string
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          source_references?: Json | null
          tool_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_audit_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          tool_calls: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          tool_calls?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          tool_calls?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics: {
        Row: {
          brand_id: string
          comments: number | null
          content_id: string | null
          created_at: string | null
          date: string
          engagement_rate: number | null
          followers_gained: number | null
          id: string
          impressions: number | null
          instagram_media_id: string | null
          likes: number | null
          profile_visits: number | null
          reach: number | null
          saves: number | null
          shares: number | null
          video_views: number | null
        }
        Insert: {
          brand_id: string
          comments?: number | null
          content_id?: string | null
          created_at?: string | null
          date?: string
          engagement_rate?: number | null
          followers_gained?: number | null
          id?: string
          impressions?: number | null
          instagram_media_id?: string | null
          likes?: number | null
          profile_visits?: number | null
          reach?: number | null
          saves?: number | null
          shares?: number | null
          video_views?: number | null
        }
        Update: {
          brand_id?: string
          comments?: number | null
          content_id?: string | null
          created_at?: string | null
          date?: string
          engagement_rate?: number | null
          followers_gained?: number | null
          id?: string
          impressions?: number | null
          instagram_media_id?: string | null
          likes?: number | null
          profile_visits?: number | null
          reach?: number | null
          saves?: number | null
          shares?: number | null
          video_views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      api_health: {
        Row: {
          details: Json | null
          endpoint: string | null
          error_message: string | null
          id: string
          last_tested_at: string
          latency_ms: number | null
          service_name: string
          status: string
        }
        Insert: {
          details?: Json | null
          endpoint?: string | null
          error_message?: string | null
          id: string
          last_tested_at?: string
          latency_ms?: number | null
          service_name: string
          status: string
        }
        Update: {
          details?: Json | null
          endpoint?: string | null
          error_message?: string | null
          id?: string
          last_tested_at?: string
          latency_ms?: number | null
          service_name?: string
          status?: string
        }
        Relationships: []
      }
      api_health_checks: {
        Row: {
          checked_at: string
          created_at: string
          error_message: string | null
          id: string
          latency_ms: number | null
          metadata: Json | null
          provider: string
          response_code: number | null
          service: string
          status: string
        }
        Insert: {
          checked_at?: string
          created_at?: string
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          provider: string
          response_code?: number | null
          service: string
          status: string
        }
        Update: {
          checked_at?: string
          created_at?: string
          error_message?: string | null
          id?: string
          latency_ms?: number | null
          metadata?: Json | null
          provider?: string
          response_code?: number | null
          service?: string
          status?: string
        }
        Relationships: []
      }
      api_tasks: {
        Row: {
          created_at: string
          error_code: string | null
          external_task_id: string | null
          feature: string
          id: string
          provider: string
          request_metadata: Json | null
          response_metadata: Json | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_code?: string | null
          external_task_id?: string | null
          feature: string
          id?: string
          provider?: string
          request_metadata?: Json | null
          response_metadata?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_code?: string | null
          external_task_id?: string | null
          feature?: string
          id?: string
          provider?: string
          request_metadata?: Json | null
          response_metadata?: Json | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      approvals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          content_id: string
          created_at: string | null
          id: string
          rejection_reason: string | null
          requested_at: string | null
          status: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          content_id: string
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          requested_at?: string | null
          status: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          content_id?: string
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          requested_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      automation_jobs: {
        Row: {
          brand_id: string
          completed_at: string | null
          created_at: string | null
          error: string | null
          id: string
          job_type: string
          payload: Json | null
          result: Json | null
          started_at: string | null
          status: string
        }
        Insert: {
          brand_id: string
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          job_type: string
          payload?: Json | null
          result?: Json | null
          started_at?: string | null
          status?: string
        }
        Update: {
          brand_id?: string
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          job_type?: string
          payload?: Json | null
          result?: Json | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_jobs_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      beauty_preferences: {
        Row: {
          budget: number
          created_at: string
          id: string
          occasion: string
          style: string
          user_id: string | null
        }
        Insert: {
          budget: number
          created_at?: string
          id?: string
          occasion: string
          style: string
          user_id?: string | null
        }
        Update: {
          budget?: number
          created_at?: string
          id?: string
          occasion?: string
          style?: string
          user_id?: string | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          active: boolean | null
          brand_voice: string | null
          content_language: string | null
          created_at: string | null
          description: string | null
          id: string
          instagram_account_id: string | null
          instagram_username: string | null
          name: string
          slug: string
          target_audience: string | null
          timezone: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          brand_voice?: string | null
          content_language?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          instagram_account_id?: string | null
          instagram_username?: string | null
          name: string
          slug: string
          target_audience?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          brand_voice?: string | null
          content_language?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          instagram_account_id?: string | null
          instagram_username?: string | null
          name?: string
          slug?: string
          target_audience?: string | null
          timezone?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      content_items: {
        Row: {
          ai_score: number | null
          ai_score_breakdown: Json | null
          approval_status: string
          brand_id: string
          caption: string | null
          content_pillar: string | null
          content_type: string
          cover_text: string | null
          created_at: string | null
          cta: string | null
          hashtags: string[] | null
          hook: string | null
          id: string
          instagram_media_id: string | null
          media_url: string | null
          published_at: string | null
          scheduled_at: string | null
          script: Json | null
          status: string
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          ai_score?: number | null
          ai_score_breakdown?: Json | null
          approval_status?: string
          brand_id: string
          caption?: string | null
          content_pillar?: string | null
          content_type: string
          cover_text?: string | null
          created_at?: string | null
          cta?: string | null
          hashtags?: string[] | null
          hook?: string | null
          id?: string
          instagram_media_id?: string | null
          media_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          script?: Json | null
          status?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          ai_score?: number | null
          ai_score_breakdown?: Json | null
          approval_status?: string
          brand_id?: string
          caption?: string | null
          content_pillar?: string | null
          content_type?: string
          cover_text?: string | null
          created_at?: string | null
          cta?: string | null
          hashtags?: string[] | null
          hook?: string | null
          id?: string
          instagram_media_id?: string | null
          media_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          script?: Json | null
          status?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_items_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      content_pillars: {
        Row: {
          active: boolean | null
          brand_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          percentage: number | null
        }
        Insert: {
          active?: boolean | null
          brand_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          percentage?: number | null
        }
        Update: {
          active?: boolean | null
          brand_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_pillars_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      content_variants: {
        Row: {
          content: string
          content_id: string
          created_at: string | null
          id: string
          score: number | null
          variant_type: string
        }
        Insert: {
          content: string
          content_id: string
          created_at?: string | null
          id?: string
          score?: number | null
          variant_type: string
        }
        Update: {
          content?: string
          content_id?: string
          created_at?: string | null
          id?: string
          score?: number | null
          variant_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_variants_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content_items"
            referencedColumns: ["id"]
          },
        ]
      }
      crowd_reports: {
        Row: {
          confidence: number
          created_at: string | null
          created_by: string | null
          crowd_level: string
          expires_at: string | null
          id: string
          metro_station_id: string | null
          pandal_id: string | null
          reported_at: string
          source: string
          source_type: string
          verified: boolean | null
          wait_time_minutes: number
        }
        Insert: {
          confidence?: number
          created_at?: string | null
          created_by?: string | null
          crowd_level: string
          expires_at?: string | null
          id?: string
          metro_station_id?: string | null
          pandal_id?: string | null
          reported_at?: string
          source: string
          source_type?: string
          verified?: boolean | null
          wait_time_minutes?: number
        }
        Update: {
          confidence?: number
          created_at?: string | null
          created_by?: string | null
          crowd_level?: string
          expires_at?: string | null
          id?: string
          metro_station_id?: string | null
          pandal_id?: string | null
          reported_at?: string
          source?: string
          source_type?: string
          verified?: boolean | null
          wait_time_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "crowd_reports_metro_station_id_fkey"
            columns: ["metro_station_id"]
            isOneToOne: false
            referencedRelation: "metro_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crowd_reports_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
        ]
      }
      device_tokens: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_seen_at: string
          platform: string
          push_token: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_seen_at?: string
          platform: string
          push_token: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_seen_at?: string
          platform?: string
          push_token?: string
          user_id?: string | null
        }
        Relationships: []
      }
      festival_calendar: {
        Row: {
          created_at: string
          date: string
          description: string | null
          festival: string
          id: string
          label: string
          phase: string
          source_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          festival?: string
          id?: string
          label: string
          phase: string
          source_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          festival?: string
          id?: string
          label?: string
          phase?: string
          source_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "festival_calendar_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      food_places: {
        Row: {
          address: string
          category: string
          confidence: number
          created_at: string
          id: string
          is_active: boolean
          latitude: number
          location: unknown
          longitude: number
          name: string
          opening_status: string
          phone: string | null
          price_range: string | null
          slug: string
          source_id: string | null
          updated_at: string
          valid_until: string | null
          verified_at: string
          website: string | null
        }
        Insert: {
          address: string
          category: string
          confidence?: number
          created_at?: string
          id?: string
          is_active?: boolean
          latitude: number
          location?: unknown
          longitude: number
          name: string
          opening_status?: string
          phone?: string | null
          price_range?: string | null
          slug: string
          source_id?: string | null
          updated_at?: string
          valid_until?: string | null
          verified_at?: string
          website?: string | null
        }
        Update: {
          address?: string
          category?: string
          confidence?: number
          created_at?: string
          id?: string
          is_active?: boolean
          latitude?: number
          location?: unknown
          longitude?: number
          name?: string
          opening_status?: string
          phone?: string | null
          price_range?: string | null
          slug?: string
          source_id?: string | null
          updated_at?: string
          valid_until?: string | null
          verified_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_places_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          ambulance_number: string
          area: string
          confidence: number
          emergency_number: string
          has_emergency_icu: boolean | null
          id: string
          last_updated: string
          lat: number
          lng: number
          name: string
          nearest_metro: string | null
          source: string
          source_type: string
          source_url: string | null
          status: string
          verified_at: string
        }
        Insert: {
          address: string
          ambulance_number?: string
          area: string
          confidence?: number
          emergency_number?: string
          has_emergency_icu?: boolean | null
          id?: string
          last_updated?: string
          lat: number
          lng: number
          name: string
          nearest_metro?: string | null
          source?: string
          source_type?: string
          source_url?: string | null
          status?: string
          verified_at?: string
        }
        Update: {
          address?: string
          ambulance_number?: string
          area?: string
          confidence?: number
          emergency_number?: string
          has_emergency_icu?: boolean | null
          id?: string
          last_updated?: string
          lat?: number
          lng?: number
          name?: string
          nearest_metro?: string | null
          source?: string
          source_type?: string
          source_url?: string | null
          status?: string
          verified_at?: string
        }
        Relationships: []
      }
      metro_lines: {
        Row: {
          color: string
          first_train: string
          id: string
          last_train: string
          name: string
          operating_status: string
          puja_all_night_service: boolean | null
          source: string
          verified_at: string
        }
        Insert: {
          color: string
          first_train?: string
          id: string
          last_train?: string
          name: string
          operating_status?: string
          puja_all_night_service?: boolean | null
          source?: string
          verified_at?: string
        }
        Update: {
          color?: string
          first_train?: string
          id?: string
          last_train?: string
          name?: string
          operating_status?: string
          puja_all_night_service?: boolean | null
          source?: string
          verified_at?: string
        }
        Relationships: []
      }
      metro_schedule_snapshots: {
        Row: {
          confidence: number
          created_at: string
          day_type: string
          first_train: string | null
          frequency_notes: string | null
          id: string
          last_train: string | null
          retrieved_at: string
          service_date: string
          source_id: string | null
          special_service: boolean
          station_id: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          confidence?: number
          created_at?: string
          day_type?: string
          first_train?: string | null
          frequency_notes?: string | null
          id?: string
          last_train?: string | null
          retrieved_at?: string
          service_date: string
          source_id?: string | null
          special_service?: boolean
          station_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          confidence?: number
          created_at?: string
          day_type?: string
          first_train?: string | null
          frequency_notes?: string | null
          id?: string
          last_train?: string | null
          retrieved_at?: string
          service_date?: string
          source_id?: string | null
          special_service?: boolean
          station_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metro_schedule_snapshots_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metro_schedule_snapshots_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "metro_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      metro_stations: {
        Row: {
          code: string
          confidence: number
          crowd_level: string
          id: string
          interchange_lines: string[] | null
          is_active: boolean | null
          is_interchange: boolean | null
          last_updated: string
          lat: number | null
          latitude: number | null
          line: string | null
          line_id: string | null
          lng: number | null
          location: unknown
          longitude: number | null
          name: string
          name_bn: string
          operating_status: string
          source: string
          source_type: string
          source_url: string | null
          updated_at: string | null
          verified_at: string
        }
        Insert: {
          code: string
          confidence?: number
          crowd_level?: string
          id?: string
          interchange_lines?: string[] | null
          is_active?: boolean | null
          is_interchange?: boolean | null
          last_updated?: string
          lat?: number | null
          latitude?: number | null
          line?: string | null
          line_id?: string | null
          lng?: number | null
          location?: unknown
          longitude?: number | null
          name: string
          name_bn: string
          operating_status?: string
          source: string
          source_type?: string
          source_url?: string | null
          updated_at?: string | null
          verified_at?: string
        }
        Update: {
          code?: string
          confidence?: number
          crowd_level?: string
          id?: string
          interchange_lines?: string[] | null
          is_active?: boolean | null
          is_interchange?: boolean | null
          last_updated?: string
          lat?: number | null
          latitude?: number | null
          line?: string | null
          line_id?: string | null
          lng?: number | null
          location?: unknown
          longitude?: number | null
          name?: string
          name_bn?: string
          operating_status?: string
          source?: string
          source_type?: string
          source_url?: string | null
          updated_at?: string | null
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "metro_stations_line_id_fkey"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "metro_lines"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pandal_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          exif_metadata: Json | null
          file_size: number | null
          id: string
          is_flagged: boolean | null
          is_verified: boolean | null
          latitude: number | null
          location: unknown
          longitude: number | null
          mime_type: string | null
          pandal_id: string
          photo_url: string
          source: string
          storage_path: string | null
          taken_at: string | null
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          exif_metadata?: Json | null
          file_size?: number | null
          id?: string
          is_flagged?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          mime_type?: string | null
          pandal_id: string
          photo_url: string
          source?: string
          storage_path?: string | null
          taken_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          exif_metadata?: Json | null
          file_size?: number | null
          id?: string
          is_flagged?: boolean | null
          is_verified?: boolean | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          mime_type?: string | null
          pandal_id?: string
          photo_url?: string
          source?: string
          storage_path?: string | null
          taken_at?: string | null
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pandal_photos_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
        ]
      }
      pandal_sources: {
        Row: {
          confidence: number
          created_at: string | null
          id: string
          notes: string | null
          pandal_id: string
          published_at: string | null
          publisher: string | null
          retrieved_at: string | null
          source_id: string | null
          source_name: string | null
          source_type: string
          source_url: string
          valid_from: string | null
          valid_until: string | null
          verification_method: string | null
          verified_at: string
        }
        Insert: {
          confidence?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          pandal_id: string
          published_at?: string | null
          publisher?: string | null
          retrieved_at?: string | null
          source_id?: string | null
          source_name?: string | null
          source_type: string
          source_url: string
          valid_from?: string | null
          valid_until?: string | null
          verification_method?: string | null
          verified_at?: string
        }
        Update: {
          confidence?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          pandal_id?: string
          published_at?: string | null
          publisher?: string | null
          retrieved_at?: string | null
          source_id?: string | null
          source_name?: string | null
          source_type?: string
          source_url?: string
          valid_from?: string | null
          valid_until?: string | null
          verification_method?: string | null
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pandal_sources_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pandal_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      pandal_status_history: {
        Row: {
          confidence: number
          created_at: string
          effective_from: string
          effective_until: string | null
          id: string
          notes: string | null
          pandal_id: string
          source_id: string | null
          status: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          id?: string
          notes?: string | null
          pandal_id: string
          source_id?: string | null
          status: string
        }
        Update: {
          confidence?: number
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          id?: string
          notes?: string | null
          pandal_id?: string
          source_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "pandal_status_history_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pandal_status_history_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      pandal_themes: {
        Row: {
          confidence: number
          created_at: string
          description: string | null
          id: string
          pandal_id: string
          source_id: string | null
          theme: string
          verified_at: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          description?: string | null
          id?: string
          pandal_id: string
          source_id?: string | null
          theme: string
          verified_at?: string
        }
        Update: {
          confidence?: number
          created_at?: string
          description?: string | null
          id?: string
          pandal_id?: string
          source_id?: string | null
          theme?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pandal_themes_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pandal_themes_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      pandal_verifications: {
        Row: {
          evidence_url: string | null
          id: string
          new_status: string
          notes: string | null
          pandal_id: string
          previous_status: string | null
          verification_type: string
          verified_at: string
          verified_by: string
        }
        Insert: {
          evidence_url?: string | null
          id?: string
          new_status: string
          notes?: string | null
          pandal_id: string
          previous_status?: string | null
          verification_type: string
          verified_at?: string
          verified_by: string
        }
        Update: {
          evidence_url?: string | null
          id?: string
          new_status?: string
          notes?: string | null
          pandal_id?: string
          previous_status?: string | null
          verification_type?: string
          verified_at?: string
          verified_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "pandal_verifications_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
        ]
      }
      pandal_visits: {
        Row: {
          created_at: string | null
          crowd_experienced: string | null
          id: string
          notes: string | null
          pandal_id: string
          photo_url: string | null
          rating: number | null
          source: string
          user_id: string | null
          visited_at: string
        }
        Insert: {
          created_at?: string | null
          crowd_experienced?: string | null
          id?: string
          notes?: string | null
          pandal_id: string
          photo_url?: string | null
          rating?: number | null
          source?: string
          user_id?: string | null
          visited_at?: string
        }
        Update: {
          created_at?: string | null
          crowd_experienced?: string | null
          id?: string
          notes?: string | null
          pandal_id?: string
          photo_url?: string | null
          rating?: number | null
          source?: string
          user_id?: string | null
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pandal_visits_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
        ]
      }
      pandals: {
        Row: {
          accessibility_score: number | null
          active: boolean | null
          address: string
          area: string
          art_score: number | null
          category: string | null
          closing_time: string
          confidence: number
          cover_image_url: string | null
          created_at: string | null
          crowd_score: number | null
          description: string | null
          estimated_visit_minutes: number
          heritage: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          last_updated: string
          lat: number | null
          latitude: number | null
          lng: number | null
          location: unknown
          longitude: number | null
          metro_line: string
          name: string
          name_bn: string
          nearest_metro: string
          nearest_metro_station_id: string | null
          neighborhood: string
          opening_date: string
          opening_time: string
          overall_score: number | null
          photo_score: number | null
          puja_score: number | null
          score_methodology: string | null
          slug: string
          source: string
          source_type: string
          source_url: string | null
          status: string
          theme: string
          theme_score: number | null
          theme_source: string | null
          traditional_score: number | null
          updated_at: string | null
          verified_at: string
          walking_distance_meters: number
        }
        Insert: {
          accessibility_score?: number | null
          active?: boolean | null
          address: string
          area: string
          art_score?: number | null
          category?: string | null
          closing_time?: string
          confidence?: number
          cover_image_url?: string | null
          created_at?: string | null
          crowd_score?: number | null
          description?: string | null
          estimated_visit_minutes?: number
          heritage?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          last_updated?: string
          lat?: number | null
          latitude?: number | null
          lng?: number | null
          location?: unknown
          longitude?: number | null
          metro_line: string
          name: string
          name_bn: string
          nearest_metro: string
          nearest_metro_station_id?: string | null
          neighborhood: string
          opening_date?: string
          opening_time?: string
          overall_score?: number | null
          photo_score?: number | null
          puja_score?: number | null
          score_methodology?: string | null
          slug: string
          source: string
          source_type?: string
          source_url?: string | null
          status?: string
          theme?: string
          theme_score?: number | null
          theme_source?: string | null
          traditional_score?: number | null
          updated_at?: string | null
          verified_at?: string
          walking_distance_meters: number
        }
        Update: {
          accessibility_score?: number | null
          active?: boolean | null
          address?: string
          area?: string
          art_score?: number | null
          category?: string | null
          closing_time?: string
          confidence?: number
          cover_image_url?: string | null
          created_at?: string | null
          crowd_score?: number | null
          description?: string | null
          estimated_visit_minutes?: number
          heritage?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          last_updated?: string
          lat?: number | null
          latitude?: number | null
          lng?: number | null
          location?: unknown
          longitude?: number | null
          metro_line?: string
          name?: string
          name_bn?: string
          nearest_metro?: string
          nearest_metro_station_id?: string | null
          neighborhood?: string
          opening_date?: string
          opening_time?: string
          overall_score?: number | null
          photo_score?: number | null
          puja_score?: number | null
          score_methodology?: string | null
          slug?: string
          source?: string
          source_type?: string
          source_url?: string | null
          status?: string
          theme?: string
          theme_score?: number | null
          theme_source?: string | null
          traditional_score?: number | null
          updated_at?: string | null
          verified_at?: string
          walking_distance_meters?: number
        }
        Relationships: [
          {
            foreignKeyName: "pandals_nearest_metro_station_id_fkey"
            columns: ["nearest_metro_station_id"]
            isOneToOne: false
            referencedRelation: "metro_stations"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_stamps: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          pandal_id: string
          stamp_type: string
          user_id: string
          verification_method: string
          verified_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          pandal_id: string
          stamp_type?: string
          user_id: string
          verification_method?: string
          verified_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          pandal_id?: string
          stamp_type?: string
          user_id?: string
          verification_method?: string
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "passport_stamps_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
        ]
      }
      police_stations: {
        Row: {
          address: string
          area: string
          confidence: number
          control_room: string
          id: string
          last_updated: string
          lat: number
          lng: number
          name: string
          nearest_metro: string | null
          phone: string
          source: string
          source_type: string
          source_url: string | null
          status: string
          verified_at: string
        }
        Insert: {
          address: string
          area: string
          confidence?: number
          control_room?: string
          id?: string
          last_updated?: string
          lat: number
          lng: number
          name: string
          nearest_metro?: string | null
          phone: string
          source?: string
          source_type?: string
          source_url?: string | null
          status?: string
          verified_at?: string
        }
        Update: {
          address?: string
          area?: string
          confidence?: number
          control_room?: string
          id?: string
          last_updated?: string
          lat?: number
          lng?: number
          name?: string
          nearest_metro?: string | null
          phone?: string
          source?: string
          source_type?: string
          source_url?: string | null
          status?: string
          verified_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean | null
          affiliate_url: string | null
          brand_id: string
          category: string
          commission: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          product_url: string | null
          sale_price: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          affiliate_url?: string | null
          brand_id: string
          category: string
          commission?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          product_url?: string | null
          sale_price?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          affiliate_url?: string | null
          brand_id?: string
          category?: string
          commission?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          product_url?: string | null
          sale_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          interests: string[] | null
          preferred_language: string | null
          transport_preference: string | null
          updated_at: string
          walking_tolerance: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          interests?: string[] | null
          preferred_language?: string | null
          transport_preference?: string | null
          updated_at?: string
          walking_tolerance?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          interests?: string[] | null
          preferred_language?: string | null
          transport_preference?: string | null
          updated_at?: string
          walking_tolerance?: string | null
        }
        Relationships: []
      }
      puja_calendar: {
        Row: {
          crowd_expectation: string
          date: string
          description: string
          id: string
          is_pre_puja: boolean
          metro_service_type: string
          source: string
          source_url: string | null
          tithi_name: string
          verified_at: string
          year: number
        }
        Insert: {
          crowd_expectation?: string
          date: string
          description: string
          id: string
          is_pre_puja?: boolean
          metro_service_type?: string
          source?: string
          source_url?: string | null
          tithi_name: string
          verified_at?: string
          year?: number
        }
        Update: {
          crowd_expectation?: string
          date?: string
          description?: string
          id?: string
          is_pre_puja?: boolean
          metro_service_type?: string
          source?: string
          source_url?: string | null
          tithi_name?: string
          verified_at?: string
          year?: number
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          address: string
          area: string
          category: string
          closing_time: string | null
          confidence: number
          id: string
          is_pure_veg: boolean | null
          last_updated: string
          lat: number
          lng: number
          name: string
          nearest_metro: string | null
          opening_time: string | null
          price_level: string | null
          rating: number | null
          source: string
          source_type: string
          source_url: string | null
          specialty: string | null
          status: string
          verified_at: string
        }
        Insert: {
          address: string
          area: string
          category: string
          closing_time?: string | null
          confidence?: number
          id?: string
          is_pure_veg?: boolean | null
          last_updated?: string
          lat: number
          lng: number
          name: string
          nearest_metro?: string | null
          opening_time?: string | null
          price_level?: string | null
          rating?: number | null
          source: string
          source_type?: string
          source_url?: string | null
          specialty?: string | null
          status?: string
          verified_at?: string
        }
        Update: {
          address?: string
          area?: string
          category?: string
          closing_time?: string | null
          confidence?: number
          id?: string
          is_pure_veg?: boolean | null
          last_updated?: string
          lat?: number
          lng?: number
          name?: string
          nearest_metro?: string | null
          opening_time?: string | null
          price_level?: string | null
          rating?: number | null
          source?: string
          source_type?: string
          source_url?: string | null
          specialty?: string | null
          status?: string
          verified_at?: string
        }
        Relationships: []
      }
      route_legs: {
        Row: {
          arrival_time: string | null
          created_at: string
          departure_time: string | null
          distance_meters: number | null
          duration_seconds: number | null
          food_place_id: string | null
          geometry: Json | null
          id: string
          metro_station_id: string | null
          pandal_id: string | null
          route_id: string
          sequence: number
          source: string
          stop_type: string
          title: string
          transport_mode: string
        }
        Insert: {
          arrival_time?: string | null
          created_at?: string
          departure_time?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          food_place_id?: string | null
          geometry?: Json | null
          id?: string
          metro_station_id?: string | null
          pandal_id?: string | null
          route_id: string
          sequence: number
          source?: string
          stop_type: string
          title: string
          transport_mode?: string
        }
        Update: {
          arrival_time?: string | null
          created_at?: string
          departure_time?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          food_place_id?: string | null
          geometry?: Json | null
          id?: string
          metro_station_id?: string | null
          pandal_id?: string | null
          route_id?: string
          sequence?: number
          source?: string
          stop_type?: string
          title?: string
          transport_mode?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_legs_food_place_id_fkey"
            columns: ["food_place_id"]
            isOneToOne: false
            referencedRelation: "food_places"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_legs_metro_station_id_fkey"
            columns: ["metro_station_id"]
            isOneToOne: false
            referencedRelation: "metro_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_legs_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_legs_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      route_recalculations: {
        Row: {
          accepted_by_user: boolean | null
          created_at: string | null
          distance_change_meters: number
          id: string
          new_route_summary: Json
          old_route_summary: Json
          time_saved_minutes: number
          trigger_reason: string
          trip_id: string
        }
        Insert: {
          accepted_by_user?: boolean | null
          created_at?: string | null
          distance_change_meters?: number
          id?: string
          new_route_summary: Json
          old_route_summary: Json
          time_saved_minutes?: number
          trigger_reason: string
          trip_id: string
        }
        Update: {
          accepted_by_user?: boolean | null
          created_at?: string | null
          distance_change_meters?: number
          id?: string
          new_route_summary?: Json
          old_route_summary?: Json
          time_saved_minutes?: number
          trigger_reason?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_recalculations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          confidence: number
          created_at: string
          end_time: string
          id: string
          interests: string[] | null
          metro_count: number
          pandal_count: number
          route_status: string
          start_latitude: number
          start_location: string
          start_longitude: number
          start_time: string
          target_pandal_count: number | null
          total_distance_meters: number
          total_duration_seconds: number
          transport_preference: string
          trip_date: string
          updated_at: string
          user_id: string | null
          walking_tolerance: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          end_time: string
          id?: string
          interests?: string[] | null
          metro_count?: number
          pandal_count?: number
          route_status?: string
          start_latitude: number
          start_location: string
          start_longitude: number
          start_time: string
          target_pandal_count?: number | null
          total_distance_meters?: number
          total_duration_seconds?: number
          transport_preference?: string
          trip_date: string
          updated_at?: string
          user_id?: string | null
          walking_tolerance?: string
        }
        Update: {
          confidence?: number
          created_at?: string
          end_time?: string
          id?: string
          interests?: string[] | null
          metro_count?: number
          pandal_count?: number
          route_status?: string
          start_latitude?: number
          start_location?: string
          start_longitude?: number
          start_time?: string
          target_pandal_count?: number | null
          total_distance_meters?: number
          total_duration_seconds?: number
          transport_preference?: string
          trip_date?: string
          updated_at?: string
          user_id?: string | null
          walking_tolerance?: string
        }
        Relationships: []
      }
      saved_looks: {
        Row: {
          created_at: string
          id: string
          look_id: string | null
          look_name: string
          occasion: string | null
          products_json: Json | null
          selfie_url: string | null
          style: string | null
          total_price: number
          user_id: string | null
          vto_result_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          look_id?: string | null
          look_name: string
          occasion?: string | null
          products_json?: Json | null
          selfie_url?: string | null
          style?: string | null
          total_price?: number
          user_id?: string | null
          vto_result_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          look_id?: string | null
          look_name?: string
          occasion?: string | null
          products_json?: Json | null
          selfie_url?: string | null
          style?: string | null
          total_price?: number
          user_id?: string | null
          vto_result_url?: string | null
        }
        Relationships: []
      }
      source_snapshots: {
        Row: {
          content_hash: string | null
          created_at: string
          id: string
          published_at: string | null
          raw_reference: Json | null
          retrieved_at: string
          source_id: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          raw_reference?: Json | null
          retrieved_at?: string
          source_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          raw_reference?: Json | null
          retrieved_at?: string
          source_id?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_snapshots_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sources: {
        Row: {
          base_url: string | null
          created_at: string
          id: string
          is_active: boolean
          is_official: boolean
          name: string
          publisher: string
          source_type: string
          trust_level: string
          updated_at: string
        }
        Insert: {
          base_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          name: string
          publisher: string
          source_type: string
          trust_level?: string
          updated_at?: string
        }
        Update: {
          base_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_official?: boolean
          name?: string
          publisher?: string
          source_type?: string
          trust_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      traffic_advisories: {
        Row: {
          area: string
          confidence: number
          created_at: string
          description: string
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          published_at: string
          retrieved_at: string
          severity: string
          source_id: string | null
          title: string
          updated_at: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          area: string
          confidence?: number
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          published_at?: string
          retrieved_at?: string
          severity?: string
          source_id?: string | null
          title: string
          updated_at?: string
          valid_from: string
          valid_until: string
        }
        Update: {
          area?: string
          confidence?: number
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          published_at?: string
          retrieved_at?: string
          severity?: string
          source_id?: string | null
          title?: string
          updated_at?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "traffic_advisories_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      traffic_alerts: {
        Row: {
          affected_roads: string[]
          area: string
          category: string
          confidence: number
          description: string
          id: string
          last_updated: string
          published_at: string
          source: string
          source_type: string
          source_url: string | null
          status: string
          title: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          affected_roads?: string[]
          area: string
          category: string
          confidence?: number
          description: string
          id?: string
          last_updated?: string
          published_at?: string
          source: string
          source_type?: string
          source_url?: string | null
          status?: string
          title: string
          valid_from: string
          valid_until: string
        }
        Update: {
          affected_roads?: string[]
          area?: string
          category?: string
          confidence?: number
          description?: string
          id?: string
          last_updated?: string
          published_at?: string
          source?: string
          source_type?: string
          source_url?: string | null
          status?: string
          title?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      trends: {
        Row: {
          content_angle: string | null
          created_at: string | null
          discovered_at: string | null
          expires_at: string | null
          id: string
          relevance_score: number | null
          source: string
          source_url: string | null
          topic: string
          trend_score: number | null
        }
        Insert: {
          content_angle?: string | null
          created_at?: string | null
          discovered_at?: string | null
          expires_at?: string | null
          id?: string
          relevance_score?: number | null
          source: string
          source_url?: string | null
          topic: string
          trend_score?: number | null
        }
        Update: {
          content_angle?: string | null
          created_at?: string | null
          discovered_at?: string | null
          expires_at?: string | null
          id?: string
          relevance_score?: number | null
          source?: string
          source_url?: string | null
          topic?: string
          trend_score?: number | null
        }
        Relationships: []
      }
      trip_plans: {
        Row: {
          ai_reasoning: string | null
          created_at: string | null
          date: string
          end_time: string
          estimated_visit_minutes: number
          group_size: number
          id: string
          interests: string[] | null
          metro_rides: number
          route_confidence: number
          start_lat: number
          start_lng: number
          start_location_name: string
          start_time: string
          status: string
          title: string
          total_pandals: number
          total_travel_time_minutes: number
          total_walking_distance_meters: number
          transport_preference: string
          updated_at: string | null
          user_id: string | null
          walking_tolerance: string
        }
        Insert: {
          ai_reasoning?: string | null
          created_at?: string | null
          date: string
          end_time: string
          estimated_visit_minutes?: number
          group_size?: number
          id?: string
          interests?: string[] | null
          metro_rides?: number
          route_confidence?: number
          start_lat: number
          start_lng: number
          start_location_name: string
          start_time: string
          status?: string
          title: string
          total_pandals?: number
          total_travel_time_minutes?: number
          total_walking_distance_meters?: number
          transport_preference?: string
          updated_at?: string | null
          user_id?: string | null
          walking_tolerance?: string
        }
        Update: {
          ai_reasoning?: string | null
          created_at?: string | null
          date?: string
          end_time?: string
          estimated_visit_minutes?: number
          group_size?: number
          id?: string
          interests?: string[] | null
          metro_rides?: number
          route_confidence?: number
          start_lat?: number
          start_lng?: number
          start_location_name?: string
          start_time?: string
          status?: string
          title?: string
          total_pandals?: number
          total_travel_time_minutes?: number
          total_walking_distance_meters?: number
          transport_preference?: string
          updated_at?: string | null
          user_id?: string | null
          walking_tolerance?: string
        }
        Relationships: []
      }
      trip_sessions: {
        Row: {
          actual_distance_meters: number | null
          completed_at: string | null
          current_lat: number | null
          current_leg: number | null
          current_lng: number | null
          current_stop_order: number
          id: string
          route_id: string | null
          started_at: string
          status: string
          total_distance_meters: number | null
          total_pandals_visited: number | null
          trip_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          actual_distance_meters?: number | null
          completed_at?: string | null
          current_lat?: number | null
          current_leg?: number | null
          current_lng?: number | null
          current_stop_order?: number
          id?: string
          route_id?: string | null
          started_at?: string
          status?: string
          total_distance_meters?: number | null
          total_pandals_visited?: number | null
          trip_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          actual_distance_meters?: number | null
          completed_at?: string | null
          current_lat?: number | null
          current_leg?: number | null
          current_lng?: number | null
          current_stop_order?: number
          id?: string
          route_id?: string | null
          started_at?: string
          status?: string
          total_distance_meters?: number | null
          total_pandals_visited?: number | null
          trip_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_sessions_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_sessions_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_stops: {
        Row: {
          arrival_time: string | null
          crowd_status: string | null
          custom_name: string | null
          departure_time: string | null
          distance_from_prev_meters: number | null
          duration_minutes: number
          id: string
          lat: number
          lng: number
          metro_station_id: string | null
          navigation_url: string | null
          pandal_id: string | null
          restaurant_id: string | null
          road_status: string | null
          stop_order: number
          stop_type: string
          trip_id: string
          visited: boolean | null
          visited_at: string | null
          walking_time_from_prev_minutes: number | null
        }
        Insert: {
          arrival_time?: string | null
          crowd_status?: string | null
          custom_name?: string | null
          departure_time?: string | null
          distance_from_prev_meters?: number | null
          duration_minutes?: number
          id?: string
          lat: number
          lng: number
          metro_station_id?: string | null
          navigation_url?: string | null
          pandal_id?: string | null
          restaurant_id?: string | null
          road_status?: string | null
          stop_order: number
          stop_type: string
          trip_id: string
          visited?: boolean | null
          visited_at?: string | null
          walking_time_from_prev_minutes?: number | null
        }
        Update: {
          arrival_time?: string | null
          crowd_status?: string | null
          custom_name?: string | null
          departure_time?: string | null
          distance_from_prev_meters?: number | null
          duration_minutes?: number
          id?: string
          lat?: number
          lng?: number
          metro_station_id?: string | null
          navigation_url?: string | null
          pandal_id?: string | null
          restaurant_id?: string | null
          road_status?: string | null
          stop_order?: number
          stop_type?: string
          trip_id?: string
          visited?: boolean | null
          visited_at?: string | null
          walking_time_from_prev_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "trip_stops_metro_station_id_fkey"
            columns: ["metro_station_id"]
            isOneToOne: false
            referencedRelation: "metro_stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_stops_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_stops_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_stops_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_visits: {
        Row: {
          created_at: string
          dwell_seconds: number | null
          id: string
          latitude: number | null
          longitude: number | null
          pandal_id: string
          photo_url: string | null
          started_at: string | null
          trip_session_id: string | null
          verification_method: string
          verified: boolean
          visited_at: string
        }
        Insert: {
          created_at?: string
          dwell_seconds?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pandal_id: string
          photo_url?: string | null
          started_at?: string | null
          trip_session_id?: string | null
          verification_method?: string
          verified?: boolean
          visited_at?: string
        }
        Update: {
          created_at?: string
          dwell_seconds?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pandal_id?: string
          photo_url?: string | null
          started_at?: string | null
          trip_session_id?: string | null
          verification_method?: string
          verified?: boolean
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_visits_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_visits_trip_session_id_fkey"
            columns: ["trip_session_id"]
            isOneToOne: false
            referencedRelation: "trip_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          interest_tags: string[] | null
          language: string | null
          notification_preferences: Json | null
          preferred_language: string | null
          theme: string | null
          transport_preference: string | null
          updated_at: string | null
          user_id: string | null
          walking_tolerance: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interest_tags?: string[] | null
          language?: string | null
          notification_preferences?: Json | null
          preferred_language?: string | null
          theme?: string | null
          transport_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
          walking_tolerance?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interest_tags?: string[] | null
          language?: string | null
          notification_preferences?: Json | null
          preferred_language?: string | null
          theme?: string | null
          transport_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
          walking_tolerance?: string | null
        }
        Relationships: []
      }
      user_saved_pandals: {
        Row: {
          id: string
          notes: string | null
          pandal_id: string
          saved_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          pandal_id: string
          saved_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          pandal_id?: string
          saved_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_pandals_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_saved_places: {
        Row: {
          created_at: string
          id: string
          pandal_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pandal_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pandal_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_places_pandal_id_fkey"
            columns: ["pandal_id"]
            isOneToOne: false
            referencedRelation: "pandals"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          new_value: Json | null
          old_value: Json | null
          performed_by: string | null
          source_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          source_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          performed_by?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_logs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "sources"
            referencedColumns: ["id"]
          },
        ]
      }
      walking_routes: {
        Row: {
          confidence: number
          dest_lat: number
          dest_lng: number
          distance_meters: number
          duration_seconds: number
          geometry_geojson: Json | null
          id: string
          last_updated: string
          origin_lat: number
          origin_lng: number
          source: string
          verified_at: string
        }
        Insert: {
          confidence?: number
          dest_lat: number
          dest_lng: number
          distance_meters: number
          duration_seconds: number
          geometry_geojson?: Json | null
          id?: string
          last_updated?: string
          origin_lat: number
          origin_lng: number
          source?: string
          verified_at?: string
        }
        Update: {
          confidence?: number
          dest_lat?: number
          dest_lng?: number
          distance_meters?: number
          duration_seconds?: number
          geometry_geojson?: Json | null
          id?: string
          last_updated?: string
          origin_lat?: number
          origin_lng?: number
          source?: string
          verified_at?: string
        }
        Relationships: []
      }
      weather_snapshots: {
        Row: {
          apparent_temp_c: number | null
          city: string
          expires_at: string | null
          feels_like: number | null
          fetched_at: string
          forecast_for: string | null
          humidity_percent: number | null
          id: string
          lat: number
          latitude: number | null
          lng: number
          longitude: number | null
          precipitation: number | null
          precipitation_mm: number | null
          rain_probability: number | null
          retrieved_at: string | null
          source: string
          source_url: string | null
          temperature: number | null
          temperature_c: number | null
          weather_code: number
          wind_speed: number | null
          wind_speed_kmh: number | null
        }
        Insert: {
          apparent_temp_c?: number | null
          city?: string
          expires_at?: string | null
          feels_like?: number | null
          fetched_at?: string
          forecast_for?: string | null
          humidity_percent?: number | null
          id?: string
          lat?: number
          latitude?: number | null
          lng?: number
          longitude?: number | null
          precipitation?: number | null
          precipitation_mm?: number | null
          rain_probability?: number | null
          retrieved_at?: string | null
          source?: string
          source_url?: string | null
          temperature?: number | null
          temperature_c?: number | null
          weather_code: number
          wind_speed?: number | null
          wind_speed_kmh?: number | null
        }
        Update: {
          apparent_temp_c?: number | null
          city?: string
          expires_at?: string | null
          feels_like?: number | null
          fetched_at?: string
          forecast_for?: string | null
          humidity_percent?: number | null
          id?: string
          lat?: number
          latitude?: number | null
          lng?: number
          longitude?: number | null
          precipitation?: number | null
          precipitation_mm?: number | null
          rain_probability?: number | null
          retrieved_at?: string | null
          source?: string
          source_url?: string | null
          temperature?: number | null
          temperature_c?: number | null
          weather_code?: number
          wind_speed?: number | null
          wind_speed_kmh?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      broadcast_emergency_notification: {
        Args: { p_body: string; p_data?: Json; p_title: string; p_type: string }
        Returns: Json
      }
      get_active_traffic: {
        Args: never
        Returns: {
          area: string
          confidence: number
          description: string
          id: string
          severity: string
          title: string
          valid_from: string
          valid_until: string
        }[]
      }
      get_current_weather: { Args: never; Returns: Json }
      get_latest_source: { Args: { p_entity_id: string }; Returns: Json }
      get_nearby_pandal_photos: {
        Args: {
          p_latitude: number
          p_limit?: number
          p_longitude: number
          p_radius_meters?: number
        }
        Returns: {
          caption: string
          created_at: string
          distance_meters: number
          id: string
          latitude: number
          longitude: number
          pandal_id: string
          photo_url: string
          taken_at: string
        }[]
      }
      get_nearby_pandals: {
        Args: { p_lat: number; p_lng: number; p_radius_meters?: number }
        Returns: {
          area: string
          distance_meters: number
          id: string
          latitude: number
          longitude: number
          name: string
          puja_score: number
          slug: string
          status: string
          theme: string
        }[]
      }
      get_pandal_status: { Args: { p_pandal_id: string }; Returns: Json }
      get_pandal_verification: { Args: { p_pandal_id: string }; Returns: Json }
      get_route_summary: { Args: { p_route_id: string }; Returns: Json }
      get_user_passport: { Args: { p_user_id: string }; Returns: Json }
      is_admin: { Args: never; Returns: boolean }
      register_device_token: {
        Args: { p_platform: string; p_push_token: string; p_user_id?: string }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
