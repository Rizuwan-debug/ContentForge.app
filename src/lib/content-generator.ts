import type { Platform, GeneratedContent } from '@/types';
import type { TrendingKeyword } from '@/services/trending-keywords';

interface GenerateContentOptions {
  platform: Platform;
  topic: string;
  isPrecisionMode: boolean;
  trendingKeywords?: TrendingKeyword[];
}

function getRandomElements<T>(arr: T[], count: number): T[] {
  if (!arr || arr.length === 0) return [];
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function generateAppContent(options: GenerateContentOptions): Promise<GeneratedContent> {
  const { platform, topic, isPrecisionMode, trendingKeywords } = options;
  const year = new Date().getFullYear();
  const cleanTopic = topic.toLowerCase().replace(/\s+/g, '');

  let titles: string[] = [];
  let captions: Array<{ style: string; text: string }> = [];
  let hashtags: string[] = [];

  const baseHashtags = [
    `#${cleanTopic}`,
    `#${cleanTopic}tips`,
    `#${cleanTopic}guide`,
    `#${cleanTopic}${year}`,
    `#contentcreation`,
    `#digitalmarketing`,
    `#socialmediatips`,
    `#growonline`,
  ];

  if (platform === 'youtube') {
    titles = [
      `Top 5 ${topic} Tips You NEED to Know in ${year}`,
      `The Ultimate Guide to Mastering ${topic}`,
      `Is ${topic} Still Worth It? My Honest Review`,
      `${topic}: From Beginner to Pro`,
      `Unlock The Secrets of ${topic} Today!`,
    ];
    hashtags = [
      ...baseHashtags,
      `#youtubetips`,
      `#videocontent`,
      `#youtubegrowth`,
      `#${cleanTopic}tutorial`,
      `#youtuber`,
    ];
    if (isPrecisionMode && trendingKeywords && trendingKeywords.length > 0) {
      const tk1 = trendingKeywords[0]?.keyword || 'HotTopic';
      titles.unshift(`${tk1}: Supercharge Your ${topic} Strategy!`);
      titles[2] = `Revolutionize Your ${topic} with ${trendingKeywords[1]?.keyword || 'NewTrend'}`;
      hashtags.push(...getRandomElements(trendingKeywords, 3).map(tk => `#${tk.keyword.replace(/\s+/g, '')}`));
    }
    titles = getRandomElements(titles, 3 + Math.floor(Math.random() * 3) ); // 3-5 titles
  } else if (platform === 'instagram') {
    captions = [
      {
        style: 'Casual',
        text: `Diving deep into ${topic} today! 🚀 What are your favorite aspects? Share your thoughts below! 👇 #FunTimes #${cleanTopic}life`,
      },
      {
        style: 'Motivational',
        text: `Conquer your ${topic} goals! 💪 Remember, every small step counts. Believe in yourself and keep pushing forward. #MotivationMonday #${cleanTopic}inspiration #GoalGetter`,
      },
      {
        style: 'Trendy',
        text: `${topic} is officially the vibe. ✨ Who else is obsessed? Drop a 🔥 if you agree! #Trendy #${cleanTopic}alert #InstaCool #MustTry`,
      },
    ];
    hashtags = [
      ...baseHashtags,
      `#instagramtips`,
      `#instasuccess`,
      `#igtips`,
      `#socialmediamarketing`,
      `#visualcontent`,
    ];

    if (isPrecisionMode && trendingKeywords && trendingKeywords.length > 0) {
      const tk1 = trendingKeywords[0]?.keyword || 'ViralNow';
      const tk2 = trendingKeywords[1]?.keyword || 'InstaGold';
      captions[0].text = `Just vibing with ${topic} and this ${tk1} trend! 🤩 How are you spicing up your content? #InstaFun #${cleanTopic}vibes`;
      captions[1].text = `Elevate your ${topic} game with the power of ${tk2}! Dreams don't work unless you do. ✨ #InstaGrowth #${cleanTopic}journey #Inspired`;
      hashtags.push(...getRandomElements(trendingKeywords, 4).map(tk => `#${tk.keyword.replace(/\s+/g, '')}`));
    }
  }

  // Ensure 10-15 hashtags
  const uniqueHashtags = Array.from(new Set(hashtags));
  const finalHashtags = getRandomElements(uniqueHashtags, Math.min(15, Math.max(10, uniqueHashtags.length)));


  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  return {
    titles: titles.length > 0 ? titles : undefined,
    captions: captions.length > 0 ? captions : undefined,
    hashtags: finalHashtags.length > 0 ? finalHashtags : undefined,
  };
}
