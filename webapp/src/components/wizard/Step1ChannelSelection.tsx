"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Mail, FileText } from "lucide-react";
import ReactBitsSpotlightCard from "@/components/ui/ReactBitsSpotlightCard";

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Courier Option */}
        <ReactBitsSpotlightCard
          isSelected={claimData.channel === 'courier'}
          onClick={() => handleChannelSelect('courier')}
          variant="channel"
        >
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Courier Delivery</h3>
            <p className="text-sm opacity-80 mb-4">
              Delivered by DHL, FedEx, UPS, or other courier service
            </p>
            <ul className="text-xs space-y-1 text-left">
              <li>• You have a tracking number</li>
              <li>• Package was delivered to your address</li>
              <li>• You received customs charges</li>
              <li>• You can contact the courier directly</li>
            </ul>
          </div>
        </ReactBitsSpotlightCard>

        {/* Postal Option */}
        <ReactBitsSpotlightCard
          isSelected={claimData.channel === 'postal'}
          onClick={() => handleChannelSelect('postal')}
          variant="channel"
        >
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Postal Delivery</h3>
            <p className="text-sm opacity-80 mb-4">
              Delivered by Royal Mail or other postal service
            </p>
            <ul className="text-xs space-y-1 text-left mb-4">
              <li>• Delivered through postal system</li>
              <li>• May have customs charges</li>
              <li>• Different claim process</li>
              <li>• Requires different documentation</li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBOR286Click}
              className="w-full flex items-center gap-2 text-xs"
            >
              <FileText className="w-3 h-3" />
              BOR286 Postal Process
            </Button>
          </div>
        </ReactBitsSpotlightCard>
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
