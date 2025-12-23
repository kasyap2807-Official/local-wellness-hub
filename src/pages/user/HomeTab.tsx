import { DietPlanCard } from '@/components/diet/DietPlanCard';
import { CollectBox } from '@/components/gamification/CollectBox';
import { TryOnBox } from '@/components/gamification/TryOnBox';
import { FaceScoreCard } from '@/components/face/FaceScoreCard';
import { useApp } from '@/context/AppContext';

export function HomeTab() {
  const { user } = useApp();

  return (
    <div className="p-4 space-y-4">
      <div className="mb-2">
        <h1 className="text-xl font-bold text-foreground">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Track your wellness journey
        </p>
      </div>

      <FaceScoreCard />
      <DietPlanCard />
      <CollectBox />
      <TryOnBox />
    </div>
  );
}
