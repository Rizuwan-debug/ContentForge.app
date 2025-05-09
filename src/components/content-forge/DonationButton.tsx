
"use client";

export function DonationButton() {
  const upiLink = "upi://pay?pa=6002168251@fam&pn=ContentForge&cu=INR";

  return (
    <div className="mt-6 text-center">
      <a href={upiLink} target="_blank" rel="noopener noreferrer" className="inline-block">
        <button
          className="px-5 py-2.5 text-black font-bold rounded-lg cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center shadow-md"
          style={{ backgroundColor: 'gold' }} // Using inline style for 'gold' as requested
        >
          Support Me via UPI <span role="img" aria-label="sparkling heart" className="ml-2">💖</span>
        </button>
      </a>
      <p className="mt-2 text-sm text-muted-foreground">
        Every donation helps keep <strong>ContentForge</strong> alive and growing. Thank you!
      </p>
    </div>
  );
}
