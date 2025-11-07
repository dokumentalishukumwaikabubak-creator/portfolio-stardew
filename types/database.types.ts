export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      portfolio_items: {
        Row: {
          id: number
          title: string
          description: string | null
          full_description: string | null
          image_url: string | null
          demo_url: string | null
          github_url: string | null
          category_id: number | null
          is_featured: boolean
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          full_description?: string | null
          image_url?: string | null
          demo_url?: string | null
          github_url?: string | null
          category_id?: number | null
          is_featured?: boolean
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          full_description?: string | null
          image_url?: string | null
          demo_url?: string | null
          github_url?: string | null
          category_id?: number | null
          is_featured?: boolean
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      personal_info: {
        Row: {
          id: number
          name: string | null
          title: string | null
          bio: string | null
          email: string | null
          github_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          profile_image_url: string | null
          hero_title: string | null
          hero_subtitle: string | null
          hero_tagline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name?: string | null
          title?: string | null
          bio?: string | null
          email?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          profile_image_url?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_tagline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string | null
          title?: string | null
          bio?: string | null
          email?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          profile_image_url?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          hero_tagline?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: number
          name: string
          level: number
          category: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          level?: number
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          level?: number
          category?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row']
export type PersonalInfo = Database['public']['Tables']['personal_info']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']

export interface PortfolioItemWithCategory extends PortfolioItem {
  category?: Category | null
}
