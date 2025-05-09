
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QrCodeDisplay } from "./QrCodeDisplay";
import { CopyButton } from "./CopyButton";
import { Gift, Copy } from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPI_ID = "6002168251@fam";
const UPI_QR_DATA = `upi://pay?pa=${UPI_ID}&pn=ContentForgeDonation&cu=INR`;

const CRYPTO_WALLETS = [
  { name: "Bitcoin (BTC)", address: "bc1qdftumm683dp35v56xmra8pnpup08dn6g4ygw27", qrDataPrefix: "bitcoin:" },
  { name: "Ethereum (ETH)", address: "0x423E5F6BC6B4e3A5a6571989C5C3a08cC15b4704", qrDataPrefix: "ethereum:" },
  { name: "Solana (SOL)", address: "HNnSMWu7TDULmw7h3eV28nrLdQoiFx94n5otQrc8yX7B", qrDataPrefix: "solana:" },
];

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  if (!isOpen) return null;

  const handleIveDonated = () => {
    // This button is mostly for user acknowledgement.
    // In a real scenario, this might trigger a "thank you" notification or similar.
    onClose();
    // Consider adding a toast message here if desired using useToast()
    // toast({ title: "Thank You!", description: "Your support is greatly appreciated!" });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <div className="flex justify-center mb-3">
            <Gift className="h-12 w-12 text-primary" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-center">
            Support ContentForge
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground pt-2">
            Your generous donations help us keep ContentForge running and improving. Thank you!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Tabs defaultValue="upi" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upi">UPI (India)</TabsTrigger>
            <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upi" className="pt-4 text-center space-y-4">
            <p className="font-semibold">Scan QR or use UPI ID:</p>
            <div className="flex justify-center">
              <QrCodeDisplay data={UPI_QR_DATA} altText="ContentForge UPI Donation QR Code" size={180} />
            </div>
            <div className="flex items-center justify-center space-x-2 bg-muted p-2 rounded-md">
              <span className="font-mono text-sm sm:text-base">{UPI_ID}</span>
              <CopyButton textToCopy={UPI_ID} buttonText="" size="icon" variant="ghost">
                 <Copy className="h-5 w-5" />
              </CopyButton>
            </div>
            <Button onClick={handleIveDonated} className="w-full sm:w-auto mt-2">I've Donated via UPI</Button>
          </TabsContent>

          <TabsContent value="crypto" className="pt-4 space-y-6">
            {CRYPTO_WALLETS.map((wallet) => (
              <div key={wallet.name} className="space-y-2 p-3 border rounded-md bg-card">
                <h4 className="font-semibold text-center">{wallet.name}</h4>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2">
                    <div className="flex-shrink-0">
                         <QrCodeDisplay data={`${wallet.qrDataPrefix}${wallet.address}`} altText={`${wallet.name} QR Code`} size={100} />
                    </div>
                    <div className="flex-grow text-center sm:text-left break-all">
                        <p className="text-xs sm:text-sm font-mono bg-muted px-2 py-1 rounded">{wallet.address}</p>
                    </div>
                    <CopyButton textToCopy={wallet.address} buttonText="Copy" size="sm" className="mt-2 sm:mt-0 w-full sm:w-auto" />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-2">
              After sending crypto, no further action is needed. Thank you for your support!
            </p>
          </TabsContent>
        </Tabs>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={onClose} className="w-full">Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
