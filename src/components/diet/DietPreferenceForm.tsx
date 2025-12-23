import { useState } from 'react';
import { Utensils, Moon, Sun, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { DietPreference } from '@/types';

interface DietPreferenceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const goals = [
  'Weight Loss',
  'Weight Gain',
  'Maintain Weight',
  'Build Muscle',
  'Improve Skin Health',
  'General Wellness',
];

const foodPreferences = [
  'Vegetarian',
  'Vegan',
  'Non-Vegetarian',
  'Eggetarian',
  'Pescatarian',
  'No Preference',
];

export function DietPreferenceForm({ open, onOpenChange }: DietPreferenceFormProps) {
  const { setDietPreference, dietPreference } = useApp();
  const [formData, setFormData] = useState<DietPreference>(
    dietPreference || {
      goal: '',
      foodPreference: '',
      allergies: '',
      wakeUpTime: '06:00',
      sleepHours: '8',
    }
  );

  const handleSubmit = () => {
    if (!formData.goal || !formData.foodPreference) {
      toast.error('Please fill in required fields');
      return;
    }

    setDietPreference(formData);
    toast.success('Diet preferences saved!');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            Diet Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Goal *
            </Label>
            <Select
              value={formData.goal}
              onValueChange={(v) => setFormData({ ...formData, goal: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                {goals.map((goal) => (
                  <SelectItem key={goal} value={goal}>
                    {goal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Food Preference *</Label>
            <Select
              value={formData.foodPreference}
              onValueChange={(v) => setFormData({ ...formData, foodPreference: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                {foodPreferences.map((pref) => (
                  <SelectItem key={pref} value={pref}>
                    {pref}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Allergies / Restrictions</Label>
            <Textarea
              placeholder="e.g., Nuts, Dairy, Gluten..."
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Wake-up Time
              </Label>
              <Input
                type="time"
                value={formData.wakeUpTime}
                onChange={(e) => setFormData({ ...formData, wakeUpTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Sleep Hours
              </Label>
              <Input
                type="number"
                min="4"
                max="12"
                value={formData.sleepHours}
                onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
