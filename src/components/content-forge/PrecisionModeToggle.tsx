import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock, Sparkles } from 'lucide-react';

interface PrecisionModeToggleProps {
  isPrecisionMode: boolean;
  onPrecisionModeChange: (checked: boolean) => void;
  isPremiumUser: boolean;
}

export function PrecisionModeToggle({ isPrecisionMode, onPrecisionModeChange, isPremiumUser }: PrecisionModeToggleProps) {
  return (
    <div className="flex items-center space-x-3 p-4 border rounded-lg bg-card shadow-sm mb-6">
      <Sparkles className="h-6 w-6 text-primary" />
      <Label htmlFor="precision-mode" className="flex-grow text-base font-medium text-foreground">
        Precision Mode
        <p className="text-xs text-muted-foreground">Enhanced AI-powered generation for Pro users.</p>
      </Label>
      {!isPremiumUser && <Lock className="h-4 w-4 text-amber-500" />}
      <Switch
        id="precision-mode"
        checked={isPrecisionMode}
        onCheckedChange={onPrecisionModeChange}
        aria-label="Toggle Precision Mode"
      />
    </div>
  );
}
