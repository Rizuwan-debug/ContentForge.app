
import { Sparkles } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { UserNav } from '@/components/auth/UserNav'; // Added UserNav

export function Header() {
  return (
    <header className="mb-8 text-center relative">
      <div className="absolute top-0 right-0 mt-0 mr-0 sm:mt-2 sm:mr-2 z-50 flex items-center space-x-2">
        <UserNav /> {/* Added UserNav */}
        <ModeToggle />
      </div>
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
