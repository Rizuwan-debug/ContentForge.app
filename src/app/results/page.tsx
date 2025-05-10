
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Platform, GeneratedContent } from '@/types';
import { Header } from '@/components/content-forge/Header';
import { ContentDisplay } from '@/components/content-forge/ContentDisplay';
import { generateAppContent } from '@/lib/content-generator';
import { getTrendingKeywords, type TrendingKeyword } from '@/services/trending-keywords';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [platform, setPlatform] = useState<Platform | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const [requestedPrecision, setRequestedPrecision] = useState<boolean>(false);
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const platformParam = searchParams.get('platform') as Platform;
    const topicParam = searchParams.get('topic');
    const precisionParam = searchParams.get('precision') === 'true';

    if (platformParam && topicParam) {
      setPlatform(platformParam);
      setTopic(decodeURIComponent(topicParam));
      setRequestedPrecision(precisionParam);
    } else {
      setError("Missing required parameters (platform or topic).");
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (user) {
        const paymentQuery = collection(db, 'paymentRequests');
        const q = query(paymentQuery, where('userId', '==', user.uid), where('status', '==', 'verified'));
        const snapshot = await getDocs(q);
        setIsPremiumUser(!snapshot.empty);
      } else {
        setIsPremiumUser(false);
      }
    };

    if (!authLoading) {
      checkPremiumStatus();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (platform && topic && !authLoading) { // Wait for authLoading to finish
      const fetchContent = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedContent(null);

        const actualPrecisionMode = isPremiumUser && requestedPrecision;

        try {
          let trendingKeywords: TrendingKeyword[] = [];
          if (actualPrecisionMode) { 
            trendingKeywords = await getTrendingKeywords('general'); 
          }

          const content = await generateAppContent({
            platform,
            topic,
            isPrecisionMode: actualPrecisionMode,
            trendingKeywords,
          });
          setGeneratedContent(content);
        } catch (err) {
          console.error("Error generating content on results page:", err);
          setError("Failed to generate content. Please try again.");
          toast({
            title: "Error",
            description: "Failed to generate content. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchContent();
    }
  }, [platform, topic, requestedPrecision, isPremiumUser, authLoading, toast]);

  if (authLoading || (isLoading && !error && platform && topic)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Generating your content for "{topic}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto mt-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-destructive flex items-center justify-center">
            <AlertCircle className="h-6 w-6 mr-2" /> Error
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-destructive-foreground mb-6">{error}</p>
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (!platform || !topic) {
     // This case should ideally be caught by the initial param check, but as a fallback:
    return (
      <Card className="w-full max-w-md mx-auto mt-10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-destructive flex items-center justify-center">
            <AlertCircle className="h-6 w-6 mr-2" /> Invalid Request
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">Could not load content due to missing information.</p>
          <Button onClick={() => router.push('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Generator
          </Button>
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="w-full">
      <Card className="mb-6 shadow-xl bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Generated Content for: <span className="text-primary">{topic}</span></CardTitle>
          <CardDescription>Platform: {platform.charAt(0).toUpperCase() + platform.slice(1)} {isPremiumUser && requestedPrecision ? <span className="font-semibold text-primary">(Precision Mode)</span> : ''}</CardDescription>
        </CardHeader>
      </Card>
      <ContentDisplay 
        content={generatedContent} 
        isLoading={isLoading} // isLoading here is for initial load, content has its own internal skeleton
        platform={platform} 
      />
      <div className="mt-8 text-center">
        <Button onClick={() => router.push('/')} variant="default" size="lg">
          <ArrowLeft className="mr-2 h-5 w-5" /> Generate New Content
        </Button>
      </div>
    </div>
  );
}


export default function ResultsPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <Header />
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Loading results...</p>
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </div>
  );
}
