import { useState } from 'react';
import { Calendar, Package, TrendingUp, Users, Check, X, Eye, Truck, Plus, Edit2, Trash2 } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { mockSalons, mockServices, mockProducts, mockArtists } from '@/data/mockData';
import { toast } from 'sonner';

interface SalonOwnerDashboardProps {
  onLogout: () => void;
}

export function SalonOwnerDashboard({ onLogout }: SalonOwnerDashboardProps) {
  const { bookings, orders, updateBookingStatus, updateOrderStatus, logout } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOrderDetail, setShowOrderDetail] = useState<string | null>(null);
  const [trackingLink, setTrackingLink] = useState('');

  const salon = mockSalons[0]; // Mock salon for demo
  
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const pendingOrders = orders.filter(o => o.status === 'ordered' || o.status === 'payment_completed');

  const handleAcceptBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'confirmed');
    toast.success('Booking accepted!');
  };

  const handleRejectBooking = (bookingId: string) => {
    updateBookingStatus(bookingId, 'cancelled');
    toast.success('Booking rejected');
  };

  const handleAcceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'payment_completed');
    toast.success('Order accepted!');
  };

  const handleAddTracking = (orderId: string) => {
    // In real app, this would update the order with tracking link
    updateOrderStatus(orderId, 'started');
    toast.success('Tracking link added!');
    setShowOrderDetail(null);
    setTrackingLink('');
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered');
    toast.success('Order marked as delivered!');
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
                      <p className="text-xs text-muted-foreground">Pending Bookings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingOrders.length}</p>
                      <p className="text-xs text-muted-foreground">Pending Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Salon Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={salon.images[0]}
                    alt={salon.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{salon.name}</h3>
                    <p className="text-sm text-muted-foreground">{salon.address}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="secondary">{salon.services.length} Services</Badge>
                      <Badge variant="secondary">{salon.products.length} Products</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Add Service</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Add Product</span>
              </Button>
            </div>

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        );

      case 'bookings':
        return (
          <div className="p-4 space-y-4">
            <h2 className="font-bold text-lg">Bookings</h2>
            
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
                        Type: {booking.type === 'home' ? 'At Home' : 'At Salon'}
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

      case 'orders':
        return (
          <div className="p-4 space-y-4">
            <h2 className="font-bold text-lg">Orders</h2>
            
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No orders yet
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Order #{order.id.slice(-6)}</span>
                        <Badge variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'started' ? 'secondary' : 'outline'
                        }>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.products.length} item(s)
                      </p>
                      <p className="font-semibold text-primary">₹{order.totalAmount}</p>
                      
                      {order.paymentScreenshot && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="mt-2"
                          onClick={() => setShowOrderDetail(order.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" /> View Payment
                        </Button>
                      )}
                      
                      <div className="flex gap-2 mt-3">
                        {order.status === 'ordered' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleAcceptOrder(order.id)}
                          >
                            <Check className="w-3 h-3 mr-1" /> Accept
                          </Button>
                        )}
                        {order.status === 'payment_completed' && (
                          <Button 
                            size="sm" 
                            onClick={() => setShowOrderDetail(order.id)}
                          >
                            <Truck className="w-3 h-3 mr-1" /> Add Tracking
                          </Button>
                        )}
                        {order.status === 'started' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleMarkDelivered(order.id)}
                          >
                            <Check className="w-3 h-3 mr-1" /> Mark Delivered
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Order Detail Modal */}
            <Dialog open={!!showOrderDetail} onOpenChange={() => setShowOrderDetail(null)}>
              <DialogContent className="max-w-sm mx-4">
                <DialogHeader>
                  <DialogTitle>Order Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  {orders.find(o => o.id === showOrderDetail)?.paymentScreenshot && (
                    <div>
                      <Label>Payment Screenshot</Label>
                      <img 
                        src={orders.find(o => o.id === showOrderDetail)?.paymentScreenshot}
                        alt="Payment"
                        className="w-full rounded-lg mt-2"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Add Tracking Link</Label>
                    <Input
                      placeholder="https://tracking.example.com/..."
                      value={trackingLink}
                      onChange={(e) => setTrackingLink(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => showOrderDetail && handleAddTracking(showOrderDetail)}
                  >
                    Save & Start Delivery
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        );

      case 'manage':
        return (
          <div className="p-4 space-y-6">
            <h2 className="font-bold text-lg">Manage Salon</h2>
            
            {/* Artists */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Artists</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {mockArtists.filter(a => a.salonId === salon.id).map((artist) => (
                  <Card key={artist.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <img
                        src={artist.photo}
                        alt={artist.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {artist.specialties.join(', ')}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Services</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {salon.services.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-primary">₹{service.price}</p>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Products</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-3 h-3 mr-1" /> Add
                </Button>
              </div>
              <div className="space-y-2">
                {salon.products.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-primary">₹{product.price}</p>
                      </div>
                      <Button size="icon" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
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
