import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { logger } from '@/lib/logging/logger'
import { performanceMonitor } from '@/lib/monitoring/performanceMonitor'

type Claim = Database['public']['Tables']['claims']['Row']
type ClaimInsert = Database['public']['Tables']['claims']['Insert']
type ClaimUpdate = Database['public']['Tables']['claims']['Update']

export interface ClaimFilters {
  status?: string
  channel?: string
  dateFrom?: string
  dateTo?: string
}

export interface ClaimStats {
  total: number
  pending: number
  approved: number
  rejected: number
  totalAmount: number
}

export class ClaimsAPI {
  static async createClaim(claimData: ClaimInsert): Promise<Claim> {
    const startTime = performance.now()
    
    try {
      logger.info('Creating new claim', { claimData })
      
      const { data, error } = await supabase
        .from('claims')
        .insert(claimData)
        .select()
        .single()

      if (error) {
        logger.error('Failed to create claim', { error: error.message })
        throw new Error(`Failed to create claim: ${error.message}`)
      }

      const endTime = performance.now()
      performanceMonitor.measureApiCall('createClaim', startTime, endTime, true)
      
      logger.info('Claim created successfully', { claimId: data.id })
      return data
    } catch (error) {
      const endTime = performance.now()
      performanceMonitor.measureApiCall('createClaim', startTime, endTime, false)
      
      logger.error('Claim creation failed', { error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  static async getClaims(filters?: ClaimFilters): Promise<Claim[]> {
    const startTime = performance.now()
    
    try {
      logger.info('Fetching claims', { filters })
      
      let query = supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.channel) {
        query = query.eq('channel', filters.channel)
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom)
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo)
      }

      const { data, error } = await query

      if (error) {
        logger.error('Failed to fetch claims', { error: error.message })
        throw new Error(`Failed to fetch claims: ${error.message}`)
      }

      const endTime = performance.now()
      performanceMonitor.measureApiCall('getClaims', startTime, endTime, true)
      
      logger.info('Claims fetched successfully', { count: data?.length || 0 })
      return data || []
    } catch (error) {
      const endTime = performance.now()
      performanceMonitor.measureApiCall('getClaims', startTime, endTime, false)
      
      logger.error('Failed to fetch claims', { error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  static async getClaimById(id: string): Promise<Claim | null> {
    const startTime = performance.now()
    
    try {
      logger.info('Fetching claim by ID', { claimId: id })
      
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          logger.warn('Claim not found', { claimId: id })
          return null
        }
        logger.error('Failed to fetch claim', { error: error.message })
        throw new Error(`Failed to fetch claim: ${error.message}`)
      }

      const endTime = performance.now()
      performanceMonitor.measureApiCall('getClaimById', startTime, endTime, true)
      
      logger.info('Claim fetched successfully', { claimId: id })
      return data
    } catch (error) {
      const endTime = performance.now()
      performanceMonitor.measureApiCall('getClaimById', startTime, endTime, false)
      
      logger.error('Failed to fetch claim', { error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  static async updateClaim(id: string, updates: ClaimUpdate): Promise<Claim> {
    const startTime = performance.now()
    
    try {
      logger.info('Updating claim', { claimId: id, updates })
      
      const { data, error } = await supabase
        .from('claims')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        logger.error('Failed to update claim', { error: error.message })
        throw new Error(`Failed to update claim: ${error.message}`)
      }

      const endTime = performance.now()
      performanceMonitor.measureApiCall('updateClaim', startTime, endTime, true)
      
      logger.info('Claim updated successfully', { claimId: id })
      return data
    } catch (error) {
      const endTime = performance.now()
      performanceMonitor.measureApiCall('updateClaim', startTime, endTime, false)
      
      logger.error('Claim update failed', { error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  static async deleteClaim(id: string): Promise<void> {
    const startTime = performance.now()
    
    try {
      logger.info('Deleting claim', { claimId: id })
      
      const { error } = await supabase
        .from('claims')
        .delete()
        .eq('id', id)

      if (error) {
        logger.error('Failed to delete claim', { error: error.message })
        throw new Error(`Failed to delete claim: ${error.message}`)
      }

      const endTime = performance.now()
      performanceMonitor.measureApiCall('deleteClaim', startTime, endTime, true)
      
      logger.info('Claim deleted successfully', { claimId: id })
    } catch (error) {
      const endTime = performance.now()
      performanceMonitor.measureApiCall('deleteClaim', startTime, endTime, false)
      
      logger.error('Claim deletion failed', { error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  static async getClaimStats(): Promise<ClaimStats> {
    const startTime = performance.now()
    
    try {
      logger.info('Fetching claim statistics')
      
      const { data, error } = await supabase
        .from('claims')
        .select('status, claim_amount')

      if (error) {
        logger.error('Failed to fetch claim stats', { error: error.message })
        throw new Error(`Failed to fetch claim stats: ${error.message}`)
      }

      const stats: ClaimStats = {
        total: data?.length || 0,
        pending: data?.filter(c => c.status === 'draft').length || 0,
        approved: data?.filter(c => c.status === 'approved').length || 0,
        rejected: data?.filter(c => c.status === 'rejected').length || 0,
        totalAmount: data?.reduce((sum, c) => sum + (c.claim_amount || 0), 0) || 0
      }

      const endTime = performance.now()
      performanceMonitor.measureApiCall('getClaimStats', startTime, endTime, true)
      
      logger.info('Claim stats fetched successfully', { stats })
      return stats
    } catch (error) {
      const endTime = performance.now()
      performanceMonitor.measureApiCall('getClaimStats', startTime, endTime, false)
      
      logger.error('Failed to fetch claim stats', { error: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }
}
