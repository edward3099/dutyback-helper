"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Mail, FileText } from "lucide-react";

export function Step1ChannelSelection() {
  const { claimData, updateClaimData, openBranchScreen } = useClaimWizard();

  const handleChannelSelect = (channel: 'courier' | 'postal') => {
    updateClaimData({ channel });
  };

  const handleBOR286Click = (e: React.MouseEvent) => {
    e.stopPropagation();
    openBranchScreen('bor286');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          How did you receive your package?
        </h3>
        <p className="text-gray-600">
          This determines which HMRC process you'll need to use for your claim.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Courier Option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            claimData.channel === 'courier' 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:shadow-md'
          }`}
          onClick={() => handleChannelSelect('courier')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Courier Delivery</CardTitle>
            <CardDescription>
              Delivered by DHL, FedEx, UPS, or other courier service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• You have a tracking number</li>
              <li>• Package was delivered to your address</li>
              <li>• You received customs charges</li>
              <li>• You can contact the courier directly</li>
            </ul>
          </CardContent>
        </Card>

        {/* Postal Option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            claimData.channel === 'postal' 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:shadow-md'
          }`}
          onClick={() => handleChannelSelect('postal')}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Postal Delivery</CardTitle>
            <CardDescription>
              Delivered by Royal Mail or other postal service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2 mb-4">
              <li>• Delivered through postal system</li>
              <li>• May have customs charges</li>
              <li>• Different claim process</li>
              <li>• Requires different documentation</li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBOR286Click}
              className="w-full flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              BOR286 Postal Process
            </Button>
          </CardContent>
        </Card>
      </div>

      {claimData.channel && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">
              Selected: {claimData.channel === 'courier' ? 'Courier Delivery' : 'Postal Delivery'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
