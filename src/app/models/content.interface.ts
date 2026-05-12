export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  compensationPercentage?: number;
  tiers?: { count: number; price: number }[];
}

export interface InvitationCard {
  id: string;
  title: string;
  category: string;
  allCategories?: string[];
  price: string;
  imageUrl: string;
  gender?: 'ذكوري' | 'أنثوي';
  isNew?: boolean;
}

export interface Supervisor {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  cost: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  eventType: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  readTime: string;
}

export interface EventType {
  id: string;
  name: string;
  imageUrl: string;
}
