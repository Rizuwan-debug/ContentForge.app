"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClipboardCopy, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface CopyButtonProps {
  textToCopy: string;
  buttonText?: string;
  toastMessage?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CopyButton({ 
  textToCopy, 
  buttonText = "Copy", 
  toastMessage = "Copied to clipboard!",
  className,
  variant = "outline",
  size = "sm"
}: CopyButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Success",
        description: toastMessage,
        duration: 2000,
      });
      setCopied(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy text.",
        variant: "destructive",
        duration: 2000,
      });
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Button variant={variant} size={size} onClick={handleCopy} className={className}>
      {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <ClipboardCopy className="mr-2 h-4 w-4" />}
      {buttonText}
    </Button>
  );
}
