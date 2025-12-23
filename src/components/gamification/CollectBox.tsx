import { useState } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { CoinAnimation } from '@/components/wallet/CoinAnimation';

export function CollectBox() {
  const { hasClaimedCollectBoxToday, claimCollectBox, addCoins } = useApp();
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isOpening, setIsOpening] = useState(false);

  const isClaimed = hasClaimedCollectBoxToday();

  const handleCollect = async () => {
    if (isClaimed) return;

    setIsOpening(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Random coins between 3 and 10
    const coins = Math.floor(Math.random() * 8) + 3;
    setEarnedCoins(coins);
    
    claimCollectBox(coins);
    addCoins(coins, 'Daily Collect Box');
    setShowCoinAnimation(true);
    setIsOpening(false);
    toast.success(`🎉 You got ${coins} coins!`);
  };

  return (
    <>
      {showCoinAnimation && (
        <CoinAnimation coins={earnedCoins} onComplete={() => setShowCoinAnimation(false)} />
      )}

      <Card className={`overflow-hidden ${isOpening ? 'animate-pulse' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                isClaimed
                  ? 'bg-muted'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg'
              }`}
            >
              {isClaimed ? (
                <Gift className="w-8 h-8 text-muted-foreground" />
              ) : (
                <div className="relative">
                  <Gift className="w-8 h-8 text-white" />
                  <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold">Daily Collect Box</h3>
              <p className="text-sm text-muted-foreground">
                {isClaimed
                  ? 'Come back tomorrow for more!'
                  : 'Tap to collect random coins (3-10)'}
              </p>
            </div>

            <Button
              onClick={handleCollect}
              disabled={isClaimed || isOpening}
              variant={isClaimed ? 'outline' : 'default'}
              className={!isClaimed ? 'bg-gradient-to-r from-purple-500 to-pink-500' : ''}
            >
              {isOpening ? '...' : isClaimed ? 'Claimed' : 'Open'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
