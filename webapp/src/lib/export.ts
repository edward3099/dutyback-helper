import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ClaimData } from '@/types';

export interface ExportOptions {
  includeEvidence: boolean;
  includeTemplates: boolean;
  includeInstructions: boolean;
  format: 'pdf' | 'zip';
}

export interface ClaimPack {
  claimData: ClaimData;
  evidenceFiles: File[];
  templates: {
    hmrcForm: string;
    coverLetter: string;
    instructions: string;
  };
}

export class ClaimPackExporter {
  private claimData: ClaimData;
  private evidenceFiles: File[];

  constructor(claimData: ClaimData, evidenceFiles: File[] = []) {
    this.claimData = claimData;
    this.evidenceFiles = evidenceFiles;
  }

  /**
   * Generate HMRC form content based on claim data
   */
  private generateHMRCForm(): string {
    const { claimData } = this;
    
    let formContent = '';
    
    // Determine which HMRC form to use based on routing
    if (claimData.channel === 'postal') {
      formContent = this.generateBOR286Form();
    } else if (claimData.isVATRegistered) {
      formContent = this.generateVATReturnForm();
    } else {
      formContent = this.generateC285Form();
    }
    
    return formContent;
  }

  private generateBOR286Form(): string {
    return `
HMRC FORM BOR286 - CLAIM FOR REFUND OF CUSTOMS DUTY AND IMPORT VAT ON POSTAL IMPORTS

CLAIMANT DETAILS:
Name: ${this.claimData.userName || 'Not provided'}
Address: ${this.claimData.userAddress || 'Not provided'}
Email: ${this.claimData.userEmail || 'Not provided'}
Phone: ${this.claimData.userPhone || 'Not provided'}

IMPORT DETAILS:
Postal Service Charge Reference: ${this.claimData.bor286ChargeReference || 'Not provided'}
Import Date: ${this.claimData.importDate || 'Not provided'}
Package Value: £${this.claimData.packageValue || 'Not provided'}
Description: ${this.claimData.packageDescription || 'Not provided'}

DUTY AND VAT DETAILS:
Duty Amount: £${this.claimData.dutyAmount || 'Not provided'}
VAT Amount: £${this.claimData.vatAmount || 'Not provided'}
Total Amount: £${this.claimData.totalAmount || 'Not provided'}

REASON FOR CLAIM:
${this.claimData.reason || 'Not provided'}

ADDITIONAL NOTES:
${this.claimData.additionalNotes || 'None'}

EVIDENCE ATTACHED:
${this.claimData.evidenceFiles?.map(f => `- ${f.fileName} (${f.fileSize} bytes)`).join('\n') || 'None'}

SIGNATURE: _________________________ DATE: _______________
    `;
  }

  private generateVATReturnForm(): string {
    return `
VAT RETURN ADJUSTMENT - IMPORT VAT REFUND CLAIM

BUSINESS DETAILS:
Business Name: ${this.claimData.companyName || 'Not provided'}
VAT Registration Number: ${this.claimData.vatNumber || 'Not provided'}
EORI Number: ${this.claimData.eori || 'Not provided'}

IMPORT DETAILS:
MRN: ${this.claimData.mrn || 'Not provided'}
Import Date: ${this.claimData.importDate || 'Not provided'}
Package Value: £${this.claimData.packageValue || 'Not provided'}
Description: ${this.claimData.packageDescription || 'Not provided'}

VAT DETAILS:
Import VAT Paid: £${this.claimData.vatAmount || 'Not provided'}
VAT to be Reclaimed: £${this.claimData.vatAmount || 'Not provided'}
Period: ${this.claimData.vatReturnAcknowledged ? 'Current VAT return period' : 'Not specified'}

REASON FOR ADJUSTMENT:
${this.claimData.reason || 'Not provided'}

ADDITIONAL NOTES:
${this.claimData.additionalNotes || 'None'}

EVIDENCE ATTACHED:
${this.claimData.evidenceFiles?.map(f => `- ${f.fileName} (${f.fileSize} bytes)`).join('\n') || 'None'}

SIGNATURE: _________________________ DATE: _______________
    `;
  }

