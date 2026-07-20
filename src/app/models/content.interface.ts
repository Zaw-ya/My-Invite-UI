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
  /** Backend field is "nickname" — kept as `role` for template continuity. */
  role: string;
  imageUrl: string;
  rating: number;
  /** Not currently returned by the API — optional so the card can render
      gracefully today and pick these up automatically if the backend
      adds them later, without another round of template changes. */
  reviewsCount?: number;
  city?: string;
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
  readMinutes: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  altText?: string;
  author?: string;
  tags?: string;
  content?: string;
}

export interface EventType {
  id: string;
  name: string;
  imageUrl: string;
}

export interface SiteSettings {
  'site-name': string;
  'contact-email': string;
  'contact-phone': string;
  'whatsapp-number': string;
  'facebook-url': string;
  'instagram-url': string;
  'address': string;
  'design-order-message': string;
}
