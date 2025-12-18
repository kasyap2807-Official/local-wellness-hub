import { ShoppingBag, Scissors, Stethoscope, User, Home, Calendar, Package, Settings } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { user, cart } = useApp();

  const getUserNavItems = (): NavItem[] => {
    switch (user?.role) {
      case 'user':
        return [
          { icon: ShoppingBag, label: 'Products', value: 'products' },
          { icon: Scissors, label: 'Services', value: 'services' },
          { icon: Stethoscope, label: 'Doctor', value: 'doctor' },
          { icon: User, label: 'Profile', value: 'profile' },
        ];
      case 'salon_owner':
        return [
          { icon: Home, label: 'Dashboard', value: 'dashboard' },
          { icon: Calendar, label: 'Bookings', value: 'bookings' },
          { icon: Package, label: 'Orders', value: 'orders' },
          { icon: Settings, label: 'Manage', value: 'manage' },
        ];
      case 'artist':
        return [
          { icon: Home, label: 'Dashboard', value: 'dashboard' },
          { icon: Calendar, label: 'Bookings', value: 'bookings' },
          { icon: Scissors, label: 'Services', value: 'services' },
          { icon: User, label: 'Profile', value: 'profile' },
        ];
      case 'doctor':
        return [
          { icon: Home, label: 'Dashboard', value: 'dashboard' },
          { icon: Calendar, label: 'Appointments', value: 'appointments' },
          { icon: User, label: 'Profile', value: 'profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getUserNavItems();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.value;
          const showBadge = item.value === 'products' && cartCount > 0;

          return (
            <button
              key={item.value}
              onClick={() => onTabChange(item.value)}
              className={cn(
                'flex flex-col items-center py-3 px-4 relative transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-6 h-6', isActive && 'scale-110 transition-transform')} />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-xs mt-1 font-medium',
                isActive && 'text-primary'
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
