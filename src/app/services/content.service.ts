import { Injectable, signal } from '@angular/core';
import { Service, Package, InvitationCard, Supervisor, Testimonial, BlogPost, EventType } from '../models/content.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  // Arabic Event Types
  eventTypes = signal<EventType[]>([
    { id: '1', name: 'حفلات زواج', icon: 'heart' },
    { id: '2', name: 'حفلات تخرج', icon: 'graduation-cap' },
    { id: '3', name: 'حفلات الشركات', icon: 'briefcase' },
    { id: '4', name: 'المناسبات الحكومية', icon: 'landmark' },
    { id: '5', name: 'المناسبات الخاصة', icon: 'star' },
    { id: '6', name: 'حفلات أخرى', icon: 'menu' }
  ]);

  // Arabic Packages
  packages = signal<Package[]>([
    {
      id: '1',
      name: 'الباقة الأساسية',
      price: '299',
      description: 'مثالية للمناسبات الصغيرة والخاصة',
      features: ['دعوة رقمية واحدة', 'تتبع RSVP لـ 50 ضيف', 'موقع الحدث', 'دعم واتساب'],
      isPopular: false
    },
    {
      id: '2',
      name: 'الباقة المتميزة',
      price: '599',
      description: 'الأكثر مبيعاً للمناسبات المتوسطة',
      features: ['دعوة رقمية مخصصة', 'تتبع RSVP غير محدود', 'إدارة قائمة المدعوين', 'تذكيرات تلقائية'],
      isPopular: true
    },
    {
      id: '3',
      name: 'باقة VIP',
      price: '1299',
      description: 'تجربة فاخرة متكاملة لمناسبتك',
      features: ['تصميم فريد وحصري', 'إدارة كاملة للضيوف', 'خدمة دعم مخصصة 24/7', 'QR Code للدخول'],
      isPopular: false
    }
  ]);

  // Arabic Invitations (Matching Screenshots)
  invitations = signal<InvitationCard[]>([
    { id: '1', title: 'تصميم 1092', category: 'حفلات الزواج والمناسبات الخاصة', price: '150', imageUrl: 'image/1.png' },
    { id: '2', title: 'تصميم 1095', category: 'حفلات الزواج والمناسبات الخاصة', price: '150', imageUrl: 'image/2.png' },
    { id: '3', title: 'تصميم 1096', category: 'حفلات الزواج والمناسبات الخاصة', price: '150', imageUrl: 'image/3.png' },
    { id: '4', title: 'تصميم 1097', category: 'حفلات الزواج والمناسبات الخاصة', price: '150', imageUrl: 'image/4.png' }
  ]);

  // Arabic Supervisors
  supervisors = signal<Supervisor[]>([
    { id: '1', name: 'أحمد محمد', role: 'مشرف فعاليات', cost: '100', imageUrl: 'image/2.png' },
    { id: '2', name: 'سارة خالد', role: 'منسقة ضيوف', cost: '120', imageUrl: 'image/2.png' },
    { id: '3', name: 'فهد العتيبي', role: 'مدير تنظيم', cost: '150', imageUrl: 'image/3.png' }
  ]);

  // Arabic Blog Posts
  blogPosts = signal<BlogPost[]>([
    {
      id: '1',
      title: 'أفضل الطرق لتنظيم حفل زفافك الرقمي',
      excerpt: 'تعرف على كيفية اختيار التصميم المثالي وإدارة قائمة المدعوين بكل سهولة.',
      date: '2026-04-15',
      category: 'نصائح وتنظيم',
      imageUrl: 'image/1.png'
    },
    {
      id: '2',
      title: 'تريندات دعوات التخرج لعام 2026',
      excerpt: 'أحدث التصاميم والألوان التي تجعل فرحة التخرج لا تُنسى.',
      date: '2026-04-10',
      category: 'تصاميم',
      imageUrl: 'image/2.png'
    }
  ]);

  // Arabic Testimonials
  testimonials = signal<Testimonial[]>([
    { id: '1', name: 'محمد القحطاني', content: 'خدمة رائعة وتصاميم في غاية الأناقة. الضيوف انبهروا بالدعوة الرقمية.', role: 'عميل', eventType: 'حفل زواج', rating: 5 },
    { id: '2', name: 'ليلى الأحمد', content: 'سهولة في التعامل واحترافية عالية في التنفيذ. شكراً لكم على التميز.', role: 'عميلة', eventType: 'حفل تخرج', rating: 5 }
  ]);

  services = signal<Service[]>([
    { id: '1', title: 'دعوات الزفاف', description: 'تصاميم فاخرة تليق بليلة العمر.', icon: 'heart' },
    { id: '2', title: 'مناسبات الشركات', description: 'حلول احترافية لفعاليات أعمالكم.', icon: 'briefcase' }
  ]);
}
