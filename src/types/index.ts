export type UserRole = 'user' | 'salon_owner' | 'artist' | 'doctor';

export interface Location {
  lat: number;
  lon: number;
  road?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  displayName?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
  address?: string;
  location?: Location;
  profileCompleted?: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  photo?: string;
  height?: string;
  weight?: string;
  allergies?: string;
  faceType?: string;
  skinType?: string;
  faceTone?: string;
  skinTone?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  salonId: string;
  salonName: string;
  category: string;
}

export interface Salon {
  id: string;
  name: string;
  address: string;
  images: string[];
  rating: number;
  reviews: number;
  distance?: string;
  services: Service[];
  products: Product[];
  ownerId: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image: string;
}

export interface Artist {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  specialties: string[];
  services: Service[];
  salonId?: string;
  isIndependent: boolean;
  distance?: string;
}

export interface Doctor {
  id: string;
  name: string;
  photo: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  consultationFee: number;
  availableSlots: string[];
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  providerId: string;
  providerName: string;
  providerType: 'salon' | 'artist';
  date: string;
  time: string;
  type: 'home' | 'salon';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  paymentStatus: 'pending' | 'paid';
}

export interface Order {
  id: string;
  userId: string;
  products: OrderProduct[];
  salonId: string;
  salonName: string;
  totalAmount: number;
  status: 'ordered' | 'payment_completed' | 'started' | 'delivered';
  paymentScreenshot?: string;
  trackingLink?: string;
  createdAt: string;
}

export interface OrderProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  prescription?: Prescription;
}

export interface Prescription {
  id: string;
  medicines: string[];
  instructions: string;
  suggestedProducts: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
