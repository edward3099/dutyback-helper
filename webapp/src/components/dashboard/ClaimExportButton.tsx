'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { exportClaimPack, ExportOptions } from '@/lib/export';
import { ClaimData } from '@/types';

interface ClaimExportButtonProps {
  claim: ClaimData;
  evidenceFiles?: File[];
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

export function ClaimExportButton({ 
  claim, 
  evidenceFiles = [], 
  size = 'sm',
  variant = 'outline'
}: ClaimExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      
      const options: ExportOptions = {
        includeEvidence: evidenceFiles.length > 0,
        includeTemplates: true,
        includeInstructions: true,
        format: 'pdf'
      };
      
      await exportClaimPack(claim, evidenceFiles, options);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={exporting}
      size={size}
      variant={variant}
      className="flex items-center gap-2"
    >
      {exporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export
        </>
      )}
    </Button>
  );
}
