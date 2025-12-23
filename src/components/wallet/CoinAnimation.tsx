import { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';

interface CoinAnimationProps {
  coins: number;
  onComplete?: () => void;
}

export function CoinAnimation({ coins, onComplete }: CoinAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-fade-in flex flex-col items-center gap-2">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Coins className="w-10 h-10 text-amber-900" />
          </div>
          <div className="absolute -inset-2 bg-amber-400/30 rounded-full animate-ping" />
        </div>
        <div className="bg-card px-4 py-2 rounded-full shadow-lg border border-border">
          <span className="text-xl font-bold text-amber-600">+{coins} 🪙</span>
        </div>
      </div>
    </div>
  );
}
