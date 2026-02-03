export type Category = 'All' | 'Seafood' | 'Chowder' | 'Salads' | 'Beer' | 'Wine';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; 
  bottlePrice?: number; 
  currency: string;
  category: Category;
  rating: number; // 0 to 5
  reviewsCount: number;
  isChefSpecial: boolean;
  image: string;
  isVegetarian?: boolean;
  spicinessLevel?: 0 | 1 | 2 | 3; 
  calories?: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  description: string;
  landmark: string;
  storefrontImage: string; // New field for the real photo
  amenities: string[];
  paymentMethods: string[];
  isOpenNow: boolean;
}