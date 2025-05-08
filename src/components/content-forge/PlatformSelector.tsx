import type { Platform } from '@/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Youtube, Instagram } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export function PlatformSelector({ selectedPlatform, onPlatformChange }: PlatformSelectorProps) {
  return (
    <Tabs value={selectedPlatform} onValueChange={(value) => onPlatformChange(value as Platform)} className="w-full mb-6">
      <TabsList className="grid w-full grid-cols-2 h-12">
        <TabsTrigger value="youtube" className="text-base h-full data-[state=active]:shadow-md">
          <Youtube className="mr-2 h-5 w-5" />
          YouTube
        </TabsTrigger>
        <TabsTrigger value="instagram" className="text-base h-full data-[state=active]:shadow-md">
          <Instagram className="mr-2 h-5 w-5" />
          Instagram
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
