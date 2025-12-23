import { useState, useRef } from 'react';
import { Wand2, Camera, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { CoinAnimation } from '@/components/wallet/CoinAnimation';

export function TryOnBox() {
  const { addCoins } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);

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

  const handleTryOn = async () => {
    if (!photo) {
      toast.error('Please capture a photo first');
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    addCoins(5, 'Product Try-On');
    setShowCoinAnimation(true);
    setIsProcessing(false);
    toast.success('Try-on complete! +5 coins');
    
    setTimeout(() => {
      setShowModal(false);
      setPhoto(null);
    }, 2500);
  };

  return (
    <>
      {showCoinAnimation && (
        <CoinAnimation coins={5} onComplete={() => setShowCoinAnimation(false)} />
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Wand2 className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold">Virtual Try-On</h3>
              <p className="text-sm text-muted-foreground">
                Try products with camera & earn coins
              </p>
            </div>

            <Button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Try Now
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Virtual Try-On
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl flex items-center justify-center overflow-hidden">
              {photo ? (
                <div className="relative w-full h-full">
                  <img
                    src={photo}
                    alt="Try-on"
                    className="w-full h-full object-cover"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="mt-2 text-sm">Applying virtual makeup...</p>
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
                    disabled={isProcessing}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button
                    onClick={handleTryOn}
                    className="flex-1"
                    disabled={isProcessing}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Apply (+5 🪙)'}
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
    </>
  );
}
