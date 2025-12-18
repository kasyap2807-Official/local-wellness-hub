import { useState, useRef } from 'react';
import { Camera, Sparkles, ChevronRight, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import { mockAIAnalysis, faceTypes, skinTypes, tones, undertones } from '@/data/mockData';
import { toast } from 'sonner';

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { updateUserProfile, completeProfile } = useApp();
  const [step, setStep] = useState(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    allergies: ''
  });
  const [aiResult, setAiResult] = useState({
    faceType: '',
    skinType: '',
    faceTone: '',
    skinTone: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.error('Please capture or upload a photo first');
      return;
    }

    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAiResult(mockAIAnalysis);
    setAnalyzing(false);
    toast.success('Analysis complete!');
    setStep(3);
  };

  const handleComplete = () => {
    updateUserProfile({
      photo: photo || undefined,
      height: formData.height,
      weight: formData.weight,
      allergies: formData.allergies,
      ...aiResult
    });
    completeProfile();
    toast.success('Profile setup complete!');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-sm mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Photo */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground font-serif">Profile Photo</h2>
              <p className="text-muted-foreground mt-2">Take a clear photo for AI skin analysis</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-48 h-48 rounded-full bg-muted border-4 border-dashed border-primary/30 flex items-center justify-center overflow-hidden">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-16 h-16 text-muted-foreground" />
                )}
              </div>

              <div className="flex gap-3">
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
                <Button
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Camera
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload
                </Button>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg" 
              onClick={() => setStep(2)}
              disabled={!photo}
            >
              Continue <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground font-serif">Basic Information</h2>
              <p className="text-muted-foreground mt-2">Help us personalize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input
                    type="number"
                    placeholder="165"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    placeholder="60"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Allergies / Skin Conditions</Label>
                <Textarea
                  placeholder="e.g., Sensitive to fragrances, eczema..."
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            <Card className="bg-accent/50 border-primary/20">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">AI Skin Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll analyze your photo to determine your skin type
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleAnalyze} 
                className="flex-1"
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: AI Results */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground font-serif">AI Analysis Results</h2>
              <p className="text-muted-foreground mt-2">Review and edit if needed</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Face Type
                  <Edit2 className="w-3 h-3 text-muted-foreground" />
                </Label>
                <Select
                  value={aiResult.faceType}
                  onValueChange={(v) => setAiResult({ ...aiResult, faceType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {faceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Skin Type
                  <Edit2 className="w-3 h-3 text-muted-foreground" />
                </Label>
                <Select
                  value={aiResult.skinType}
                  onValueChange={(v) => setAiResult({ ...aiResult, skinType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {skinTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Face Tone (Undertone)
                  <Edit2 className="w-3 h-3 text-muted-foreground" />
                </Label>
                <Select
                  value={aiResult.faceTone}
                  onValueChange={(v) => setAiResult({ ...aiResult, faceTone: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {undertones.map((tone) => (
                      <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  Skin Tone
                  <Edit2 className="w-3 h-3 text-muted-foreground" />
                </Label>
                <Select
                  value={aiResult.skinTone}
                  onValueChange={(v) => setAiResult({ ...aiResult, skinTone: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((tone) => (
                      <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Re-analyze
              </Button>
              <Button onClick={handleComplete} className="flex-1">
                Complete Setup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
