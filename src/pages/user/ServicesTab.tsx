import { useState } from 'react';
import { Search, Star, MapPin, Calendar, Clock, Home, Store, Phone, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import { mockSalons, mockArtists, mockServices } from '@/data/mockData';
import { Service, Booking } from '@/types';
import { toast } from 'sonner';

export function ServicesTab() {
  const { user, addBooking, bookings } = useApp();
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingType, setBookingType] = useState<'home' | 'salon'>('salon');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<{ id: string; name: string; type: 'salon' | 'artist' } | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  const filteredServices = mockServices.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleBook = () => {
    if (!selectedDate || !selectedTime || !selectedProvider) {
      toast.error('Please select all booking details');
      return;
    }

    const booking: Booking = {
      id: `booking_${Date.now()}`,
      userId: user?.id || '',
      serviceId: selectedService?.id || '',
      serviceName: selectedService?.name || '',
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      providerType: selectedProvider.type,
      date: selectedDate,
      time: selectedTime,
      type: bookingType,
      status: 'pending',
      price: selectedService?.price || 0,
      paymentStatus: 'pending'
    };

    addBooking(booking);
    setShowBooking(false);
    setSelectedService(null);
    resetBookingForm();
    toast.success('Booking request sent!');
  };

  const resetBookingForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setSelectedProvider(null);
    setBookingType('salon');
  };

  const handlePayNow = (booking: Booking) => {
    setActiveBooking(booking);
    setShowPayment(true);
  };

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const pendingBookings = bookings.filter(b => b.status !== 'completed');

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredServices.map((service) => (
          <Card 
            key={service.id}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setSelectedService(service);
              setShowBooking(true);
            }}
          >
            <div className="aspect-square relative">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-card/90">
                {service.category}
              </Badge>
            </div>
            <CardContent className="p-3">
              <h4 className="font-medium text-sm text-foreground line-clamp-1">
                {service.name}
              </h4>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{service.duration}</span>
              </div>
              <p className="font-bold text-primary mt-2">₹{service.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      <Dialog open={showBooking} onOpenChange={(open) => {
        setShowBooking(open);
        if (!open) resetBookingForm();
      }}>
        <DialogContent className="max-w-sm mx-4 max-h-[85vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle>Book {selectedService.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-2">
                {/* Service Type */}
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <RadioGroup 
                    value={bookingType} 
                    onValueChange={(v) => setBookingType(v as 'home' | 'salon')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="salon" id="salon" />
                      <Label htmlFor="salon" className="flex items-center gap-2 cursor-pointer">
                        <Store className="w-4 h-4" /> At Salon
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id="home" />
                      <Label htmlFor="home" className="flex items-center gap-2 cursor-pointer">
                        <Home className="w-4 h-4" /> At Home
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <Input
                    type="date"
                    min={getTomorrowDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label>Select Time</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Provider Selection */}
                <div className="space-y-3">
                  <Label>Choose Provider</Label>
                  <Tabs defaultValue="salons">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="salons">Nearby Salons</TabsTrigger>
                      <TabsTrigger value="artists">Artists</TabsTrigger>
                    </TabsList>
                    <TabsContent value="salons" className="space-y-2 mt-3">
                      {mockSalons.map((salon) => (
                        <Card 
                          key={salon.id}
                          className={`cursor-pointer transition-all ${
                            selectedProvider?.id === salon.id 
                              ? 'border-primary bg-accent' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedProvider({ 
                            id: salon.id, 
                            name: salon.name, 
                            type: 'salon' 
                          })}
                        >
                          <CardContent className="p-3 flex items-center gap-3">
                            <img
                              src={salon.images[0]}
                              alt={salon.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{salon.name}</h4>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{salon.distance}</span>
                                <Star className="w-3 h-3 fill-primary text-primary" />
                                <span>{salon.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                    <TabsContent value="artists" className="space-y-2 mt-3">
                      {mockArtists.filter(a => a.isIndependent).map((artist) => (
                        <Card 
                          key={artist.id}
                          className={`cursor-pointer transition-all ${
                            selectedProvider?.id === artist.id 
                              ? 'border-primary bg-accent' 
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedProvider({ 
                            id: artist.id, 
                            name: artist.name, 
                            type: 'artist' 
                          })}
                        >
                          <CardContent className="p-3 flex items-center gap-3">
                            <img
                              src={artist.photo}
                              alt={artist.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm">{artist.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {artist.specialties.join(', ')}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                <span>{artist.distance}</span>
                                <Star className="w-3 h-3 fill-primary text-primary" />
                                <span>{artist.rating}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between mb-4">
                    <span>Service Price</span>
                    <span className="font-bold">₹{selectedService.price}</span>
                  </div>
                  <Button className="w-full" onClick={handleBook}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* My Bookings */}
      {bookings.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-foreground mb-3">My Bookings</h3>
          <div className="space-y-3">
            {pendingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{booking.serviceName}</span>
                    <Badge variant={
                      booking.status === 'confirmed' ? 'default' :
                      booking.status === 'pending' ? 'secondary' : 'outline'
                    }>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{booking.providerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.date} at {booking.time} • {booking.type === 'home' ? 'At Home' : 'At Salon'}
                  </p>
                  {booking.status === 'confirmed' && booking.paymentStatus === 'pending' && (
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={() => handlePayNow(booking)}
                    >
                      Pay ₹{booking.price}
                    </Button>
                  )}
                  {booking.status === 'completed' && (
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">
                        <Phone className="w-3 h-3 mr-1" /> Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="w-3 h-3 mr-1" /> Rate
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
          </DialogHeader>
          {activeBooking && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{activeBooking.serviceName}</p>
                <p className="text-sm text-muted-foreground">{activeBooking.providerName}</p>
                <p className="text-xl font-bold text-primary mt-2">₹{activeBooking.price}</p>
              </div>

              <div className="p-4 bg-accent rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Scan to pay</p>
                <div className="w-32 h-32 bg-muted mx-auto rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">QR Code</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">upi://pay?pa=demo@upi</p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => {
                  setShowPayment(false);
                  toast.success('Payment recorded!');
                }}
              >
                I've Made the Payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
