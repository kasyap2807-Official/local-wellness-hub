import { MapPin, ChevronDown, RefreshCw, User, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WalletDisplay } from '@/components/wallet/WalletDisplay';
import { WalletModal } from '@/components/wallet/WalletModal';

export function Header() {
  const { location, locationLoading, locationError, fetchLocation, user, logout, checkDailyLogin } = useApp();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    if (!location && !locationLoading) {
      fetchLocation();
    }
  }, []);

  // Check daily login for coins
  useEffect(() => {
    if (user) {
      checkDailyLogin();
    }
  }, [user]);

  const getLocationDisplay = () => {
    if (locationLoading) return 'Getting location...';
    if (locationError) return 'Location unavailable';
    if (!location) return 'Enable location';
    
    const road = location.road || '';
    const suburb = location.suburb || '';
    return `${road}${road && suburb ? ', ' : ''}${suburb}`.trim() || 'Unknown location';
  };

  const getCityDisplay = () => {
    if (!location?.city) return '';
    return location.city;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
          {/* Avatar */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 mr-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profile?.photo} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Location Section */}
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-start gap-2 text-left flex-1 min-w-0"
          >
            <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm text-foreground truncate">
                  {getLocationDisplay()}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
              {getCityDisplay() && (
                <span className="text-xs text-muted-foreground">
                  {getCityDisplay()}
                </span>
              )}
            </div>
          </button>

          {/* Wallet Display */}
          {user && <WalletDisplay onClick={() => setShowWalletModal(true)} />}
        </div>
      </header>

      {/* Location Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Your Location
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {location ? (
              <div className="space-y-3">
                <div className="p-4 bg-accent rounded-lg">
                  <p className="font-medium text-foreground">
                    {location.road || 'Road not available'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[location.suburb, location.city, location.state]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  {location.postcode && (
                    <p className="text-sm text-muted-foreground">
                      PIN: {location.postcode}
                    </p>
                  )}
                </div>
                
                {location.displayName && (
                  <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                    <p className="font-medium mb-1">Full Address:</p>
                    <p>{location.displayName}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  <p>Coordinates: {location.lat.toFixed(6)}, {location.lon.toFixed(6)}</p>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                {locationLoading ? 'Fetching location...' : 'Location not available'}
              </p>
            )}

            <Button
              onClick={() => {
                fetchLocation();
              }}
              disabled={locationLoading}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${locationLoading ? 'animate-spin' : ''}`} />
              {locationLoading ? 'Updating...' : 'Refresh Location'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Wallet Modal */}
      <WalletModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </>
  );
}
