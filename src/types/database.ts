export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          email_verified: boolean
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
          user_type: 'developer' | 'company'
        }
        Insert: {
          id: string
          email: string
          email_verified?: boolean
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          user_type?: 'developer' | 'company'
        }
        Update: {
          id?: string
          email?: string
          email_verified?: boolean
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          user_type?: 'developer' | 'company'
        }
        Relationships: []
      }
      developer_profiles: {
        Row: {
          id: string
          user_id: string
          username: string
          first_name: string | null
          last_name: string | null
          display_name: string | null
          bio: string | null
          location: string | null
          country: string | null
          website: string | null
          portfolio_url: string | null
          github_url: string | null
          linkedin_url: string | null
          avatar_url: string | null
          banner_url: string | null
          availability: 'available' | 'open' | 'busy' | 'unavailable'
          experience_level: 'junior' | 'mid' | 'senior' | 'lead' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username: string
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          bio?: string | null
          location?: string | null
          country?: string | null
          website?: string | null
          portfolio_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          availability?: 'available' | 'open' | 'busy' | 'unavailable'
          experience_level?: 'junior' | 'mid' | 'senior' | 'lead' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string
          first_name?: string | null
          last_name?: string | null
          display_name?: string | null
          bio?: string | null
          location?: string | null
          country?: string | null
          website?: string | null
          portfolio_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          availability?: 'available' | 'open' | 'busy' | 'unavailable'
          experience_level?: 'junior' | 'mid' | 'senior' | 'lead' | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      company_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          description: string | null
          website: string | null
          logo_url: string | null
          banner_url: string | null
          size: string | null
          industry: string | null
          location: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          description?: string | null
          website?: string | null
          logo_url?: string | null
          banner_url?: string | null
          size?: string | null
          industry?: string | null
          location?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          description?: string | null
          website?: string | null
          logo_url?: string | null
          banner_url?: string | null
          size?: string | null
          industry?: string | null
          location?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          technologies: string[]
          project_url: string | null
          github_url: string | null
          image_url: string | null
          start_date: string | null
          end_date: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          technologies?: string[]
          project_url?: string | null
          github_url?: string | null
          image_url?: string | null
          start_date?: string | null
          end_date?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          technologies?: string[]
          project_url?: string | null
          github_url?: string | null
          image_url?: string | null
          start_date?: string | null
          end_date?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          created_at?: string
        }
        Relationships: []
      }
      developer_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          proficiency: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          proficiency?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          proficiency?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "developer_skills_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "developer_skills_skill_id_fkey"
            columns: ["skill_id"]
            referencedRelation: "skills"
            referencedColumns: ["id"]
          }
        ]
      }
      education: {
        Row: {
          id: string
          user_id: string
          institution: string
          degree: string
          field: string | null
          start_date: string | null
          end_date: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          institution: string
          degree: string
          field?: string | null
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          institution?: string
          degree?: string
          field?: string | null
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      certifications: {
        Row: {
          id: string
          user_id: string
          name: string
          issuer: string
          credential_url: string | null
          issue_date: string | null
          expiry_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          issuer: string
          credential_url?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          issuer?: string
          credential_url?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      work_experience: {
        Row: {
          id: string
          user_id: string
          company: string
          position: string
          description: string | null
          start_date: string | null
          end_date: string | null
          current: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          position: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          current?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          position?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          current?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_experience_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      github_integrations: {
        Row: {
          id: string
          user_id: string
          github_id: number
          username: string
          avatar_url: string | null
          access_token: string
          public_repos: number
          total_stars: number
          followers: number
          following: number
          languages: Json
          top_repos: Json
          last_synced: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          github_id: number
          username: string
          avatar_url?: string | null
          access_token: string
          public_repos?: number
          total_stars?: number
          followers?: number
          following?: number
          languages?: Json
          top_repos?: Json
          last_synced?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          github_id?: number
          username?: string
          avatar_url?: string | null
          access_token?: string
          public_repos?: number
          total_stars?: number
          followers?: number
          following?: number
          languages?: Json
          top_repos?: Json
          last_synced?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "github_integrations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_developers: {
        Row: {
          id: string
          company_id: string
          developer_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id: string
          developer_id: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          developer_id?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_developers_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_developers_developer_id_fkey"
            columns: ["developer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      search_developers: {
        Args: {
          search_query?: string
          technology?: string
          country?: string
          availability?: string
          limit_num?: number
          offset_num?: number
        }
        Returns: {
          id: string
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          country: string | null
          availability: string
          experience_level: string | null
          skills: Json
          project_count: number
          total_stars: number
        }[]
      }
    }
  }
}
