import type { GeneratedContent } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "./CopyButton";
import { ThumbsUp, MessageSquare, Hash } from 'lucide-react';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  fullTextToCopy?: string;
  animationDelay?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, fullTextToCopy, animationDelay }) => (
  <Card 
    className="shadow-lg transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-xl animate-slide-up-fade-in"
    style={{ animationDelay }}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center">
        {icon}
        <CardTitle className="text-xl font-semibold ml-2">{title}</CardTitle>
      </div>
      {fullTextToCopy && <CopyButton textToCopy={fullTextToCopy} buttonText={`Copy All ${title}`} size="sm" />}
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);


export function ContentDisplay({ content, isLoading, platform }: {
  content: GeneratedContent | null;
  isLoading: boolean;
  platform: 'youtube' | 'instagram';
}) {
  if (isLoading) {
    return (
      <div className="space-y-6 mt-8">
        {platform === 'youtube' && (
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </CardContent>
          </Card>
        )}
        {platform === 'instagram' && (
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  let animationDelayCounter = 0;
  const getDelay = () => {
    const delay = `${animationDelayCounter * 150}ms`;
    animationDelayCounter++;
    return delay;
  };
  // Reset counter for consistent delays if component re-renders with new content
  // This simple reset works because ContentDisplay re-renders when `content` changes.
  animationDelayCounter = 0; 

  return (
    <div className="space-y-8 mt-8 animate-pop-in">
      {content.titles && content.titles.length > 0 && (
        <SectionCard 
          title="Suggested Titles" 
          icon={<ThumbsUp className="h-6 w-6 text-primary" />} 
          fullTextToCopy={content.titles.join('\n\n')}
          animationDelay={getDelay()}
        >
          <ul className="space-y-3">
            {content.titles.map((title, index) => (
              <li key={index} className="p-3 bg-secondary/30 rounded-md flex justify-between items-center group hover:bg-primary/10 hover:scale-[1.02] transform transition-all duration-200 ease-out">
                <span className="text-foreground flex-grow mr-2">{title}</span>
                <CopyButton textToCopy={title} buttonText="Copy" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {content.captions && content.captions.length > 0 && (
        <SectionCard 
          title="Suggested Captions" 
          icon={<MessageSquare className="h-6 w-6 text-primary" />} 
          fullTextToCopy={content.captions.map(c => `${c.style}:\n${c.text}`).join('\n\n---\n\n')}
          animationDelay={getDelay()}
        >
          <div className="space-y-4">
            {content.captions.map((caption, index) => (
              <div key={index} className="p-3 bg-secondary/30 rounded-md group hover:bg-primary/10 hover:scale-[1.02] transform transition-all duration-200 ease-out">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-primary">{caption.style}</h4>
                  <CopyButton textToCopy={caption.text} buttonText="Copy" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                </div>
                <p className="text-foreground whitespace-pre-line">{caption.text}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {content.hashtags && content.hashtags.length > 0 && (
        <SectionCard 
          title="Relevant Hashtags" 
          icon={<Hash className="h-6 w-6 text-primary" />} 
          fullTextToCopy={content.hashtags.join(' ')}
          animationDelay={getDelay()}
        >
          <div className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-md">
            {content.hashtags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full hover:bg-primary/20 hover:scale-105 transform transition-all duration-150 ease-out cursor-default">
                {tag}
              </span>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
