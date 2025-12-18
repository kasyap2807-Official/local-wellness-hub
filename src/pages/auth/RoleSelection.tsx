import { Sparkles, Users, Scissors, Stethoscope, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface RoleSelectionProps {
  onRoleSelected: () => void;
}

const roles: { value: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: 'user',
    label: 'Customer',
    description: 'Book services, order products & consult doctors',
    icon: Users
  },
  {
    value: 'salon_owner',
    label: 'Salon Owner',
    description: 'Manage your salon, artists & orders',
    icon: Store
  },
  {
    value: 'artist',
    label: 'Independent Artist',
    description: 'Offer your beauty services',
    icon: Scissors
  },
  {
    value: 'doctor',
    label: 'Doctor',
    description: 'Provide consultations & prescriptions',
    icon: Stethoscope
  }
];

export function RoleSelection({ onRoleSelected }: RoleSelectionProps) {
  const { setUserRole, user } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      setUserRole(selectedRole);
      onRoleSelected();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-foreground rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground">How would you like to use GlowUp?</p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3 w-full mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.value;
            
            return (
              <Card
                key={role.value}
                className={cn(
                  'cursor-pointer transition-all duration-200',
                  isSelected 
                    ? 'border-primary bg-accent shadow-md' 
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                )}
                onClick={() => setSelectedRole(role.value)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{role.label}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 shrink-0 transition-colors',
                    isSelected 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground'
                  )}>
                    {isSelected && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue} 
          className="w-full" 
          size="lg"
          disabled={!selectedRole}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
