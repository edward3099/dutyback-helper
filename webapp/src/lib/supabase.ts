import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rrlfoisdeoalfbmtzdoj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybGZvaXNkZW9hbGZibXR6ZG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NjU3NTQsImV4cCI6MjA3MzM0MTc1NH0.SVgHLgVPSgSyNQm04WgpU-7vr7WAkoo9Z2bf_Rqx_zU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types matching our Supabase schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          address: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          address?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          address?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      claims: {
        Row: {
          id: string
          user_id: string
          claim_type: 'duty' | 'vat' | 'both'
          channel: 'courier' | 'postal'
          vat_status: 'registered' | 'not_registered'
          status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
          mrn: string | null
          eori: string | null
          courier_name: string | null
          tracking_number: string | null
          import_date: string | null
          duty_amount: number | null
          vat_amount: number | null
          total_amount: number | null
          refund_amount: number | null
          reason: string | null
          additional_notes: string | null
          submitted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          claim_type: 'duty' | 'vat' | 'both'
          channel: 'courier' | 'postal'
          vat_status: 'registered' | 'not_registered'
          status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
          mrn?: string | null
          eori?: string | null
          courier_name?: string | null
          tracking_number?: string | null
          import_date?: string | null
          duty_amount?: number | null
          vat_amount?: number | null
          total_amount?: number | null
          refund_amount?: number | null
          reason?: string | null
          additional_notes?: string | null
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          claim_type?: 'duty' | 'vat' | 'both'
          channel?: 'courier' | 'postal'
          vat_status?: 'registered' | 'not_registered'
          status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
          mrn?: string | null
          eori?: string | null
          courier_name?: string | null
          tracking_number?: string | null
          import_date?: string | null
          duty_amount?: number | null
          vat_amount?: number | null
          total_amount?: number | null
          refund_amount?: number | null
          reason?: string | null
          additional_notes?: string | null
          submitted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      evidence: {
        Row: {
          id: string
          claim_id: string
          evidence_type: 'invoice' | 'receipt' | 'shipping_document' | 'customs_declaration' | 'other'
          file_name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          is_required: boolean
          is_uploaded: boolean
          uploaded_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          claim_id: string
          evidence_type: 'invoice' | 'receipt' | 'shipping_document' | 'customs_declaration' | 'other'
          file_name: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          is_required?: boolean
          is_uploaded?: boolean
          uploaded_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          claim_id?: string
          evidence_type?: 'invoice' | 'receipt' | 'shipping_document' | 'customs_declaration' | 'other'
          file_name?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          is_required?: boolean
          is_uploaded?: boolean
          uploaded_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      identifiers: {
        Row: {
          id: string
          claim_id: string
          mrn: string | null
          eori: string | null
          courier_name: string | null
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          claim_id: string
          mrn?: string | null
          eori?: string | null
          courier_name?: string | null
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          claim_id?: string
          mrn?: string | null
          eori?: string | null
          courier_name?: string | null
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      outcomes: {
        Row: {
          id: string
          claim_id: string
          decision: 'approved' | 'rejected' | 'pending' | 'under_review'
          decision_date: string | null
          refund_amount: number | null
          refund_currency: string | null
          decision_reason: string | null
          hmrc_reference: string | null
          processing_time_days: number | null
          additional_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          claim_id: string
          decision: 'approved' | 'rejected' | 'pending' | 'under_review'
          decision_date?: string | null
          refund_amount?: number | null
          refund_currency?: string | null
          decision_reason?: string | null
          hmrc_reference?: string | null
          processing_time_days?: number | null
          additional_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          claim_id?: string
          decision?: 'approved' | 'rejected' | 'pending' | 'under_review'
          decision_date?: string | null
          refund_amount?: number | null
          refund_currency?: string | null
          decision_reason?: string | null
          hmrc_reference?: string | null
          processing_time_days?: number | null
          additional_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