  private generateC285Form(): string {
    return `
HMRC FORM C285 - CLAIM FOR REFUND OF CUSTOMS DUTY

CLAIMANT DETAILS:
Name: ${this.claimData.userName || 'Not provided'}
Address: ${this.claimData.userAddress || 'Not provided'}
Email: ${this.claimData.userEmail || 'Not provided'}
Phone: ${this.claimData.userPhone || 'Not provided'}

IMPORT DETAILS:
MRN: ${this.claimData.mrn || 'Not provided'}
EORI: ${this.claimData.eori || 'Not provided'}
Courier: ${this.claimData.courier || 'Not provided'}
Tracking Number: ${this.claimData.trackingNumber || 'Not provided'}
Import Date: ${this.claimData.importDate || 'Not provided'}
Package Value: £${this.claimData.packageValue || 'Not provided'}
Description: ${this.claimData.packageDescription || 'Not provided'}

DUTY DETAILS:
Duty Amount: £${this.claimData.dutyAmount || 'Not provided'}
Duty to be Refunded: £${this.claimData.dutyAmount || 'Not provided'}

REASON FOR CLAIM:
${this.claimData.reason || 'Not provided'}

ADDITIONAL NOTES:
${this.claimData.additionalNotes || 'None'}

EVIDENCE ATTACHED:
${this.claimData.evidenceFiles?.map(f => `- ${f.fileName} (${f.fileSize} bytes)`).join('\n') || 'None'}

SIGNATURE: _________________________ DATE: _______________
    `;
  }

  /**
   * Generate cover letter for the claim
   */
  private generateCoverLetter(): string {
    const { claimData } = this;
    
    return `
Dear HMRC,

I am writing to submit a claim for a refund of overpaid import duty and/or VAT on goods imported to the UK.

CLAIM DETAILS:
- Import Date: ${claimData.importDate || 'Not provided'}
- Package Value: £${claimData.packageValue || 'Not provided'}
- Duty Amount: £${claimData.dutyAmount || 'Not provided'}
- VAT Amount: £${claimData.vatAmount || 'Not provided'}
- Total Amount: £${claimData.totalAmount || 'Not provided'}

REASON FOR CLAIM:
${claimData.reason || 'Not provided'}

I believe that the duty and/or VAT charged on this import was incorrect and I am entitled to a refund. I have attached all relevant documentation to support this claim.

Please process this claim and let me know if you require any additional information.

Yours sincerely,
${claimData.userName || 'Claimant'}

Contact Details:
Email: ${claimData.userEmail || 'Not provided'}
Phone: ${claimData.userPhone || 'Not provided'}
Address: ${claimData.userAddress || 'Not provided'}
    `;
  }

  /**
   * Generate step-by-step instructions
   */
  private generateInstructions(): string {
    const { claimData } = this;
    
    let instructions = `
CLAIM PACK INSTRUCTIONS
=======================

This pack contains everything you need to submit your HMRC duty refund claim.

WHAT'S INCLUDED:
1. Completed HMRC form (${claimData.channel === 'postal' ? 'BOR286' : claimData.isVATRegistered ? 'VAT Return Adjustment' : 'C285'})
2. Cover letter
3. Evidence files
4. Step-by-step instructions

NEXT STEPS:
`;

    if (claimData.channel === 'postal') {
      instructions += `
1. Review the completed BOR286 form
2. Print and sign the form
3. Attach all evidence documents
4. Send to: HMRC, Customs Declaration Service, Salford, M50 3XX
5. Keep copies of everything for your records
`;
    } else if (claimData.isVATRegistered) {
      instructions += `
1. Review the VAT return adjustment details
2. Include this information in your next VAT return
3. Keep all evidence documents for HMRC inspection
4. Submit your VAT return as usual
`;
    } else {
      instructions += `
1. Review the completed C285 form
2. Print and sign the form
3. Attach all evidence documents
4. Send to: HMRC, Customs Declaration Service, Salford, M50 3XX
5. Keep copies of everything for your records
`;
    }

    instructions += `

IMPORTANT NOTES:
- Submit your claim within 12 months of the import date
- Keep copies of all correspondence
- Follow up if you don't receive a response within 30 days
- Contact HMRC if you have any questions: 0300 200 3700

EVIDENCE CHECKLIST:
${claimData.evidenceFiles?.map(f => `✓ ${f.fileName}`).join('\n') || 'No evidence files attached'}

GOOD LUCK WITH YOUR CLAIM!
`;

    return instructions;
  }

