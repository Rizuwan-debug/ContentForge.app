"use client";

import { useState, useEffect } from 'react';
import type { Platform } from '@/types';
import { Header } from '@/components/content-forge/Header';
import { PlatformSelector } from '@/components/content-forge/PlatformSelector';
import { TopicInputForm } from '@/components/content-forge/TopicInputForm';
import { PrecisionModeToggle } from '@/components/content-forge/PrecisionModeToggle';
// ContentDisplay is removed as it will be on the results page
// import { generateAppContent } from '@/lib/content-generator'; // Will be used on results page
// import { getTrendingKeywords, type TrendingKeyword } from '@/services/trending-keywords'; // Will be used on results page
import { useToast } from "@/hooks/use-toast";
import { UpgradeProModal } from '@/components/content-forge/UpgradeProModal';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth'; 
import { DonationButton } from '@/components/content-forge/DonationButton';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation'; // Added for navigation

export default function ContentForgePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  // currentTopic is now handled by TopicInputForm, but we might need it for navigation
  // const [currentTopic, setCurrentTopic] = useState<string>(''); 
  const [isPrecisionMode, setIsPrecisionMode] = useState<boolean>(false);
  // generatedContent and related isLoading state are removed
  // const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isTopicFormLoading, setIsTopicFormLoading] = useState<boolean>(false); // Renamed isLoading for clarity
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false); 
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  const { toast } = useToast(); // Keep toast for other notifications if needed
  const { user, loading: authLoading } = useAuth(); 
  const router = useRouter(); // Initialize router

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
          // setIsPrecisionMode(true); // User can toggle this even if premium
        } else {
          setIsPremiumUser(false);
          setIsPrecisionMode(false); // Non-premium cannot use precision mode
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
    // No need to setGeneratedContent(null) anymore
  };

  const handlePrecisionModeChange = (checked: boolean) => {
    if (checked && !isPremiumUser) {
      setIsUpgradeModalOpen(true);
       // Ensure switch reflects that precision mode is not enabled
      if(isPrecisionMode) setIsPrecisionMode(false);
    } else {
      setIsPrecisionMode(checked);
    }
  };

  const handleTopicSubmit = async (topic: string) => {
    // setCurrentTopic(topic); // Topic is passed directly
    setIsTopicFormLoading(true); // Indicate form submission is in progress

    // Determine the actual precision mode to pass based on premium status
    const actualPrecisionMode = isPremiumUser && isPrecisionMode;

    try {
      // Navigate to the results page with query parameters
      router.push(`/results?platform=${selectedPlatform}&topic=${encodeURIComponent(topic)}&precision=${actualPrecisionMode}`);
      // No direct content generation or error handling here for generation itself
    } catch (error) {
      // This catch is for potential navigation errors, though unlikely for router.push
      console.error("Error navigating to results:", error);
      toast({
        title: "Navigation Error",
        description: "Could not navigate to results page. Please try again.",
        variant: "destructive",
      });
      setIsTopicFormLoading(false); // Reset loading state if navigation fails
    }
    // setIsTopicFormLoading(false) will be reset when navigation occurs or on error
  };
  
  useEffect(() => {
    // Reset loading state when component unmounts or route changes,
    // effectively after successful navigation.
    return () => {
      setIsTopicFormLoading(false);
    };
  }, [router]);


  const handleGrantTemporaryPremium = () => {
    setIsPremiumUser(true); 
    setIsPrecisionMode(true); // Enable precision mode toggle after upgrade
    toast({
      title: "Precision Mode Unlocked!",
      description: "You can now use Precision Mode for enhanced content generation.",
    });
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <Header />
      
      <div className="flex flex-col lg:flex-row lg:justify-center lg:gap-x-6">
        
        <aside id="ad-slot-left" className="ad-slot hidden lg:flex flex-col w-[100px] h-[600px] bg-muted rounded-lg shadow-md p-2 flex-shrink-0 lg:order-1">
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-muted-foreground/30 rounded-md">
            <p className="text-sm font-medium text-muted-foreground">AD</p>
            <p className="text-xs text-muted-foreground">(100x600)</p>
          </div>
        </aside>

        <main className="flex-grow lg:order-2 lg:min-w-[640px] lg:max-w-[800px] min-w-0">
          <Card className="mb-6 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <PlatformSelector selectedPlatform={selectedPlatform} onPlatformChange={handlePlatformChange} />
              <TopicInputForm onSubmit={handleTopicSubmit} isLoading={isTopicFormLoading} />
              <PrecisionModeToggle 
                isPrecisionMode={isPrecisionMode} 
                onPrecisionModeChange={handlePrecisionModeChange}
                isPremiumUser={isPremiumUser}
              />
            </CardContent>
          </Card>

          <div className="my-6 p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <p className="text-sm">(Future Ad Slot - e.g., 728x90)</p>
            <div data-ai-hint="banner ad" className="mt-2 bg-muted h-24 w-full flex items-center justify-center text-sm">Ad Content Area</div>
          </div>
          
          <div id="ad-slot-mobile-1" className="ad-slot block lg:hidden my-6 p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <div className="mt-2 bg-muted h-52 w-full flex items-center justify-center text-sm">Mobile Ad Area 1</div>
          </div>

          {/* ContentDisplay component removed from here */}

          <div id="ad-slot-mobile-2" className="ad-slot block lg:hidden my-6 p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <div className="mt-2 bg-muted h-52 w-full flex items-center justify-center text-sm">Mobile Ad Area 2</div>
          </div>
        </main>

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
            // If modal is closed without upgrading, and precision mode was toggled on, turn it off.
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