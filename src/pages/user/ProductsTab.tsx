import { useState } from 'react';
import { Search, Star, ShoppingCart, Camera, MessageCircle, Plus, Minus, X, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import { mockProducts, mockSalons } from '@/data/mockData';
import { Product, Order } from '@/types';
import { toast } from 'sonner';

export function ProductsTab() {
  const { cart, addToCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart, addOrder, user, orders } = useApp();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showTryAI, setShowTryAI] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState<string | null>(null);

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group products by salon
  const productsBySalon = filteredProducts.reduce((acc, product) => {
    if (!acc[product.salonId]) {
      acc[product.salonId] = {
        salonName: product.salonName,
        products: []
      };
    }
    acc[product.salonId].products.push(product);
    return acc;
  }, {} as Record<string, { salonName: string; products: Product[] }>);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    setShowCheckout(true);
  };

  const handleUploadScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrder = () => {
    // Group cart items by salon
    const cartBySalon = cart.reduce((acc, item) => {
      const salonId = item.product.salonId;
      if (!acc[salonId]) {
        acc[salonId] = {
          salonName: item.product.salonName,
          items: []
        };
      }
      acc[salonId].items.push(item);
      return acc;
    }, {} as Record<string, { salonName: string; items: typeof cart }>);

    // Create order for each salon
    Object.entries(cartBySalon).forEach(([salonId, { salonName, items }]) => {
      const order: Order = {
        id: `order_${Date.now()}_${salonId}`,
        userId: user?.id || '',
        products: items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        salonId,
        salonName,
        totalAmount: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        status: paymentScreenshot ? 'payment_completed' : 'ordered',
        paymentScreenshot: paymentScreenshot || undefined,
        createdAt: new Date().toISOString()
      };
      addOrder(order);
    });

    clearCart();
    setShowCheckout(false);
    setPaymentScreenshot(null);
    toast.success('Order placed successfully!');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products by Salon */}
      <div className="space-y-6">
        {Object.entries(productsBySalon).map(([salonId, { salonName, products }]) => (
          <div key={salonId}>
            <h3 className="font-semibold text-foreground mb-3">{salonName}</h3>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <Card 
                  key={product.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-card/90">
                      {product.category}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm text-foreground line-clamp-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <p className="font-bold text-primary mt-2">₹{product.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-sm mx-4 max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <div className="aspect-video relative -mx-6 -mt-6 mb-4">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <DialogHeader>
                <DialogTitle className="text-lg">{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium">{selectedProduct.rating}</span>
                    <span className="text-muted-foreground">({selectedProduct.reviews} reviews)</span>
                  </div>
                  <Badge variant="secondary">{selectedProduct.category}</Badge>
                </div>

                <p className="text-2xl font-bold text-primary">₹{selectedProduct.price}</p>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowTryAI(true);
                      setSelectedProduct(null);
                    }}
                  >
                    <Camera className="w-4 h-4 mr-1" /> Try with AI
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowChat(true);
                      setSelectedProduct(null);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" /> Ask Questions
                  </Button>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => {
                    addToCart(selectedProduct);
                    toast.success('Added to cart');
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Try Modal */}
      <Dialog open={showTryAI} onOpenChange={setShowTryAI}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Try with AI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Camera preview</p>
                <p className="text-xs text-muted-foreground">(Mock feature)</p>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowTryAI(false)}>
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      <Dialog open={showChat} onOpenChange={setShowChat}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Quick Questions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="h-48 bg-muted rounded-lg p-4 overflow-y-auto">
              <div className="space-y-3">
                <div className="bg-card p-3 rounded-lg text-sm">
                  <p className="font-medium">Bot:</p>
                  <p className="text-muted-foreground">Hi! Ask me anything about this product, including potential side effects.</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Type your question..." />
              <Button size="icon">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">(Mock chat feature)</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cart Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            className="fixed bottom-24 right-4 rounded-full w-14 h-14 shadow-lg"
            size="icon"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[70vh]">
          <SheetHeader>
            <SheetTitle>Your Cart ({cartItemCount} items)</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4 flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.product.salonName}</p>
                    <p className="font-semibold text-primary">₹{item.product.price}</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="pt-4 border-t border-border mt-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">₹{getCartTotal()}</span>
              </div>
              <Button className="w-full" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium mb-2">Order Summary</p>
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{getCartTotal()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Mock UPI Payment</p>
              <div className="p-4 bg-accent rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Scan to pay</p>
                <div className="w-32 h-32 bg-muted mx-auto rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">QR Code</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">upi://pay?pa=demo@upi</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Upload payment screenshot (optional)</p>
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleUploadScreenshot}
                />
                {paymentScreenshot ? (
                  <img src={paymentScreenshot} alt="Screenshot" className="h-20 object-contain" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload Screenshot</span>
                  </>
                )}
              </label>
            </div>

            <Button className="w-full" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Orders */}
      {orders.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-foreground mb-3">Recent Orders</h3>
          <div className="space-y-3">
            {orders.slice(0, 3).map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{order.salonName}</span>
                    <Badge variant={
                      order.status === 'delivered' ? 'default' :
                      order.status === 'payment_completed' ? 'secondary' : 'outline'
                    }>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.products.length} item(s) • ₹{order.totalAmount}
                  </p>
                  {order.trackingLink && (
                    <a 
                      href={order.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline mt-2 inline-block"
                    >
                      Track Order
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