  /**
   * Export claim pack as PDF
   */
  async exportAsPDF(options: ExportOptions = { includeEvidence: true, includeTemplates: true, includeInstructions: true, format: 'pdf' }): Promise<void> {
    const pdf = new jsPDF();
    let yPosition = 20;

    // Add title
    pdf.setFontSize(20);
    pdf.text('Duty Refund Claim Pack', 20, yPosition);
    yPosition += 30;

    // Add HMRC form
    if (options.includeTemplates) {
      pdf.setFontSize(16);
      pdf.text('HMRC Form', 20, yPosition);
      yPosition += 20;

      const formContent = this.generateHMRCForm();
      const formLines = pdf.splitTextToSize(formContent, 170);
      pdf.setFontSize(10);
      pdf.text(formLines, 20, yPosition);
      yPosition += formLines.length * 5 + 20;

      // Add new page if needed
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
    }

    // Add cover letter
    if (options.includeTemplates) {
      pdf.setFontSize(16);
      pdf.text('Cover Letter', 20, yPosition);
      yPosition += 20;

      const coverLetter = this.generateCoverLetter();
      const letterLines = pdf.splitTextToSize(coverLetter, 170);
      pdf.setFontSize(10);
      pdf.text(letterLines, 20, yPosition);
      yPosition += letterLines.length * 5 + 20;

      // Add new page if needed
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
    }

    // Add instructions
    if (options.includeInstructions) {
      pdf.setFontSize(16);
      pdf.text('Instructions', 20, yPosition);
      yPosition += 20;

      const instructions = this.generateInstructions();
      const instructionLines = pdf.splitTextToSize(instructions, 170);
      pdf.setFontSize(10);
      pdf.text(instructionLines, 20, yPosition);
    }

    // Save the PDF
    const fileName = `claim-pack-${this.claimData.trackingNumber || 'unknown'}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  }

  /**
   * Export claim pack as ZIP file
   */
  async exportAsZIP(options: ExportOptions = { includeEvidence: true, includeTemplates: true, includeInstructions: true, format: 'zip' }): Promise<void> {
    const zip = new JSZip();
    const folder = zip.folder('claim-pack');

    // Add HMRC form
    if (options.includeTemplates) {
      const formContent = this.generateHMRCForm();
      const formFileName = this.claimData.channel === 'postal' ? 'BOR286-form.txt' : 
                          this.claimData.isVATRegistered ? 'VAT-return-adjustment.txt' : 'C285-form.txt';
      folder?.file(formFileName, formContent);
    }

    // Add cover letter
    if (options.includeTemplates) {
      const coverLetter = this.generateCoverLetter();
      folder?.file('cover-letter.txt', coverLetter);
    }

    // Add instructions
    if (options.includeInstructions) {
      const instructions = this.generateInstructions();
      folder?.file('instructions.txt', instructions);
    }

    // Add evidence files
    if (options.includeEvidence && this.evidenceFiles.length > 0) {
      const evidenceFolder = folder?.folder('evidence');
      for (const file of this.evidenceFiles) {
        const arrayBuffer = await file.arrayBuffer();
        evidenceFolder?.file(file.name, arrayBuffer);
      }
    }

    // Generate and download ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    const fileName = `claim-pack-${this.claimData.trackingNumber || 'unknown'}-${new Date().toISOString().split('T')[0]}.zip`;
    saveAs(content, fileName);
  }

  /**
   * Export claim pack based on options
   */
  async export(options: ExportOptions): Promise<void> {
    if (options.format === 'pdf') {
      await this.exportAsPDF(options);
    } else {
      await this.exportAsZIP(options);
    }
  }
}

/**
 * Utility function to create and export a claim pack
 */
export async function exportClaimPack(
  claimData: ClaimData, 
  evidenceFiles: File[] = [], 
  options: ExportOptions = { includeEvidence: true, includeTemplates: true, includeInstructions: true, format: 'pdf' }
): Promise<void> {
  const exporter = new ClaimPackExporter(claimData, evidenceFiles);
  await exporter.export(options);
}
