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
}

export interface InvitationCard {
  id: string;
  title: string;
  category: string;
  price: string;
  imageUrl: string;
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
}

export interface EventType {
  id: string;
  name: string;
  icon: string;
}
