export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export const emailTemplates = {
  welcome: (name: string): EmailTemplate => ({
    subject: 'Welcome to Dutyback Helper',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to Dutyback Helper!</h1>
        <p>Hi ${name},</p>
        <p>Thank you for joining Dutyback Helper. We're here to help you reclaim your import duties and VAT.</p>
        <p>Get started by creating your first claim in our easy-to-use wizard.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/wizard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Start Your Claim</a>
      </div>
    `,
    text: `Welcome to Dutyback Helper!\n\nHi ${name},\n\nThank you for joining Dutyback Helper. We're here to help you reclaim your import duties and VAT.\n\nGet started by creating your first claim in our easy-to-use wizard.\n\nVisit: ${process.env.NEXT_PUBLIC_APP_URL}/wizard`
  }),

  claimSubmitted: (claimId: string, amount: number): EmailTemplate => ({
    subject: 'Claim Submitted Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">Claim Submitted Successfully</h1>
        <p>Your claim has been submitted to HMRC for review.</p>
        <p><strong>Claim ID:</strong> ${claimId}</p>
        <p><strong>Amount:</strong> £${amount.toFixed(2)}</p>
        <p>We'll notify you when there's an update on your claim status.</p>
      </div>
    `,
    text: `Claim Submitted Successfully\n\nYour claim has been submitted to HMRC for review.\n\nClaim ID: ${claimId}\nAmount: £${amount.toFixed(2)}\n\nWe'll notify you when there's an update on your claim status.`
  }),

  claimApproved: (claimId: string, amount: number): EmailTemplate => ({
    subject: 'Claim Approved!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #059669;">🎉 Claim Approved!</h1>
        <p>Great news! Your claim has been approved by HMRC.</p>
        <p><strong>Claim ID:</strong> ${claimId}</p>
        <p><strong>Refund Amount:</strong> £${amount.toFixed(2)}</p>
        <p>You should receive your refund within 5-10 business days.</p>
      </div>
    `,
    text: `🎉 Claim Approved!\n\nGreat news! Your claim has been approved by HMRC.\n\nClaim ID: ${claimId}\nRefund Amount: £${amount.toFixed(2)}\n\nYou should receive your refund within 5-10 business days.`
  }),

  claimRejected: (claimId: string, reason: string): EmailTemplate => ({
    subject: 'Claim Update Required',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Claim Update Required</h1>
        <p>Unfortunately, your claim requires additional information.</p>
        <p><strong>Claim ID:</strong> ${claimId}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please review and resubmit your claim with the required information.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Claim</a>
      </div>
    `,
    text: `Claim Update Required\n\nUnfortunately, your claim requires additional information.\n\nClaim ID: ${claimId}\nReason: ${reason}\n\nPlease review and resubmit your claim with the required information.\n\nVisit: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
  })
}
