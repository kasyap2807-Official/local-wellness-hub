import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Location, Order, Booking, Appointment, CartItem, Product } from '@/types';

interface AppContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (userData: Partial<User>) => boolean;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (profile: User['profile']) => void;
  completeProfile: () => void;

  // Location
  location: Location | null;
  locationLoading: boolean;
  locationError: string | null;
  fetchLocation: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;

  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  addPrescription: (appointmentId: string, prescription: Appointment['prescription']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('glowup_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [location, setLocation] = useState<Location | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('glowup_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('glowup_orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('glowup_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('glowup_appointments');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('glowup_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('glowup_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('glowup_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('glowup_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('glowup_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('glowup_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const fetchLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: {
                'User-Agent': 'GlowUp Beauty App'
              }
            }
          );
          
          const data = await response.json();
          
          setLocation({
            lat: latitude,
            lon: longitude,
            road: data.address?.road || data.address?.neighbourhood,
            suburb: data.address?.suburb || data.address?.city_district,
            city: data.address?.city || data.address?.town || data.address?.village,
            state: data.address?.state,
            postcode: data.address?.postcode,
            country: data.address?.country,
            displayName: data.display_name
          });
        } catch (error) {
          console.error('Error fetching location:', error);
          setLocation({
            lat: latitude,
            lon: longitude
          });
        }
        
        setLocationLoading(false);
      },
      (error) => {
        setLocationError(error.message);
        setLocationLoading(false);
      }
    );
  };

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem('glowup_users') || '[]');
    const foundUser = users.find((u: User) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (userData: Partial<User>): boolean => {
    const users = JSON.parse(localStorage.getItem('glowup_users') || '[]');
    const exists = users.some((u: User) => u.email === userData.email);
    
    if (exists) return false;
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      password: userData.password || '',
      address: userData.address,
      location: userData.location,
      profileCompleted: false
    };
    
    users.push(newUser);
    localStorage.setItem('glowup_users', JSON.stringify(users));
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const setUserRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      
      const users = JSON.parse(localStorage.getItem('glowup_users') || '[]');
      const index = users.findIndex((u: User) => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('glowup_users', JSON.stringify(users));
      }
    }
  };

  const updateUserProfile = (profile: User['profile']) => {
    if (user) {
      const updatedUser = { ...user, profile: { ...user.profile, ...profile } };
      setUser(updatedUser);
      
      const users = JSON.parse(localStorage.getItem('glowup_users') || '[]');
      const index = users.findIndex((u: User) => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('glowup_users', JSON.stringify(users));
      }
    }
  };

  const completeProfile = () => {
    if (user) {
      const updatedUser = { ...user, profileCompleted: true };
      setUser(updatedUser);
      
      const users = JSON.parse(localStorage.getItem('glowup_users') || '[]');
      const index = users.findIndex((u: User) => u.id === user.id);
      if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('glowup_users', JSON.stringify(users));
      }
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
  };

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [appointment, ...prev]);
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status } : apt
      )
    );
  };

  const addPrescription = (appointmentId: string, prescription: Appointment['prescription']) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, prescription, status: 'completed' } : apt
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        setUserRole,
        updateUserProfile,
        completeProfile,
        location,
        locationLoading,
        locationError,
        fetchLocation,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        orders,
        addOrder,
        updateOrderStatus,
        bookings,
        addBooking,
        updateBookingStatus,
        appointments,
        addAppointment,
        updateAppointmentStatus,
        addPrescription
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
