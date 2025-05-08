
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


export default function ContentForgePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [isPrecisionMode, setIsPrecisionMode] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false); // Manage premium status with state
  
  const { toast } = useToast();
  const { user } = useAuth(); 

  // Effect to potentially set premium status based on user, e.g., from Firestore custom claims
  // For now, it's just a placeholder. In a real app, you'd fetch this.
  useEffect(() => {
    if (user) {
      // Example: Check if user.uid === 'some_premium_user_uid' or fetch premium status from DB
      // setIsPremiumUser(checkIfUserIsPremium(user.uid)); 
    } else {
      setIsPremiumUser(false); // Reset premium status if user logs out
    }
  }, [user]);


  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    setGeneratedContent(null); 
  };

  const handlePrecisionModeChange = (checked: boolean) => {
    if (checked && !isPremiumUser) {
      setIsUpgradeModalOpen(true);
      setIsPrecisionMode(false); 
    } else {
      setIsPrecisionMode(checked);
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
        isPrecisionMode: isPrecisionMode && isPremiumUser,
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

  const handleUpgradeSuccess = () => {
    setIsPremiumUser(true);
    setIsUpgradeModalOpen(false);
    setIsPrecisionMode(true); // Automatically enable precision mode on upgrade
    toast({
      title: "Upgrade Successful!",
      description: "You are now a Pro member. Precision Mode unlocked!",
      variant: "default", 
    });
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

      <UpgradeProModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgradeSuccess} // Pass the upgrade handler
      />
      
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ContentForge. All rights reserved.</p>
        <p>
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}
