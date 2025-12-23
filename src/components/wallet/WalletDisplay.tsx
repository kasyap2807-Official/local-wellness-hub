import { Coins } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface WalletDisplayProps {
  onClick?: () => void;
}

export function WalletDisplay({ onClick }: WalletDisplayProps) {
  const { wallet } = useApp();

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-full hover:bg-amber-500/20 transition-colors"
    >
      <Coins className="w-4 h-4 text-amber-500" />
      <span className="font-semibold text-amber-600">{wallet?.totalCoins || 0}</span>
    </button>
  );
}
