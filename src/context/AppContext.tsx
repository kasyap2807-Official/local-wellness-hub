import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, UserRole, Location, Order, Booking, Appointment, CartItem, Product,
  Wallet, WalletHistory, DietPreference, DietCompletion, FaceScoreEntry, CollectBoxClaim
} from '@/types';
import { format } from 'date-fns';

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

  // Wallet
  wallet: Wallet | null;
  walletHistory: WalletHistory[];
  addCoins: (coins: number, actionType: string) => void;

  // Diet Plan
  dietPreference: DietPreference | null;
  setDietPreference: (preference: DietPreference) => void;
  dietCompletions: DietCompletion[];
  completeDietForToday: () => void;
  isDietCompletedToday: () => boolean;

  // Face Score
  faceScoreHistory: FaceScoreEntry[];
  addFaceScore: (score: number, coinsEarned: number) => void;

  // Collect Box
  collectBoxClaims: CollectBoxClaim[];
  hasClaimedCollectBoxToday: () => boolean;
  claimCollectBox: (coins: number) => void;

  // Daily Login
  checkDailyLogin: () => void;
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

  // Wallet state
  const [wallet, setWallet] = useState<Wallet | null>(() => {
    const saved = localStorage.getItem('glowup_wallet');
    return saved ? JSON.parse(saved) : null;
  });

  const [walletHistory, setWalletHistory] = useState<WalletHistory[]>(() => {
    const saved = localStorage.getItem('glowup_wallet_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Diet state
  const [dietPreference, setDietPreferenceState] = useState<DietPreference | null>(() => {
    const saved = localStorage.getItem('glowup_diet_preference');
    return saved ? JSON.parse(saved) : null;
  });

  const [dietCompletions, setDietCompletions] = useState<DietCompletion[]>(() => {
    const saved = localStorage.getItem('glowup_diet_completions');
    return saved ? JSON.parse(saved) : [];
  });

  // Face Score state
  const [faceScoreHistory, setFaceScoreHistory] = useState<FaceScoreEntry[]>(() => {
    const saved = localStorage.getItem('glowup_face_scores');
    return saved ? JSON.parse(saved) : [];
  });

  // Collect Box state
  const [collectBoxClaims, setCollectBoxClaims] = useState<CollectBoxClaim[]>(() => {
    const saved = localStorage.getItem('glowup_collect_claims');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastLoginDate, setLastLoginDate] = useState<string | null>(() => {
    return localStorage.getItem('glowup_last_login');
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

  useEffect(() => {
    if (wallet) {
      localStorage.setItem('glowup_wallet', JSON.stringify(wallet));
    }
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('glowup_wallet_history', JSON.stringify(walletHistory));
  }, [walletHistory]);

  useEffect(() => {
    if (dietPreference) {
      localStorage.setItem('glowup_diet_preference', JSON.stringify(dietPreference));
    }
  }, [dietPreference]);

  useEffect(() => {
    localStorage.setItem('glowup_diet_completions', JSON.stringify(dietCompletions));
  }, [dietCompletions]);

  useEffect(() => {
    localStorage.setItem('glowup_face_scores', JSON.stringify(faceScoreHistory));
  }, [faceScoreHistory]);

  useEffect(() => {
    localStorage.setItem('glowup_collect_claims', JSON.stringify(collectBoxClaims));
  }, [collectBoxClaims]);

  // Initialize wallet when user logs in
  useEffect(() => {
    if (user && !wallet) {
      setWallet({
        id: `wallet_${user.id}`,
        userId: user.id,
        totalCoins: 0
      });
    }
  }, [user, wallet]);

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
      
      // Load user-specific wallet
      const savedWallet = localStorage.getItem(`glowup_wallet_${foundUser.id}`);
      if (savedWallet) {
        setWallet(JSON.parse(savedWallet));
      } else {
        setWallet({
          id: `wallet_${foundUser.id}`,
          userId: foundUser.id,
          totalCoins: 0
        });
      }
      
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
    
    // Initialize wallet for new user
    const newWallet: Wallet = {
      id: `wallet_${newUser.id}`,
      userId: newUser.id,
      totalCoins: 0
    };
    setWallet(newWallet);
    
    return true;
  };

  const logout = () => {
    // Save wallet before logout
    if (wallet && user) {
      localStorage.setItem(`glowup_wallet_${user.id}`, JSON.stringify(wallet));
    }
    
    setUser(null);
    setCart([]);
    setWallet(null);
    setWalletHistory([]);
    setDietPreferenceState(null);
    setDietCompletions([]);
    setFaceScoreHistory([]);
    setCollectBoxClaims([]);
    
    // Clear local storage for session data
    localStorage.removeItem('glowup_wallet');
    localStorage.removeItem('glowup_wallet_history');
    localStorage.removeItem('glowup_diet_preference');
    localStorage.removeItem('glowup_diet_completions');
    localStorage.removeItem('glowup_face_scores');
    localStorage.removeItem('glowup_collect_claims');
    localStorage.removeItem('glowup_last_login');
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

  // Wallet functions
  const addCoins = (coins: number, actionType: string) => {
    if (wallet) {
      setWallet(prev => prev ? { ...prev, totalCoins: prev.totalCoins + coins } : null);
      
      const historyEntry: WalletHistory = {
        id: `wh_${Date.now()}`,
        actionType,
        coinsEarned: coins,
        dateTime: new Date().toISOString()
      };
      setWalletHistory(prev => [historyEntry, ...prev]);
    }
  };

  // Diet functions
  const setDietPreference = (preference: DietPreference) => {
    setDietPreferenceState(preference);
  };

  const completeDietForToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setDietCompletions(prev => [...prev, { date: today, completed: true }]);
  };

  const isDietCompletedToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return dietCompletions.some(c => c.date === today && c.completed);
  };

  // Face Score functions
  const addFaceScore = (score: number, coinsEarned: number) => {
    const entry: FaceScoreEntry = {
      id: `fs_${Date.now()}`,
      date: new Date().toISOString(),
      score,
      coinsEarned
    };
    setFaceScoreHistory(prev => [entry, ...prev]);
  };

  // Collect Box functions
  const hasClaimedCollectBoxToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return collectBoxClaims.some(c => c.date === today);
  };

  const claimCollectBox = (coins: number) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    setCollectBoxClaims(prev => [...prev, { date: today, coins }]);
  };

  // Daily Login check
  const checkDailyLogin = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (lastLoginDate !== today && user) {
      setLastLoginDate(today);
      localStorage.setItem('glowup_last_login', today);
      addCoins(5, 'Daily Login');
    }
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
        addPrescription,
        wallet,
        walletHistory,
        addCoins,
        dietPreference,
        setDietPreference,
        dietCompletions,
        completeDietForToday,
        isDietCompletedToday,
        faceScoreHistory,
        addFaceScore,
        collectBoxClaims,
        hasClaimedCollectBoxToday,
        claimCollectBox,
        checkDailyLogin
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
