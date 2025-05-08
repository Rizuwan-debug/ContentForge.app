import type { GeneratedContent } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "./CopyButton";
import { ThumbsUp, MessageSquare, Hash } from 'lucide-react';

interface ContentDisplayProps {
  content: GeneratedContent | null;
  isLoading: boolean;
  platform: 'youtube' | 'instagram';
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; fullTextToCopy?: string }> = ({ title, icon, children, fullTextToCopy }) => (
  <Card className="shadow-lg_ transition-all duration-300 hover:shadow-xl">
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


export function ContentDisplay({ content, isLoading, platform }: ContentDisplayProps) {
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

  return (
    <div className="space-y-8 mt-8 animate-fadeIn">
      {content.titles && content.titles.length > 0 && (
        <SectionCard title="Suggested Titles" icon={<ThumbsUp className="h-6 w-6 text-primary" />} fullTextToCopy={content.titles.join('\n\n')}>
          <ul className="space-y-3">
            {content.titles.map((title, index) => (
              <li key={index} className="p-3 bg-secondary/30 rounded-md flex justify-between items-center group">
                <span className="text-foreground flex-grow mr-2">{title}</span>
                <CopyButton textToCopy={title} buttonText="Copy" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {content.captions && content.captions.length > 0 && (
        <SectionCard title="Suggested Captions" icon={<MessageSquare className="h-6 w-6 text-primary" />} fullTextToCopy={content.captions.map(c => `${c.style}:\n${c.text}`).join('\n\n---\n\n')}>
          <div className="space-y-4">
            {content.captions.map((caption, index) => (
              <div key={index} className="p-3 bg-secondary/30 rounded-md group">
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
        <SectionCard title="Relevant Hashtags" icon={<Hash className="h-6 w-6 text-primary" />} fullTextToCopy={content.hashtags.join(' ')}>
          <div className="flex flex-wrap gap-2 p-3 bg-secondary/30 rounded-md">
            {content.hashtags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// Add fadeIn animation to globals.css or tailwind.config.js if it doesn't exist
// For example in tailwind.config.js:
// theme: {
//   extend: {
//     animation: {
//       fadeIn: 'fadeIn 0.5s ease-in-out',
//     },
//     keyframes: {
//       fadeIn: {
//         '0%': { opacity: 0 },
//         '100%': { opacity: 1 },
//       },
//     },
//   },
// },
// Don't forget to run `npx tailwindcss -i ./src/app/globals.css -o ./src/app/output.css --watch` or similar if not using a build step that handles this.
// For Next.js, this should be handled by the build process.
// The `animate-fadeIn` class assumes you have this keyframe and animation defined.
// If using tailwindcss-animate, it might already be available or easily configurable.
// A simpler approach for this task: just rely on browser default or skip explicit animation if setup is complex for the current scope.
// The provided solution will try to use `animate-fadeIn`. If it's not defined in globals or tailwind, there will be no animation.
// For this specific exercise, I will create a simple fadeIn animation in globals.css for this effect.
