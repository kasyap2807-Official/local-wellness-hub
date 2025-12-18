import { useState } from 'react';
import { Calendar, TrendingUp, Users, Check, X, Plus, Edit2, Trash2, Scissors } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useApp } from '@/context/AppContext';
import { mockArtists, mockServices } from '@/data/mockData';
import { toast } from 'sonner';

interface ArtistDashboardProps {
  onLogout: () => void;
}

export function ArtistDashboard({ onLogout }: ArtistDashboardProps) {
  const { bookings, updateBookingStatus, logout, user } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  const artist = mockArtists[1]; // Mock artist for demo (independent one)
  
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedBookings = bookings.filter(b => b.status === 'completed');

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
    toast.success('Booking accepted!');
  };

  const handleRejectBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
    toast.success('Booking rejected');
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-4 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={artist.photo} />
                    <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                      {artist.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{user?.name || artist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {artist.specialties.join(' • ')}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary">⭐ {artist.rating}</Badge>
                      <Badge variant="outline">{artist.reviews} reviews</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingBookings.length}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{completedBookings.length}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Services Count */}
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{artist.services.length} Services</p>
                    <p className="text-xs text-muted-foreground">Offered</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setActiveTab('services')}>
                  Manage
                </Button>
              </CardContent>
            </Card>

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        );

      case 'bookings':
        return (
          <div className="p-4 space-y-4">
            <h2 className="font-bold text-lg">My Bookings</h2>
            
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No bookings yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{booking.serviceName}</span>
                        <Badge variant={
                          booking.status === 'confirmed' ? 'default' :
                          booking.status === 'pending' ? 'secondary' :
                          booking.status === 'completed' ? 'outline' : 'destructive'
                        }>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {booking.date} at {booking.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.type === 'home' ? '🏠 At Client Home' : '🏪 At Salon'}
                      </p>
                      <p className="font-semibold text-primary mt-1">₹{booking.price}</p>
                      
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptBooking(booking.id)}
                          >
                            <Check className="w-3 h-3 mr-1" /> Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRejectBooking(booking.id)}
                          >
                            <X className="w-3 h-3 mr-1" /> Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'services':
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">My Services</h2>
              <Button size="sm">
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {artist.services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4 flex gap-4">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{service.name}</h4>
                      <p className="text-xs text-muted-foreground">{service.duration}</p>
                      <p className="font-bold text-primary mt-1">₹{service.price}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="icon" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="p-4 space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src={artist.photo} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {artist.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-bold text-xl mt-4">{user?.name || artist.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                {artist.specialties.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">⭐ {artist.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reviews</span>
                  <span className="font-semibold">{artist.reviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Services</span>
                  <span className="font-semibold">{artist.services.length}</span>
                </div>
              </CardContent>
            </Card>

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MobileLayout>
  );
}
