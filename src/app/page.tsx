
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
          setIsPrecisionMode(true); 
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
    setIsPremiumUser(true); 
    setIsPrecisionMode(true); 
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <Header />
      
      <div className="flex flex-col lg:flex-row lg:justify-center lg:gap-x-6">
        
        {/* Desktop Left Ad Panel */}
        <aside id="ad-slot-left" className="ad-slot hidden lg:flex flex-col w-[100px] h-[600px] bg-muted rounded-lg shadow-md p-2 flex-shrink-0 lg:order-1">
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-muted-foreground/30 rounded-md">
            <p className="text-sm font-medium text-muted-foreground">AD</p>
            <p className="text-xs text-muted-foreground">(100x600)</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow lg:order-2 lg:min-w-[640px] lg:max-w-[800px] min-w-0">
          <Card className="mb-6 shadow-xl bg-card/80 backdrop-blur-sm">
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

          {/* Existing Banner Ad Slot (remains for all sizes) */}
          <div className="my-6 p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <p className="text-sm">(Future Ad Slot - e.g., 728x90)</p>
            <div data-ai-hint="banner ad" className="mt-2 bg-muted h-24 w-full flex items-center justify-center text-sm">Ad Content Area</div>
          </div>
          
          {/* Mobile Ad Slot 1 (shown when sidebars are hidden) */}
          <div id="ad-slot-mobile-1" className="ad-slot block lg:hidden my-6 p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <div className="mt-2 bg-muted h-52 w-full flex items-center justify-center text-sm">Mobile Ad Area 1</div>
          </div>

          <ContentDisplay content={generatedContent} isLoading={isLoading} platform={selectedPlatform} />

          {/* Mobile Ad Slot 2 (shown when sidebars are hidden) */}
          <div id="ad-slot-mobile-2" className="ad-slot block lg:hidden my-6 p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <div className="mt-2 bg-muted h-52 w-full flex items-center justify-center text-sm">Mobile Ad Area 2</div>
          </div>
        </main>

        {/* Desktop Right Ad Panel */}
        <aside id="ad-slot-right" className="ad-slot hidden lg:flex flex-col w-[100px] h-[600px] bg-muted rounded-lg shadow-md p-2 flex-shrink-0 lg:order-3">
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-muted-foreground/30 rounded-md">
            <p className="text-sm font-medium text-muted-foreground">AD</p>
            <p className="text-xs text-muted-foreground">(100x600)</p>
          </div>
        </aside>
      </div>

      {isUpgradeModalOpen && (
        <UpgradeProModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => {
            setIsUpgradeModalOpen(false);
            if (!isPremiumUser && isPrecisionMode) {
                 setIsPrecisionMode(false); 
            }
          }}
          onUpgrade={handleGrantTemporaryPremium}
        />
      )}
      
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <DonationButton />
        
        {/* Existing Square Ad Slot in Footer (remains for all sizes) */}
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

