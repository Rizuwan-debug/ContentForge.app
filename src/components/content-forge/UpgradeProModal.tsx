
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void; // New prop for handling successful upgrade
}

export function UpgradeProModal({ isOpen, onClose, onUpgrade }: UpgradeProModalProps) {
  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    // In a real app, this would redirect to a payment page or open a payment modal.
    // For this mock, we call the onUpgrade prop passed from the parent.
    onUpgrade(); 
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <Zap className="h-12 w-12 text-primary" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-center">
            Unlock Precision Mode!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground pt-2">
            Get smarter, AI-enhanced content suggestions with our Pro plan. Elevate your content strategy and save time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 text-center">
          <p className="text-lg font-semibold">Upgrade to Pro for just:</p>
          <p className="text-2xl font-bold text-primary my-1">₹99/month or ₹25/week</p>
          <p className="text-xs text-muted-foreground">(Cancel anytime)</p>
        </div>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto">Maybe Later</AlertDialogCancel>
          <AlertDialogAction asChild className="w-full sm:w-auto">
            <Button onClick={handleUpgradeClick} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Upgrade to Pro
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
