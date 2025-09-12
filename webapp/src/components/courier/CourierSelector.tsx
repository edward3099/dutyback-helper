"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ExternalLink } from "lucide-react";
import { CourierPlaybookModal } from "./CourierPlaybookModal";

interface CourierSelectorProps {
  selectedCourier?: string;
  onCourierSelect: (courier: string) => void;
}

const couriers = [
  {
    id: 'DHL',
    name: 'DHL',
    description: 'International express delivery',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'D'
  },
  {
    id: 'FedEx',
    name: 'FedEx',
    description: 'Express and ground shipping',
    color: 'bg-purple-100 text-purple-800',
    icon: 'F'
  },
  {
    id: 'UPS',
    name: 'UPS',
    description: 'Package delivery and logistics',
    color: 'bg-brown-100 text-brown-800',
    icon: 'U'
  },
  {
    id: 'Royal Mail',
    name: 'Royal Mail',
    description: 'UK postal service',
    color: 'bg-red-100 text-red-800',
    icon: 'R'
  }
];

export function CourierSelector({ selectedCourier, onCourierSelect }: CourierSelectorProps) {
  const [selectedModal, setSelectedModal] = useState<'DHL' | 'FedEx' | 'UPS' | null>(null);

  const handleCourierSelect = (courierId: string) => {
    onCourierSelect(courierId);
  };

  const handleOpenPlaybook = (courier: 'DHL' | 'FedEx' | 'UPS') => {
    setSelectedModal(courier);
  };

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Which courier delivered your package?
        </h3>
        <p className="text-gray-600">
          Select your courier to get specific instructions for obtaining your MRN and EORI numbers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {couriers.map((courier) => (
          <Card 
            key={courier.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedCourier === courier.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleCourierSelect(courier.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${courier.color} rounded-lg flex items-center justify-center`}>
                    <span className="font-bold text-lg">{courier.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{courier.name}</CardTitle>
                    <CardDescription className="text-sm">{courier.description}</CardDescription>
                  </div>
                </div>
                {selectedCourier === courier.id && (
                  <Badge variant="default">Selected</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (courier.id === 'DHL' || courier.id === 'FedEx' || courier.id === 'UPS') {
                      handleOpenPlaybook(courier.id as 'DHL' | 'FedEx' | 'UPS');
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Get Help
                </Button>
                {courier.id === 'Royal Mail' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://www.royalmail.com/contact-us', '_blank');
                    }}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Contact
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCourier && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">
              Selected: {couriers.find(c => c.id === selectedCourier)?.name}
            </p>
          </div>
        </div>
      )}

      {/* Courier Playbook Modals */}
      <CourierPlaybookModal
        courier="DHL"
        isOpen={selectedModal === 'DHL'}
        onClose={handleCloseModal}
      />
      <CourierPlaybookModal
        courier="FedEx"
        isOpen={selectedModal === 'FedEx'}
        onClose={handleCloseModal}
      />
      <CourierPlaybookModal
        courier="UPS"
        isOpen={selectedModal === 'UPS'}
        onClose={handleCloseModal}
      />
    </div>
  );
}
