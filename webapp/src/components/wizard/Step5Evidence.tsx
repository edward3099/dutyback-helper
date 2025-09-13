"use client";

import { useState, useEffect } from "react";
import { useClaimWizard } from "@/hooks/useWizard";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/FileUpload";
import { FileText, Receipt, Mail, CreditCard, Upload } from "lucide-react";
import { StorageService, UploadedFile } from "@/lib/storage";

export function Step5Evidence() {
  const { claimData, updateClaimData } = useClaimWizard();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile[]>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Generate a temporary claim ID for file organization
  const tempClaimId = `temp-${Date.now()}`;

  const handleEvidenceChange = (key: keyof typeof claimData.evidence, checked: boolean) => {
    updateClaimData({
      evidence: {
        ...claimData.evidence,
        [key]: checked
      }
    });
  };

  const handleFileUpload = async (files: UploadedFile[], evidenceType: string) => {
    setUploading(prev => ({ ...prev, [evidenceType]: true }));
    setUploadError(null);

    try {
      // In a real implementation, you would upload to Supabase Storage here
      // For now, we'll just add the files to local state
      setUploadedFiles(prev => ({
        ...prev,
        [evidenceType]: [...(prev[evidenceType] || []), ...files]
      }));

      // Update claim data with file information
      updateClaimData({
        evidenceFiles: {
          ...claimData.evidenceFiles,
          [evidenceType]: files.map(file => ({
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.url,
            uploadedAt: file.uploadedAt
          }))
        }
      });
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploading(prev => ({ ...prev, [evidenceType]: false }));
    }
  };

  const handleFileRemove = (fileId: string, evidenceType: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [evidenceType]: prev[evidenceType]?.filter(file => file.id !== fileId) || []
    }));

    // Update claim data
    const updatedFiles = uploadedFiles[evidenceType]?.filter(file => file.id !== fileId) || [];
    updateClaimData({
      evidenceFiles: {
        ...claimData.evidenceFiles,
        [evidenceType]: updatedFiles.map(file => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url,
          uploadedAt: file.uploadedAt
        }))
      }
    });
  };

  const evidenceItems = [
    {
      key: 'invoice' as const,
      title: 'Commercial Invoice',
      description: 'Original invoice from the seller showing item value',
      icon: FileText,
      required: true,
      help: 'This shows the actual value of the goods and is essential for calculating the correct duty.',
      evidenceType: 'invoice'
    },
    {
      key: 'customsDeclaration' as const,
      title: 'Customs Declaration (C88)',
      description: 'The official customs declaration form',
      icon: FileText,
      required: true,
      help: 'This shows what duty and VAT was actually charged by HMRC.',
      evidenceType: 'customs_declaration'
    },
    {
      key: 'paymentProof' as const,
      title: 'Payment Proof',
      description: 'Receipt or bank statement showing duty/VAT payment',
      icon: CreditCard,
      required: true,
      help: 'This proves you actually paid the charges you\'re claiming back.',
      evidenceType: 'receipt'
    },
    {
      key: 'correspondence' as const,
      title: 'Correspondence',
      description: 'Any emails or letters from courier/HMRC',
      icon: Mail,
      required: false,
      help: 'This can help support your claim, especially for rejected imports.',
      evidenceType: 'other'
    }
  ];

  const requiredItems = evidenceItems.filter(item => item.required);
  const completedRequired = requiredItems.filter(item => claimData.evidence[item.key]).length;
  const allRequiredComplete = completedRequired === requiredItems.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Evidence Checklist
        </h3>
        <p className="text-gray-600">
          Select all the documents you have available. Required items are marked with an asterisk.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidenceItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.key} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base flex items-center">
                      {item.title}
                      {item.required && <span className="text-red-500 ml-1">*</span>}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id={item.key}
                    checked={claimData.evidence[item.key]}
                    onCheckedChange={(checked) => handleEvidenceChange(item.key, checked as boolean)}
                  />
                  <Label htmlFor={item.key} className="text-sm font-medium">
                    I have this document
                  </Label>
                </div>
                
                {claimData.evidence[item.key] && (
                  <div className="mt-4">
                    <FileUpload
                      onUpload={(files) => handleFileUpload(files, item.evidenceType)}
                      onRemove={(fileId) => handleFileRemove(fileId, item.evidenceType)}
                      uploadedFiles={uploadedFiles[item.evidenceType] || []}
                      maxFiles={3}
                      maxSizeBytes={10 * 1024 * 1024} // 10MB
                      acceptedTypes={['application/pdf', 'image/jpeg', 'image/png', 'image/gif']}
                      disabled={uploading[item.evidenceType]}
                      className="text-sm"
                    />
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  {item.help}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-blue-900">Evidence Progress</h4>
            <span className="text-blue-800 font-medium">
              {completedRequired}/{requiredItems.length} required items
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedRequired / requiredItems.length) * 100}%` }}
            />
          </div>
          <p className="text-blue-800 text-sm">
            {allRequiredComplete 
              ? "Great! You have all the required evidence to proceed with your claim."
              : `You need ${requiredItems.length - completedRequired} more required document${requiredItems.length - completedRequired === 1 ? '' : 's'} to proceed.`
            }
          </p>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {allRequiredComplete && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">
              All required evidence is available. You can proceed to the next step.
            </p>
          </div>
        </div>
      )}

      {!allRequiredComplete && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">!</span>
            </div>
            <p className="text-yellow-800 font-medium">
              You need all required documents to proceed with your claim.
            </p>
          </div>
        </div>
      )}

      {/* Help Section */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Need help getting documents?</h4>
          <div className="text-gray-700 text-sm space-y-2">
            <p><strong>Commercial Invoice:</strong> Contact the seller or check your email for order confirmations.</p>
            <p><strong>Customs Declaration:</strong> Usually provided by the courier or available in your tracking details.</p>
            <p><strong>Payment Proof:</strong> Check your bank statements or courier payment confirmations.</p>
            <p><strong>Correspondence:</strong> Look through your emails for any communication about customs charges.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
