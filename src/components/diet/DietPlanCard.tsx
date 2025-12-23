import { useState } from 'react';
import { Check, Utensils, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DietPreferenceForm } from './DietPreferenceForm';
import { CoinAnimation } from '@/components/wallet/CoinAnimation';

const mealTimes = [
  { id: 'morning', label: 'Morning', time: '7:00 AM', emoji: '🌅' },
  { id: 'afternoon', label: 'Afternoon', time: '12:30 PM', emoji: '☀️' },
  { id: 'evening', label: 'Evening', time: '6:00 PM', emoji: '🌆' },
  { id: 'night', label: 'Night', time: '9:00 PM', emoji: '🌙' },
];

const getMockMeal = (time: string, preference: string) => {
  const meals: Record<string, Record<string, string>> = {
    morning: {
      Vegetarian: 'Oatmeal with fruits & nuts',
      Vegan: 'Smoothie bowl with granola',
      'Non-Vegetarian': 'Eggs with whole wheat toast',
      default: 'Healthy breakfast bowl',
    },
    afternoon: {
      Vegetarian: 'Paneer curry with rice & salad',
      Vegan: 'Quinoa bowl with roasted veggies',
      'Non-Vegetarian': 'Grilled chicken with brown rice',
      default: 'Balanced lunch plate',
    },
    evening: {
      Vegetarian: 'Vegetable soup with multigrain bread',
      Vegan: 'Lentil soup with crackers',
      'Non-Vegetarian': 'Fish fry with sautéed greens',
      default: 'Light evening meal',
    },
    night: {
      Vegetarian: 'Warm milk with turmeric',
      Vegan: 'Chamomile tea with almonds',
      'Non-Vegetarian': 'Light protein shake',
      default: 'Light night snack',
    },
  };

  return meals[time]?.[preference] || meals[time]?.default || 'Healthy meal';
};

export function DietPlanCard() {
  const { dietPreference, addCoins, completeDietForToday, isDietCompletedToday } = useApp();
  const [checkedMeals, setCheckedMeals] = useState<Set<string>>(new Set());
  const [showPreferences, setShowPreferences] = useState(false);
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const isCompleted = isDietCompletedToday();

  const handleMealCheck = (mealId: string) => {
    if (isCompleted) return;
    
    setCheckedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(mealId)) {
        next.delete(mealId);
      } else {
        next.add(mealId);
      }
      return next;
    });
  };

  const handleMarkCompleted = () => {
    if (checkedMeals.size < 4) {
      toast.error('Please check all meals to complete');
      return;
    }

    completeDietForToday();
    addCoins(10, 'Diet Plan Completed');
    setShowCoinAnimation(true);
    toast.success('Great job following your diet! +10 coins');
  };

  if (!dietPreference) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="text-center py-6">
            <Utensils className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-2">Set Up Your Diet Plan</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure your diet preferences to get personalized meal suggestions
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

  return (
    <>
      {showCoinAnimation && (
        <CoinAnimation coins={10} onComplete={() => setShowCoinAnimation(false)} />
      )}
      
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                🥗 Today's Diet Plan
              </h3>
              <p className="text-sm text-muted-foreground">
                {dietPreference.goal} • {dietPreference.foodPreference}
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

          <div className="space-y-3">
            {mealTimes.map((meal) => (
              <div
                key={meal.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isCompleted || checkedMeals.has(meal.id)
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-muted/50 border-transparent'
                }`}
              >
                <Checkbox
                  checked={isCompleted || checkedMeals.has(meal.id)}
                  onCheckedChange={() => handleMealCheck(meal.id)}
                  disabled={isCompleted}
                />
                <span className="text-xl">{meal.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium text-sm">{meal.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {getMockMeal(meal.id, dietPreference.foodPreference)}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{meal.time}</span>
              </div>
            ))}
          </div>

          {isCompleted ? (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
              <Check className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium text-primary">Completed for today!</p>
              <p className="text-xs text-muted-foreground">+10 coins earned</p>
            </div>
          ) : (
            <Button
              onClick={handleMarkCompleted}
              className="w-full mt-4"
              disabled={checkedMeals.size < 4}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark Today Completed (+10 🪙)
            </Button>
          )}
        </CardContent>
      </Card>
      
      <DietPreferenceForm open={showPreferences} onOpenChange={setShowPreferences} />
    </>
  );
}
