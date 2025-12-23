import { useState, useRef } from 'react';
import { Camera, TrendingUp, History, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CoinAnimation } from '@/components/wallet/CoinAnimation';

export function FaceScoreCard() {
  const { faceScoreHistory, addFaceScore, addCoins, updateUserProfile, user } = useApp();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);

  const latestScore = faceScoreHistory[0]?.score || 0;

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!photo) {
      toast.error('Please capture a photo first');
      return;
    }

    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Generate random score between 70-95
    const score = Math.floor(Math.random() * 26) + 70;

    updateUserProfile({ photo });
    addFaceScore(score, 15);
    addCoins(15, 'Face Image Updated');
    setShowCoinAnimation(true);
    setIsAnalyzing(false);
    toast.success(`Analysis complete! Score: ${score}/100 • +15 coins`);

    setTimeout(() => {
      setShowUpdateModal(false);
      setPhoto(null);
    }, 2500);
  };

  return (
    <>
      {showCoinAnimation && (
        <CoinAnimation coins={15} onComplete={() => setShowCoinAnimation(false)} />
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center overflow-hidden">
                {user?.profile?.photo ? (
                  <img
                    src={user.profile.photo}
                    alt="Face"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-card border-2 border-background rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">{latestScore}</span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                Face Score
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-sm text-muted-foreground">
                {latestScore > 0
                  ? `Your score: ${latestScore}/100`
                  : 'Update to get your score'}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowHistoryModal(true)}
              >
                <History className="w-4 h-4" />
              </Button>
              <Button onClick={() => setShowUpdateModal(true)}>
                <Camera className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              Update Face Image
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl flex items-center justify-center overflow-hidden">
              {photo ? (
                <div className="relative w-full h-full">
                  <img
                    src={photo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="mt-2 text-sm">Analyzing face...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6">
                  <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Capture your photo</p>
                </div>
              )}
            </div>

            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={handleCapture}
            />

            <div className="flex gap-3">
              {photo ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setPhoto(null)}
                    className="flex-1"
                    disabled={isAnalyzing}
                  >
                    Retake
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    className="flex-1"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze (+15 🪙)'}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => cameraRef.current?.click()}
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Open Camera
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Face Score History
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-64">
            {faceScoreHistory.length > 0 ? (
              <div className="space-y-3">
                {faceScoreHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">Score: {entry.score}/100</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.date), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    {entry.coinsEarned > 0 && (
                      <span className="text-sm font-medium text-amber-600">
                        +{entry.coinsEarned} 🪙
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No history yet</p>
                <p className="text-sm">Update your face image to start tracking</p>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
