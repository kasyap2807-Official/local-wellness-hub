import { Product, Salon, Service, Artist, Doctor } from '@/types';

export const mockServices: Service[] = [
  {
    id: 's1',
    name: 'Classic Haircut',
    description: 'Professional haircut with styling',
    price: 500,
    duration: '45 mins',
    category: 'Hair',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'
  },
  {
    id: 's2',
    name: 'Bridal Makeup',
    description: 'Complete bridal makeup with HD finish',
    price: 15000,
    duration: '3 hours',
    category: 'Makeup',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400'
  },
  {
    id: 's3',
    name: 'Facial Treatment',
    description: 'Deep cleansing facial with massage',
    price: 2000,
    duration: '1 hour',
    category: 'Skincare',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
  },
  {
    id: 's4',
    name: 'Manicure & Pedicure',
    description: 'Complete nail care with polish',
    price: 1200,
    duration: '1.5 hours',
    category: 'Nails',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400'
  },
  {
    id: 's5',
    name: 'Hair Coloring',
    description: 'Professional hair coloring service',
    price: 3500,
    duration: '2 hours',
    category: 'Hair',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'
  },
  {
    id: 's6',
    name: 'Body Massage',
    description: 'Relaxing full body massage',
    price: 2500,
    duration: '1 hour',
    category: 'Wellness',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'
  }
];

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Vitamin C Serum',
    description: 'Brightening serum with 20% Vitamin C for glowing skin',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    rating: 4.5,
    reviews: 128,
    salonId: 'salon1',
    salonName: 'Glow Beauty Studio',
    category: 'Skincare'
  },
  {
    id: 'p2',
    name: 'Keratin Shampoo',
    description: 'Professional keratin-infused shampoo for smooth hair',
    price: 899,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400',
    rating: 4.3,
    reviews: 89,
    salonId: 'salon1',
    salonName: 'Glow Beauty Studio',
    category: 'Hair Care'
  },
  {
    id: 'p3',
    name: 'Matte Lipstick Set',
    description: 'Set of 6 long-lasting matte lipsticks',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
    rating: 4.7,
    reviews: 256,
    salonId: 'salon2',
    salonName: 'Luxe Salon',
    category: 'Makeup'
  },
  {
    id: 'p4',
    name: 'Hair Repair Mask',
    description: 'Deep conditioning mask for damaged hair',
    price: 749,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    rating: 4.4,
    reviews: 67,
    salonId: 'salon2',
    salonName: 'Luxe Salon',
    category: 'Hair Care'
  },
  {
    id: 'p5',
    name: 'Retinol Night Cream',
    description: 'Anti-aging night cream with retinol',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400',
    rating: 4.6,
    reviews: 145,
    salonId: 'salon3',
    salonName: 'Pure Wellness Spa',
    category: 'Skincare'
  },
  {
    id: 'p6',
    name: 'Nail Art Kit',
    description: 'Complete nail art kit with 24 colors',
    price: 999,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400',
    rating: 4.2,
    reviews: 43,
    salonId: 'salon3',
    salonName: 'Pure Wellness Spa',
    category: 'Nails'
  }
];

export const mockSalons: Salon[] = [
  {
    id: 'salon1',
    name: 'Glow Beauty Studio',
    address: 'Hitex Road, Kondapur, Hyderabad',
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600'
    ],
    rating: 4.6,
    reviews: 234,
    distance: '1.2 km',
    services: mockServices.slice(0, 3),
    products: mockProducts.filter(p => p.salonId === 'salon1'),
    ownerId: 'owner1'
  },
  {
    id: 'salon2',
    name: 'Luxe Salon',
    address: 'Madhapur, Hyderabad',
    images: [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600',
      'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600'
    ],
    rating: 4.8,
    reviews: 456,
    distance: '2.5 km',
    services: mockServices.slice(2, 5),
    products: mockProducts.filter(p => p.salonId === 'salon2'),
    ownerId: 'owner2'
  },
  {
    id: 'salon3',
    name: 'Pure Wellness Spa',
    address: 'Gachibowli, Hyderabad',
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600'
    ],
    rating: 4.7,
    reviews: 312,
    distance: '3.8 km',
    services: mockServices.slice(3),
    products: mockProducts.filter(p => p.salonId === 'salon3'),
    ownerId: 'owner3'
  }
];

export const mockArtists: Artist[] = [
  {
    id: 'artist1',
    name: 'Priya Sharma',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    rating: 4.9,
    reviews: 189,
    specialties: ['Bridal Makeup', 'Hair Styling'],
    services: mockServices.slice(0, 2),
    salonId: 'salon1',
    isIndependent: false,
    distance: '1.2 km'
  },
  {
    id: 'artist2',
    name: 'Ananya Reddy',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    rating: 4.7,
    reviews: 156,
    specialties: ['Skincare', 'Facials'],
    services: mockServices.slice(2, 4),
    isIndependent: true,
    distance: '0.8 km'
  },
  {
    id: 'artist3',
    name: 'Meera Kapoor',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    rating: 4.8,
    reviews: 201,
    specialties: ['Nail Art', 'Makeup'],
    services: mockServices.slice(1, 4),
    isIndependent: true,
    distance: '1.5 km'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Sunita Verma',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    specialty: 'Dermatologist',
    rating: 4.9,
    reviews: 342,
    experience: '15 years',
    consultationFee: 800,
    availableSlots: ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']
  },
  {
    id: 'doc2',
    name: 'Dr. Rajesh Kumar',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    specialty: 'Cosmetologist',
    rating: 4.7,
    reviews: 256,
    experience: '12 years',
    consultationFee: 1000,
    availableSlots: ['9:00 AM', '12:00 PM', '3:00 PM', '5:00 PM']
  },
  {
    id: 'doc3',
    name: 'Dr. Kavitha Rao',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    specialty: 'Trichologist',
    rating: 4.8,
    reviews: 189,
    experience: '10 years',
    consultationFee: 700,
    availableSlots: ['10:30 AM', '1:00 PM', '3:30 PM', '5:30 PM']
  }
];

export const mockAIAnalysis = {
  faceType: 'Oval',
  skinType: 'Combination',
  faceTone: 'Warm',
  skinTone: 'Medium'
};

export const faceTypes = ['Oval', 'Round', 'Square', 'Heart', 'Oblong', 'Diamond'];
export const skinTypes = ['Normal', 'Dry', 'Oily', 'Combination', 'Sensitive'];
export const tones = ['Fair', 'Light', 'Medium', 'Tan', 'Dark', 'Deep'];
export const undertones = ['Warm', 'Cool', 'Neutral'];
