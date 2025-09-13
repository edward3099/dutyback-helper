import { supabase } from '@/lib/supabase'
import { emailTemplates, EmailTemplate } from './templates'

export interface EmailService {
  sendEmail: (to: string, template: EmailTemplate) => Promise<boolean>
  sendWelcomeEmail: (email: string, name: string) => Promise<boolean>
  sendClaimSubmittedEmail: (email: string, claimId: string, amount: number) => Promise<boolean>
  sendClaimApprovedEmail: (email: string, claimId: string, amount: number) => Promise<boolean>
  sendClaimRejectedEmail: (email: string, claimId: string, reason: string) => Promise<boolean>
}

class SupabaseEmailService implements EmailService {
  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to,
          subject: template.subject,
          html: template.html,
          text: template.text
        }
      })

      if (error) {
        console.error('Email sending failed:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Email service error:', error)
      return false
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const template = emailTemplates.welcome(name)
    return this.sendEmail(email, template)
  }

  async sendClaimSubmittedEmail(email: string, claimId: string, amount: number): Promise<boolean> {
    const template = emailTemplates.claimSubmitted(claimId, amount)
    return this.sendEmail(email, template)
  }

  async sendClaimApprovedEmail(email: string, claimId: string, amount: number): Promise<boolean> {
    const template = emailTemplates.claimApproved(claimId, amount)
    return this.sendEmail(email, template)
  }

  async sendClaimRejectedEmail(email: string, claimId: string, reason: string): Promise<boolean> {
    const template = emailTemplates.claimRejected(claimId, reason)
    return this.sendEmail(email, template)
  }
}

export const emailService = new SupabaseEmailService()
