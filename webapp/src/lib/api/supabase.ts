import { supabase } from '../supabase'

// Edge Function URLs
const SUPABASE_URL = 'https://rrlfoisdeoalfbmtzdoj.supabase.co'
const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`

// Auth API functions
export const authAPI = {
  async register(data: {
    email: string
    password: string
    full_name?: string
    company_name?: string
    phone?: string
    address?: any
  }) {
    const response = await fetch(`${FUNCTIONS_URL}/register-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async login(data: { email: string; password: string }) {
    const response = await fetch(`${FUNCTIONS_URL}/login-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async logout() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { success: true }

    const response = await fetch(`${FUNCTIONS_URL}/logout-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
    })
    return response.json()
  },

  async resetPassword(email: string) {
    const response = await fetch(`${FUNCTIONS_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
    return response.json()
  },

  async updatePassword(data: {
    access_token: string
    refresh_token: string
    new_password: string
  }) {
    const response = await fetch(`${FUNCTIONS_URL}/reset-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }
}

// Claims API functions
export const claimsAPI = {
  async createClaim(data: {
    claim_type: 'duty' | 'vat' | 'both'
    channel: 'courier' | 'postal'
    vat_status: 'registered' | 'not_registered'
    mrn?: string
    eori?: string
    courier_name?: string
    tracking_number?: string
    import_date?: string
    duty_amount?: number
    vat_amount?: number
    total_amount?: number
    reason?: string
    additional_notes?: string
  }) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`${FUNCTIONS_URL}/create-claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async getClaims(params?: {
    status?: string
    limit?: number
    offset?: number
  }) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())

    const response = await fetch(`${FUNCTIONS_URL}/get-claims?${searchParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    })
    return response.json()
  },

  async updateClaim(claimId: string, data: {
    claim_type?: 'duty' | 'vat' | 'both'
    channel?: 'courier' | 'postal'
    vat_status?: 'registered' | 'not_registered'
    mrn?: string
    eori?: string
    courier_name?: string
    tracking_number?: string
    import_date?: string
    duty_amount?: number
    vat_amount?: number
    total_amount?: number
    reason?: string
    additional_notes?: string
    status?: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  }) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`${FUNCTIONS_URL}/update-claim/${claimId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async getStatistics() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`${FUNCTIONS_URL}/claim-statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    })
    return response.json()
  }
}

// Evidence API functions
export const evidenceAPI = {
  async uploadEvidence(data: {
    claim_id: string
    evidence_type: 'invoice' | 'receipt' | 'shipping_document' | 'customs_declaration' | 'other'
    file_name: string
    file_size: number
    mime_type: string
    file_data: string // Base64 encoded
  }) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`${FUNCTIONS_URL}/upload-evidence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }
}

// User Profile API functions
export const profileAPI = {
  async getProfile() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`${FUNCTIONS_URL}/user-profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    })
    return response.json()
  },

  async updateProfile(data: {
    full_name?: string
    company_name?: string
    phone?: string
    address?: {
      street?: string
      city?: string
      postal_code?: string
      country?: string
    }
  }) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`${FUNCTIONS_URL}/user-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(data),
    })
    return response.json()
  }
}
