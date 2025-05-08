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
import { useToast } from "@/hooks/use-toast"; // Added useToast
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradeProModal({ isOpen, onClose, onUpgrade }: UpgradeProModalProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    setIsProcessing(true);
    toast({
      title: "Simulating Payment",
      description: "In a real application, you would now be redirected to a payment gateway.",
      duration: 3000,
    });

    // Simulate a delay for the "payment processing"
    setTimeout(() => {
      onUpgrade();
      setIsProcessing(false); 
      // The success toast will be shown by the parent component's onUpgrade handler
    }, 3000);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!isProcessing) onClose(); }}>
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
          <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto" disabled={isProcessing}>Maybe Later</AlertDialogCancel>
          <AlertDialogAction asChild className="w-full sm:w-auto">
            <Button onClick={handleUpgradeClick} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upgrade to Pro"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
