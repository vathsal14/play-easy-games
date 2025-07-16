import { useEffect, useRef } from 'react';

interface KeyGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeyGame({ isOpen, onClose }: KeyGameProps) {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const scriptAdded = useRef(false);

  useEffect(() => {
    if (!isOpen || !gameContainerRef.current || scriptAdded.current) return;

    // Create iframe for the game
    const iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.src = '/key-game/key.html';
    
    gameContainerRef.current.appendChild(iframe);
    scriptAdded.current = true;

    return () => {
      if (gameContainerRef.current && iframe.parentNode === gameContainerRef.current) {
        gameContainerRef.current.removeChild(iframe);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="relative w-full max-w-4xl h-[80vh] bg-gray-900 rounded-xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Close game"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div ref={gameContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
