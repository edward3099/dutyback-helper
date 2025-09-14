'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Archive, Loader2, CheckCircle } from 'lucide-react';
import { ClaimData } from '@/types';
import { exportClaimPack, ExportOptions } from '@/lib/export';

interface ClaimPackExportProps {
  claimData: ClaimData;
  evidenceFiles: File[];
  onExportComplete?: () => void;
}

export function ClaimPackExport({ claimData, evidenceFiles, onExportComplete }: ClaimPackExportProps) {
  const [exporting, setExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    includeEvidence: true,
    includeTemplates: true,
    includeInstructions: true,
    format: 'pdf'
  });

  const handleExport = async () => {
    try {
      setExporting(true);
      setExportComplete(false);
      
      await exportClaimPack(claimData, evidenceFiles, options);
      
      setExportComplete(true);
      onExportComplete?.();
      
      // Reset completion state after 3 seconds
      setTimeout(() => setExportComplete(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const updateOption = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const getFormType = () => {
    if (claimData.channel === 'postal') return 'BOR286 (Postal)';
    if (claimData.isVATRegistered) return 'VAT Return Adjustment';
    return 'C285 (Courier)';
  };

  const getFileCount = () => {
    return evidenceFiles.length;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Claim Pack
        </CardTitle>
        <CardDescription>
          Generate a complete claim pack with all necessary documents for your HMRC submission.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Claim Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Claim Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Form Type:</span>
              <span className="ml-2 font-medium">{getFormType()}</span>
            </div>
            <div>
              <span className="text-gray-600">Tracking Number:</span>
              <span className="ml-2 font-medium">{claimData.trackingNumber || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Import Date:</span>
              <span className="ml-2 font-medium">{claimData.importDate || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Amount:</span>
              <span className="ml-2 font-medium">£{claimData.totalAmount || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-600">Evidence Files:</span>
              <span className="ml-2 font-medium">{getFileCount()} files</span>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h3 className="font-semibold">Export Options</h3>
          
          {/* Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select value={options.format} onValueChange={(value) => updateOption('format', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF Document
                  </div>
                </SelectItem>
                <SelectItem value="zip">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    ZIP Archive
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTemplates"
                checked={options.includeTemplates}
                onCheckedChange={(checked) => updateOption('includeTemplates', checked)}
              />
              <Label htmlFor="includeTemplates" className="text-sm font-medium">
                Include HMRC Forms & Cover Letter
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeInstructions"
                checked={options.includeInstructions}
                onCheckedChange={(checked) => updateOption('includeInstructions', checked)}
              />
              <Label htmlFor="includeInstructions" className="text-sm font-medium">
                Include Step-by-Step Instructions
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeEvidence"
                checked={options.includeEvidence}
                onCheckedChange={(checked) => updateOption('includeEvidence', checked)}
                disabled={evidenceFiles.length === 0}
              />
              <Label htmlFor="includeEvidence" className="text-sm font-medium">
                Include Evidence Files ({getFileCount()} files)
              </Label>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="flex flex-col space-y-4">
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="w-full"
            size="lg"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Claim Pack...
              </>
            ) : exportComplete ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Export Complete!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Claim Pack
              </>
            )}
          </Button>

          {exportComplete && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your claim pack has been downloaded successfully! Check your downloads folder.
              </AlertDescription>
            </Alert>
          )}

          {evidenceFiles.length === 0 && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                No evidence files attached. You can still export the claim pack with forms and instructions.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* What's Included */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">What's Included in Your Claim Pack:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Completed HMRC form ({getFormType()})</li>
            <li>• Professional cover letter</li>
            <li>• Step-by-step submission instructions</li>
            {evidenceFiles.length > 0 && <li>• All evidence files ({getFileCount()} files)</li>}
            <li>• HMRC contact information and deadlines</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
