import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="mb-8 text-center">
      <div className="flex items-center justify-center mb-2">
        <Sparkles className="h-10 w-10 text-primary mr-3" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          ContentForge
        </h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Craft compelling content for YouTube & Instagram effortlessly.
      </p>
    </header>
  );
}
