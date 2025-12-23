import { Coins, History, Gift, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const { wallet, walletHistory } = useApp();

  const getActionIcon = (actionType: string) => {
    if (actionType.includes('Diet')) return '🥗';
    if (actionType.includes('Face')) return '📸';
    if (actionType.includes('Try-On')) return '💄';
    if (actionType.includes('Booking')) return '💇';
    if (actionType.includes('Feedback')) return '⭐';
    if (actionType.includes('Collect')) return '🎁';
    if (actionType.includes('Login')) return '👋';
    return '🪙';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            My Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Coin Balance */}
          <div className="text-center p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/20 rounded-2xl border border-amber-500/30">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Coins className="w-8 h-8 text-amber-900" />
            </div>
            <p className="text-4xl font-bold text-amber-600 mt-4">
              {wallet?.totalCoins || 0}
            </p>
            <p className="text-muted-foreground">Total Coins</p>
          </div>

          {/* Earning Rules */}
          <div className="p-4 bg-accent/50 rounded-xl">
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              How to Earn
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Daily Login</span>
                <span className="font-medium text-amber-600">+5 🪙</span>
              </div>
              <div className="flex justify-between">
                <span>Follow Diet Plan</span>
                <span className="font-medium text-amber-600">+10 🪙</span>
              </div>
              <div className="flex justify-between">
                <span>Update Face Image</span>
                <span className="font-medium text-amber-600">+15 🪙</span>
              </div>
              <div className="flex justify-between">
                <span>Try Product (Try-On)</span>
                <span className="font-medium text-amber-600">+5 🪙</span>
              </div>
              <div className="flex justify-between">
                <span>Complete Booking</span>
                <span className="font-medium text-amber-600">+20 🪙</span>
              </div>
              <div className="flex justify-between">
                <span>Give Feedback</span>
                <span className="font-medium text-amber-600">+5 🪙</span>
              </div>
            </div>
          </div>

          {/* History */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <History className="w-4 h-4" />
              Coin History
            </h4>
            <ScrollArea className="h-48">
              {walletHistory.length > 0 ? (
                <div className="space-y-2">
                  {walletHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getActionIcon(entry.actionType)}</span>
                        <div>
                          <p className="text-sm font-medium">{entry.actionType}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(entry.dateTime), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-amber-600">
                        +{entry.coinsEarned}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No coins earned yet</p>
                  <p className="text-sm">Start earning by completing actions!</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
