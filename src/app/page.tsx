"use client";

import { useState } from 'react';
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

// Mock user data - in a real app, this would come from Firebase Auth/Firestore
const MOCK_USER_IS_PREMIUM = false; 

export default function ContentForgePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('youtube');
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [isPrecisionMode, setIsPrecisionMode] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  
  const { toast } = useToast();

  const handlePlatformChange = (platform: Platform) => {
    setSelectedPlatform(platform);
    setGeneratedContent(null); // Clear content when platform changes
  };

  const handlePrecisionModeChange = (checked: boolean) => {
    if (checked && !MOCK_USER_IS_PREMIUM) {
      setIsUpgradeModalOpen(true);
      setIsPrecisionMode(false); // Keep it off if not premium
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
      if (isPrecisionMode && MOCK_USER_IS_PREMIUM) {
        // In a real app, category might be selected by user or inferred
        trendingKeywords = await getTrendingKeywords('general'); 
      }

      const content = await generateAppContent({
        platform: selectedPlatform,
        topic,
        isPrecisionMode: isPrecisionMode && MOCK_USER_IS_PREMIUM,
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
            isPremiumUser={MOCK_USER_IS_PREMIUM}
          />
        </CardContent>
      </Card>

      <ContentDisplay content={generatedContent} isLoading={isLoading} platform={selectedPlatform} />

      <UpgradeProModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)}
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
