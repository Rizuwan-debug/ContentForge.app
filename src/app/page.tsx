
"use client";

import { useState, useEffect } from 'react';
import type { Platform } from '@/types';
import { Header } from '@/components/content-forge/Header';
import { PlatformSelector } from '@/components/content-forge/PlatformSelector';
import { TopicInputForm } from '@/components/content-forge/TopicInputForm';
import { PrecisionModeToggle } from '@/components/content-forge/PrecisionModeToggle';
import { useToast } from "@/hooks/use-toast";
import { UpgradeProModal } from '@/components/content-forge/UpgradeProModal';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth'; 
import { DonationButton } from '@/components/content-forge/DonationButton';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

export default function ContentForgePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [isPrecisionMode, setIsPrecisionMode] = useState<boolean>(false);
  const [isTopicFormLoading, setIsTopicFormLoading] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false); 
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); 
  const router = useRouter();

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
        } else {
          setIsPremiumUser(false);
          setIsPrecisionMode(false); 
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
  };

  const handlePrecisionModeChange = (checked: boolean) => {
    if (checked && !isPremiumUser) {
      setIsUpgradeModalOpen(true);
      if(isPrecisionMode) setIsPrecisionMode(false);
    } else {
      setIsPrecisionMode(checked);
    }
  };

  const handleTopicSubmit = async (topic: string) => {
    setIsTopicFormLoading(true); 
    const actualPrecisionMode = isPremiumUser && isPrecisionMode;

    try {
      router.push(`/results?platform=${selectedPlatform}&topic=${encodeURIComponent(topic)}&precision=${actualPrecisionMode}`);
    } catch (error) {
      console.error("Error navigating to results:", error);
      toast({
        title: "Navigation Error",
        description: "Could not navigate to results page. Please try again.",
        variant: "destructive",
      });
      setIsTopicFormLoading(false);
    }
  };
  
  useEffect(() => {
    return () => {
      setIsTopicFormLoading(false);
    };
  }, [router]);


  const handleGrantTemporaryPremium = () => {
    setIsPremiumUser(true); 
    setIsPrecisionMode(true);
    toast({
      title: "Precision Mode Unlocked!",
      description: "You can now use Precision Mode for enhanced content generation.",
    });
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <Header />
      
      {/* Main Content Area - Centered */}
      <main className="flex-grow lg:min-w-[640px] lg:max-w-[800px] min-w-0 mx-auto">
        <Card className="mb-6 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <PlatformSelector selectedPlatform={selectedPlatform} onPlatformChange={handlePlatformChange} />
            <TopicInputForm onSubmit={handleTopicSubmit} isLoading={isTopicFormLoading} />
            <PrecisionModeToggle 
              isPrecisionMode={isPrecisionMode} 
              onPrecisionModeChange={handlePrecisionModeChange}
              isPremiumUser={isPremiumUser}
            />
             <div className="mt-8 flex justify-center">
              <DonationButton />
            </div>
          </CardContent>
        </Card>
      </main>

      {/* All Ads Below Main Content */}
      <div className="mt-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* All Ad Slots Grouped Here */}
        <div className="w-full space-y-8">
          {/* Ad Slot 1 (formerly left sidebar) */}
          <div id="ad-slot-left" className="ad-slot w-full max-w-md mx-auto bg-muted rounded-lg shadow-md p-4">
            <div className="flex flex-col items-center justify-center h-[150px] border border-dashed border-muted-foreground/30 rounded-md">
              <p className="text-sm font-medium text-muted-foreground">ADVERTISEMENT</p>
              <p className="text-xs text-muted-foreground">(Vertical Ad Slot - 100x600 equivalent)</p>
            </div>
          </div>

          {/* Ad Slot 2 (formerly inside main) */}
          <div className="p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <p className="text-sm">(Future Ad Slot - e.g., 728x90)</p>
            <div data-ai-hint="banner ad" className="mt-2 bg-muted h-24 w-full flex items-center justify-center text-sm">Ad Content Area</div>
          </div>
          
          {/* Ad Slot 3 (mobile-1, formerly inside main) */}
          <div id="ad-slot-mobile-1" className="ad-slot block lg:hidden p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <div className="mt-2 bg-muted h-52 w-full flex items-center justify-center text-sm">Mobile Ad Area 1</div>
          </div>

          {/* Ad Slot 4 (formerly footer ad) */}
          <div className="p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <p className="text-sm">(Future Ad Slot - e.g., 300x250)</p>
            <div data-ai-hint="square ad" className="mt-2 bg-muted h-32 w-full sm:w-64 mx-auto flex items-center justify-center text-sm">Ad Content Area</div>
          </div>

          {/* Ad Slot 5 (mobile-2, formerly inside main) */}
          <div id="ad-slot-mobile-2" className="ad-slot block lg:hidden p-4 border-2 border-dashed border-muted-foreground text-center text-muted-foreground bg-card rounded-lg">
            <p className="font-semibold text-lg">Advertisement</p>
            <div className="mt-2 bg-muted h-52 w-full flex items-center justify-center text-sm">Mobile Ad Area 2</div>
          </div>

          {/* Ad Slot 6 (formerly right sidebar) */}
          <div id="ad-slot-right" className="ad-slot w-full max-w-md mx-auto bg-muted rounded-lg shadow-md p-4">
            <div className="flex flex-col items-center justify-center h-[150px] border border-dashed border-muted-foreground/30 rounded-md">
              <p className="text-sm font-medium text-muted-foreground">ADVERTISEMENT</p>
              <p className="text-xs text-muted-foreground">(Vertical Ad Slot - 100x600 equivalent)</p>
            </div>
          </div>
        </div>
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
        {currentYear && <p className="mt-6">&copy; {currentYear} ContentForge. All rights reserved.</p>}
        <p>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}

