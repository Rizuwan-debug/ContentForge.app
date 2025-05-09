
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { DonationModal } from './DonationModal'; // To be created

export function DonationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="mt-6 text-center">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 text-black font-bold rounded-lg cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"
          style={{ backgroundColor: 'gold' }} // Using inline style for 'gold' as requested by brief
        >
          Support ContentForge <Heart className="ml-2 h-5 w-5 fill-red-500 text-red-500" />
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Every donation helps keep <strong>ContentForge</strong> alive and growing. Thank you!
        </p>
      </div>
      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
