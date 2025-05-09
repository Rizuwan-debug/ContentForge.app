
"use client";

import { useState, useEffect } from 'react';
import type { Platform, GeneratedContent } from '@/types';
import { Header } from '@/components/content-forge/Header';
import { PlatformSelector } from '@/components/content-forge/PlatformSelector';
import { TopicInputForm } from '@/components/content-forge/TopicInputForm';
import { PrecisionModeToggle } from '@/components/content-forge/PrecisionModeToggle';
import { ContentDisplay } from '@/components/content-forge/ContentDisplay';
import { generateAppContent } from '@/lib/content-generator';
import { getTrendingKeywords, type TrendingKeyword } from '@/services/trending-keywords';
import { useToast } from "@/hooks/use-toast";
import { UpgradeProModal } from '@/components/content-forge/UpgradeProModal';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth'; 
import { DonationButton } from '@/components/content-forge/DonationButton';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';


export default function ContentForgePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [isPrecisionMode, setIsPrecisionMode] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false); 
  
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); 

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user) {
        // Check for a verified payment request
        // This is a simplified check. A real app might query for active subscriptions.
        // For now, if any verified payment exists, consider them premium.
        const paymentQuery = collection(db, 'paymentRequests');
        const q = query(paymentQuery, where('userId', '==', user.uid), where('status', '==', 'verified'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setIsPremiumUser(true);
          setIsPrecisionMode(true); // Also enable precision mode if already premium
        } else {
           // If no verified payment, check if they were temporarily premium from current session
           // This local state `isPremiumUser` handles the "temporary access"
           // If it's already true (from handleUpgradeSuccess), don't set it to false
           // This part is tricky if we only rely on Firestore for truth after refresh
           // For now, if Firestore says not premium, local state also becomes not premium
           // unless it was just set by `handleUpgradeSuccess`
           // A better approach would be to manage premium status more robustly in Firestore (e.g., subscription end date)
           // For this brief, temporary local state + manual verification is the path.
           // If isPremiumUser is true, it means it was set by handleUpgradeSuccess in current session.
           // Keep it true until page refresh, then Firestore will be the source of truth.
           // If we want to persist temp access across refresh before verification, we'd need local storage, but that's not asked.
           // So on fresh load/auth change, Firestore is the primary check.
           // setIsPremiumUser(false); // This would overwrite temporary access on auth change if not careful
        }
      } else {
        setIsPremiumUser(false);
        setIsPrecisionMode(false);
      }
    };

    if (!authLoading) {
      checkPremiumStatus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);


  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    setGeneratedContent(null); 
  };

  const handlePrecisionModeChange = (checked: boolean) => {
    if (checked && !isPremiumUser) {
      setIsUpgradeModalOpen(true);
      // Don't set isPrecisionMode(false) here, modal opening handles it.
      // The switch itself will revert if modal is cancelled.
    } else if (checked && isPremiumUser) {
        setIsPrecisionMode(true);
    }
    else {
      setIsPrecisionMode(false);
    }
  };

  const handleTopicSubmit = async (topic: string) => {
    setCurrentTopic(topic);
    setIsLoading(true);
    setGeneratedContent(null);

    try {
      let trendingKeywords: TrendingKeyword[] = [];
      if (isPrecisionMode && isPremiumUser) { 
        trendingKeywords = await getTrendingKeywords('general'); 
      }

      const content = await generateAppContent({
        platform: selectedPlatform,
        topic,
        isPrecisionMode: isPrecisionMode && isPremiumUser, // Ensure both flags are true
        trendingKeywords,
      });
      setGeneratedContent(content);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This function is called by UpgradeProModal after successfully logging payment attempt
  const handleGrantTemporaryPremium = () => {
    setIsPremiumUser(true);
    setIsPrecisionMode(true); // Automatically enable precision mode on successful claim
    // Toast message is handled within UpgradeProModal after Firestore log
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <Header />
      
      <Card className="mb-8 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <PlatformSelector selectedPlatform={selectedPlatform} onPlatformChange={handlePlatformChange} />
          <TopicInputForm onSubmit={handleTopicSubmit} isLoading={isLoading} />
          <PrecisionModeToggle 
            isPrecisionMode={isPrecisionMode} 
            onPrecisionModeChange={handlePrecisionModeChange}
            isPremiumUser={isPremiumUser}
          />
        </CardContent>
      </Card>

      <ContentDisplay content={generatedContent} isLoading={isLoading} platform={selectedPlatform} />

      {isUpgradeModalOpen && (
        <UpgradeProModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => {
            setIsUpgradeModalOpen(false);
            // If precision mode was toggled on but modal closed without upgrading, revert switch
            if (!isPremiumUser) setIsPrecisionMode(false); 
          }}
          onUpgrade={handleGrantTemporaryPremium}
        />
      )}
      
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <DonationButton />
        <p className="mt-6">&copy; {new Date().getFullYear()} ContentForge. All rights reserved.</p>
        <p>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}

// Needed for Firestore query
import { collection, query, where, getDocs } from 'firebase/firestore';
