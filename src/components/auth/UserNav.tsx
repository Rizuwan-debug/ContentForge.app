
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { LogOut, UserCircle2, LogIn } from 'lucide-react';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export function UserNav() {
  const { user, loading, firebaseAuth } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth);
      toast({ title: "Signed Out", description: "You have been signed out." });
      router.push('/'); // Or to /auth if preferred
    } catch (error) {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
      console.error("Sign out error:", error);
    }
  };

  if (loading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href="/auth">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* Placeholder for user image if available in future */}
            {/* <AvatarImage src={user.photoURL || ""} alt={user.displayName || user.email || "User"} /> */}
            <AvatarFallback>
              <UserCircle2 className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Add other items like "Profile", "Settings" here if needed */}
        {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}
        {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
