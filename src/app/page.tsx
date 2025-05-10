
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
import { collection, query, where, getDocs } from 'firebase/firestore'; // Corrected imports
import { db } from '@/lib/firebase/config';


export default function ContentForgePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [isPrecisionMode, setIsPrecisionMode] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false); 
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); 

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user) {
        const paymentQuery = collection(db, 'paymentRequests');
        const q = query(paymentQuery, where('userId', '==', user.uid), where('status', '==', 'verified'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setIsPremiumUser(true);
          // If user is verified premium, Precision Mode should reflect this,
          // but user might have manually toggled it off in current session.
          // We only force it ON if it's not already set by user choice in the session
          // For simplicity, if they are premium, we can enable it.
          // If they turn it off, it stays off until next check or they turn it on.
          // Or, always enable if premium:
          setIsPrecisionMode(true); 
        } else {
          // User is not verified premium in Firestore.
          // If `isPremiumUser` is true here, it's from a temporary grant in this session.
          // We don't set it to false, to preserve temporary access.
          // If it's false, it remains false.
        }
      } else {
        // No user, so not premium, and precision mode off.
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
      // Don't set isPrecisionMode immediately here.
      // The switch UI might revert if modal is cancelled.
      // If they upgrade, onUpgrade will set it.
    } else if (checked && isPremiumUser) {
        setIsPrecisionMode(true);
    }
    else { // Handles both (isPremiumUser && !checked) and (!isPremiumUser && !checked)
      setIsPrecisionMode(false);
    }
  };

  const handleTopicSubmit = async (topic: string) => {
    setCurrentTopic(topic);
    setIsLoading(true);
    setGeneratedContent(null);

    try {
      let trendingKeywords: TrendingKeyword[] = [];
      // Precision mode content generation only if user is premium *and* has the toggle enabled.
      if (isPremiumUser && isPrecisionMode) { 
        trendingKeywords = await getTrendingKeywords('general'); 
      }

      const content = await generateAppContent({
        platform: selectedPlatform,
        topic,
        isPrecisionMode: isPremiumUser && isPrecisionMode, 
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

  const handleGrantTemporaryPremium = () => {
    setIsPremiumUser(true); // Grant temporary premium status
    setIsPrecisionMode(true); // Automatically enable precision mode on successful claim
    // Toast message for success is handled within UpgradeProModal
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
            isPremiumUser={isPremiumUser} // Pass this to correctly reflect state in toggle
          />
        </CardContent>
      </Card>

      <div className="my-8 p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
        <p className="font-semibold text-lg">Advertisement</p>
        <p className="text-sm">(Future Ad Slot - e.g., 728x90)</p>
        <div data-ai-hint="banner ad" className="mt-2 bg-muted h-24 w-full flex items-center justify-center text-sm">Ad Content Area</div>
      </div>

      <ContentDisplay content={generatedContent} isLoading={isLoading} platform={selectedPlatform} />

      {isUpgradeModalOpen && (
        <UpgradeProModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => {
            setIsUpgradeModalOpen(false);
            // If precision mode was toggled on but modal closed without upgrading, revert the switch state.
            // This relies on isPremiumUser not being true yet.
            if (!isPremiumUser && isPrecisionMode) {
                 setIsPrecisionMode(false); 
            }
          }}
          onUpgrade={handleGrantTemporaryPremium}
        />
      )}
      
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <DonationButton />
        
        <div className="my-8 p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
          <p className="font-semibold text-lg">Advertisement</p>
          <p className="text-sm">(Future Ad Slot - e.g., 300x250)</p>
          <div data-ai-hint="square ad" className="mt-2 bg-muted h-32 w-full sm:w-64 mx-auto flex items-center justify-center text-sm">Ad Content Area</div>
        </div>

        {currentYear && <p className="mt-6">&copy; {currentYear} ContentForge. All rights reserved.</p>}
        <p>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
