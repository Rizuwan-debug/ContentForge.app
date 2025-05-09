
"use client";

import { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Zap, Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { logPaymentAttempt } from "@/services/payment";
import { QrCodeDisplay } from "./QrCodeDisplay";
import { CopyButton } from "./CopyButton";


interface UpgradeProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void; // This will grant temporary access
}

const UPI_ID = "6002168251@fam";
const UPI_QR_DATA = `upi://pay?pa=${UPI_ID}&pn=ContentForge&cu=INR`; // Generic QR for ID

const amounts = [
  { value: "29", label: "₹29 / Basic" },
  { value: "49", label: "₹49 / Standard" },
  { value: "99", label: "₹99 / Premium (Best Value)" },
];

export function UpgradeProModal({ isOpen, onClose, onUpgrade }: UpgradeProModalProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>(amounts[2].value); // Default to best value

  if (!isOpen) return null;

  const handlePaymentConfirmation = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upgrade.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedAmount) {
        toast({
            title: "Selection Missing",
            description: "Please select a plan amount.",
            variant: "destructive",
        });
        return;
    }

    setIsProcessing(true);
    
    const amountValue = parseInt(selectedAmount, 10);
    const result = await logPaymentAttempt(user.uid, amountValue, "INR");

    if (result.success) {
      onUpgrade(); // Grant temporary access
      toast({
        title: "Payment Claim Submitted!",
        description: "Your access will be upgraded once payment is verified. Precision Mode is temporarily enabled.",
        duration: 5000,
      });
      onClose(); 
    } else {
      toast({
        title: "Submission Failed",
        description: result.error || "Could not record your payment claim. Please try again or contact support.",
        variant: "destructive",
      });
    }
    setIsProcessing(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!isProcessing && !open) onClose(); }}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <Zap className="h-12 w-12 text-primary" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-center">
            Unlock Precision Mode!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground pt-2">
            Upgrade to Pro for AI-enhanced content. Pay via UPI and click "I've Paid".
            We'll verify your payment shortly.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4 space-y-6">
          <div className="text-center">
            <p className="font-semibold mb-1">Scan QR or use UPI ID:</p>
            <div className="flex justify-center my-3">
              <QrCodeDisplay data={UPI_QR_DATA} altText="ContentForge UPI QR Code" size={180} />
            </div>
            <div className="flex items-center justify-center space-x-2">
                <p className="text-lg font-mono bg-muted px-3 py-1 rounded-md">{UPI_ID}</p>
                <CopyButton textToCopy={UPI_ID} buttonText="" size="icon" variant="ghost">
                    <Copy className="h-5 w-5" />
                </CopyButton>
            </div>
          </div>

          <div>
            <Label className="font-semibold mb-2 block text-center">Select Your Plan:</Label>
            <RadioGroup
              value={selectedAmount}
              onValueChange={setSelectedAmount}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {amounts.map((amount) => (
                <Label
                  key={amount.value}
                  htmlFor={`amount-${amount.value}`}
                  className={`flex flex-col items-center justify-center rounded-md border-2 p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer
                    ${selectedAmount === amount.value ? 'border-primary ring-2 ring-primary' : 'border-muted'}`}
                >
                  <RadioGroupItem value={amount.value} id={`amount-${amount.value}`} className="sr-only" />
                  <span className="font-bold text-lg">{amount.label.split('/')[0]}</span>
                  <span className="text-xs text-muted-foreground">{amount.label.split('/')[1]}</span>

                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <AlertDialogCancel onClick={onClose} className="w-full sm:w-auto" disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild className="w-full sm:w-auto">
            <Button onClick={handlePaymentConfirmation} className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isProcessing || !selectedAmount}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "I've Paid"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
