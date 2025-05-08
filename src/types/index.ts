export type Platform = 'youtube' | 'instagram';

export interface GeneratedContent {
  titles?: string[];
  captions?: Array<{ style: string; text: string }>;
  hashtags?: string[];
}
