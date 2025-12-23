import { useState } from 'react';
import { Check, Settings, Sun, Dumbbell, Coffee, Milk, UtensilsCrossed, Apple, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { DietPreferenceForm } from './DietPreferenceForm';
import { CoinAnimation } from '@/components/wallet/CoinAnimation';

const getDietPlan = (goal: string, allergies: string) => {
  const plans: Record<string, Array<{ time: string; icon: React.ReactNode; activity: string; detail: string }>> = {
    'Glow': [
      { time: '6:00 AM', icon: <Sun className="w-4 h-4" />, activity: 'Wake up', detail: 'Start with warm lemon water' },
      { time: '6:30 AM', icon: <Dumbbell className="w-4 h-4" />, activity: 'Light Yoga', detail: '20 mins stretching' },
      { time: '8:00 AM', icon: <Coffee className="w-4 h-4" />, activity: 'Breakfast', detail: 'Oats + fruits + nuts (300 cal)' },
      { time: '11:00 AM', icon: <Milk className="w-4 h-4" />, activity: 'Mid-morning', detail: 'Green smoothie (150 cal)' },
      { time: '1:00 PM', icon: <UtensilsCrossed className="w-4 h-4" />, activity: 'Lunch', detail: 'Salad + protein bowl (450 cal)' },
      { time: '4:00 PM', icon: <Apple className="w-4 h-4" />, activity: 'Snack', detail: 'Mixed fruits + almonds' },
      { time: '7:00 PM', icon: <UtensilsCrossed className="w-4 h-4" />, activity: 'Dinner', detail: 'Grilled veggies + quinoa (400 cal)' },
      { time: '10:00 PM', icon: <Moon className="w-4 h-4" />, activity: 'Sleep', detail: 'Chamomile tea before bed' },
    ],
    'Weight Loss': [
      { time: '5:30 AM', icon: <Sun className="w-4 h-4" />, activity: 'Wake up', detail: 'Warm water + apple cider' },
      { time: '6:00 AM', icon: <Dumbbell className="w-4 h-4" />, activity: 'Cardio', detail: '45 mins running/cycling' },
      { time: '7:30 AM', icon: <Coffee className="w-4 h-4" />, activity: 'Breakfast', detail: 'Egg whites + toast (250 cal)' },
      { time: '10:30 AM', icon: <Milk className="w-4 h-4" />, activity: 'Protein shake', detail: 'Whey protein (120 cal)' },
      { time: '1:00 PM', icon: <UtensilsCrossed className="w-4 h-4" />, activity: 'Lunch', detail: 'Chicken salad + veggies (350 cal)' },
      { time: '4:00 PM', icon: <Apple className="w-4 h-4" />, activity: 'Snack', detail: 'Cucumber + hummus (100 cal)' },
      { time: '7:00 PM', icon: <UtensilsCrossed className="w-4 h-4" />, activity: 'Dinner', detail: 'Soup + grilled fish (300 cal)' },
      { time: '10:00 PM', icon: <Moon className="w-4 h-4" />, activity: 'Sleep', detail: 'No food after 8 PM' },
    ],
    'Fitness': [
      { time: '5:00 AM', icon: <Sun className="w-4 h-4" />, activity: 'Wake up', detail: 'Pre-workout snack' },
      { time: '5:30 AM', icon: <Dumbbell className="w-4 h-4" />, activity: 'Gym', detail: '60 mins strength training' },
      { time: '7:30 AM', icon: <Coffee className="w-4 h-4" />, activity: 'Breakfast', detail: 'Eggs + oats + banana (500 cal)' },
      { time: '10:00 AM', icon: <Milk className="w-4 h-4" />, activity: 'Protein', detail: 'Protein shake + nuts (300 cal)' },
      { time: '1:00 PM', icon: <UtensilsCrossed className="w-4 h-4" />, activity: 'Lunch', detail: 'Rice + chicken + veggies (600 cal)' },
      { time: '4:00 PM', icon: <Apple className="w-4 h-4" />, activity: 'Pre-workout', detail: 'Banana + peanut butter' },
      { time: '7:30 PM', icon: <UtensilsCrossed className="w-4 h-4" />, activity: 'Dinner', detail: 'Lean meat + sweet potato (550 cal)' },
      { time: '10:30 PM', icon: <Moon className="w-4 h-4" />, activity: 'Sleep', detail: 'Casein protein before bed' },
    ],
  };

  return plans[goal] || plans['Glow'];
};

export function DietPlanCard() {
  const { dietPreference, addCoins, completeDietForToday, isDietCompletedToday } = useApp();
  const [showPreferences, setShowPreferences] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);

  const isCompleted = isDietCompletedToday();

  const handleComplete = () => {
    completeDietForToday();
    addCoins(10, 'Diet Plan Completed');
    setShowCoinAnimation(true);
    toast.success('Great job! +10 coins earned 🎉');
  };

  if (!dietPreference) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <UtensilsCrossed className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Set Up Your Diet Plan</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get a personalized daily routine based on your goals
            </p>
            <Button onClick={() => setShowPreferences(true)}>
              Get Started
            </Button>
          </div>
          <DietPreferenceForm open={showPreferences} onOpenChange={setShowPreferences} />
        </CardContent>
      </Card>
    );
  }

  const dietPlan = getDietPlan(dietPreference.goal, dietPreference.allergies);

  return (
    <>
      {showCoinAnimation && (
        <CoinAnimation coins={10} onComplete={() => setShowCoinAnimation(false)} />
      )}
      
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">🥗 Today's Routine</h3>
              <p className="text-sm text-muted-foreground">
                {dietPreference.goal} Plan
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowPreferences(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {/* Timeline View */}
          <div className="space-y-1 max-h-80 overflow-y-auto pr-2">
            {dietPlan.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 py-2 relative"
              >
                {/* Timeline line */}
                {index < dietPlan.length - 1 && (
                  <div className="absolute left-[19px] top-8 w-0.5 h-full bg-border" />
                )}
                
                {/* Icon circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  isCompleted ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {item.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">
                      {item.time}
                    </span>
                  </div>
                  <p className="font-medium text-sm">{item.activity}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Completion Button */}
          <div className="mt-4 pt-4 border-t">
            {isCompleted ? (
              <div className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-lg">
                <Check className="w-5 h-5 text-primary" />
                <span className="font-medium text-primary">✅ Completed Today</span>
              </div>
            ) : (
              <Button
                onClick={handleComplete}
                className="w-full"
                size="lg"
              >
                I Completed Today's Plan (+10 🪙)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <DietPreferenceForm open={showPreferences} onOpenChange={setShowPreferences} />
    </>
  );
}
