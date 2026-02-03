import { MenuItem, Review, RestaurantInfo } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // --- SEAFOOD RAW BAR ---
  {
    id: '1',
    name: 'Mixed Oysters (Dozen)',
    description: 'A curated selection of the freshest local oysters. Served with mignonette, horseradish, and lemon.',
    price: 36,
    currency: '$',
    category: 'Seafood',
    rating: 5.0,
    reviewsCount: 450,
    isChefSpecial: true,
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=80',
    calories: 120
  },
  {
    id: '2',
    name: 'Dungeness Crab Back',
    description: 'Our signature item. Savory crab "butter" (fat) served in the shell. Rich, creamy, and unforgettable.',
    price: 14,
    currency: '$',
    category: 'Seafood',
    rating: 4.9,
    reviewsCount: 320,
    isChefSpecial: true,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    calories: 300
  },
  {
    id: '3',
    name: 'Sicilian Sashimi',
    description: 'Thinly sliced raw scallops, salmon, or tuna drizzled with olive oil, capers, and red onion.',
    price: 28,
    currency: '$',
    category: 'Seafood',
    rating: 4.8,
    reviewsCount: 180,
    isChefSpecial: true,
    image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=800&q=80',
    calories: 250
  },
  
  // --- CHOWDER & SALADS ---
  {
    id: '4',
    name: 'Boston Clam Chowder',
    description: 'Creamy, comforting, and loaded with clams. Served with sourdough bread.',
    price: 9,
    currency: '$',
    category: 'Chowder',
    rating: 4.7,
    reviewsCount: 290,
    isChefSpecial: false,
    image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?auto=format&fit=crop&w=800&q=80',
    calories: 450
  },
  {
    id: '5',
    name: 'Crab Louie Salad',
    description: 'A San Francisco classic. Heaps of fresh Dungeness crab meat over crisp lettuce with Louie dressing.',
    price: 32,
    currency: '$',
    category: 'Salads',
    rating: 4.9,
    reviewsCount: 210,
    isChefSpecial: false,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    calories: 550
  },

  // --- DRINKS ---
  {
    id: 'b1',
    name: "Anchor Steam Beer",
    description: "The classic San Francisco brew. Deep amber color with a thick, creamy head.",
    price: 7,
    currency: '$',
    category: 'Beer',
    rating: 4.8,
    reviewsCount: 150,
    isChefSpecial: false,
    image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
  },
  {
    id: 'w1',
    name: "Crisp Sauvignon Blanc",
    description: "Chilled white wine, perfect for pairing with raw oysters.",
    price: 11,
    currency: '$',
    category: 'Wine',
    rating: 4.6,
    reviewsCount: 88,
    isChefSpecial: false,
    image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&w=800&q=80',
    isVegetarian: true,
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'James Miller',
    rating: 5,
    text: "Worth the wait! The crab back is a religious experience. Remember to bring cash!",
    date: '2 days ago',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'r2',
    author: 'Sarah Jenkins',
    rating: 5,
    text: "The best seafood in SF, hands down. It's no-frills, old school, and absolutely perfect. The staff is hilarious.",
    date: '1 week ago',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 'r3',
    author: 'David Chen',
    rating: 4,
    text: "Iconic spot. The line moves faster than you think. Oysters were incredibly fresh.",
    date: '3 weeks ago',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'
  }
];

export const RESTAURANT_INFO: RestaurantInfo = {
  name: "Swan Oyster Depot",
  address: '1517 Polk St, San Francisco, CA 94109',
  phone: '+1 (415) 673-1101',
  description: "No-frills counter nook in a fish market is a bustling landmark for raw-bar fare & casual seafood. A San Francisco legend since 1912.",
  landmark: "Polk Gulch",
  // REPLACE THIS URL with your real photo URL when hosting
  storefrontImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80", 
  amenities: [
    "Dogs Allowed",
    "Wheelchair Accessible",
    "No Reservations",
    "Usually a Wait",
    "Counter Seating"
  ],
  paymentMethods: ["CASH ONLY", "Checks"],
  
  // Logic: Mon-Sat 8am-2:30pm (Pacific Time), Closed Sunday
  get isOpenNow() {
    // We use Intl.DateTimeFormat to get the time in San Francisco (America/Los_Angeles)
    // regardless of where the user is located.
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    
    const parts = formatter.formatToParts(new Date());
    const partValue = (type: string) => parts.find(p => p.type === type)?.value;
    
    const day = partValue('weekday'); // "Sun", "Mon", "Tue"...
    const hourStr = partValue('hour');
    const minuteStr = partValue('minute');
    
    if (!hourStr || !minuteStr) return false;

    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const timeInDecimal = hour + minute / 60;

    // Closed on Sunday
    if (day === 'Sun') return false;

    // Open Mon(Mon) - Sat(Sat) from 8:00 to 14:30 (2:30 PM)
    return timeInDecimal >= 8 && timeInDecimal < 14.5;
  }
};