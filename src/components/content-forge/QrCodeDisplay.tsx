import Image from 'next/image';

interface QrCodeDisplayProps {
  data: string;
  size?: number;
  altText: string;
  className?: string;
}

export function QrCodeDisplay({ data, size = 150, altText, className }: QrCodeDisplayProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

  return (
    <div className={cn('flex justify-center items-center p-2 bg-white rounded-md shadow-md', className)}>
      <Image
        src={qrUrl}
        alt={altText}
        width={size}
        height={size}
        className="rounded"
        unoptimized // For external URLs that might not be whitelisted for optimization or if optimization isn't desired
      />
    </div>
  );
}

// Helper cn function if not globally available in this context
// (Usually imported from '@/lib/utils')
function cn(...inputs: Array<string | undefined | null | false>): string {
  return inputs.filter(Boolean).join(' ');
}
