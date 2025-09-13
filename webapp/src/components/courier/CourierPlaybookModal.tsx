"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CourierPlaybook } from "@/components/wizard/CourierPlaybook";

interface CourierPlaybookModalProps {
  courier: 'DHL' | 'FedEx' | 'UPS';
  isOpen: boolean;
  onClose: () => void;
}

export function CourierPlaybookModal({ courier, isOpen, onClose }: CourierPlaybookModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{courier} Playbook</DialogTitle>
        </DialogHeader>
        <CourierPlaybook courier={courier} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}