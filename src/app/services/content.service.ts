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
    { id: '1',  title: 'تصميم 1092', category: 'حفل زفاف',        price: '150', imageUrl: 'image/1.png', gender: 'ذكوري',  isNew: false },
    { id: '2',  title: 'تصميم 1095', category: 'حفل زفاف',        price: '150', imageUrl: 'image/2.png', gender: 'أنثوي',  isNew: true  },
    { id: '3',  title: 'تصميم 1096', category: 'حفل زفاف',        price: '150', imageUrl: 'image/3.png', gender: 'ذكوري',  isNew: false },
    { id: '4',  title: 'تصميم 1097', category: 'حفل زفاف',        price: '150', imageUrl: 'image/4.png', gender: 'أنثوي',  isNew: false },
    { id: '5',  title: 'تصميم 1101', category: 'خطبة / حناء',     price: '120', imageUrl: 'image/5.png', gender: 'أنثوي',  isNew: true  },
    { id: '6',  title: 'تصميم 1102', category: 'خطبة / حناء',     price: '120', imageUrl: 'image/6.png', gender: 'أنثوي',  isNew: false },
    { id: '7',  title: 'تصميم 1110', category: 'حفل تخرج',        price: '100', imageUrl: 'image/7.png', gender: 'ذكوري',  isNew: true  },
    { id: '8',  title: 'تصميم 1111', category: 'حفل تخرج',        price: '100', imageUrl: 'image/8.png', gender: 'أنثوي',  isNew: false },
    { id: '9',  title: 'تصميم 1115', category: 'حفل تخرج',        price: '100', imageUrl: 'image/1.png', gender: 'ذكوري',  isNew: false },
    { id: '10', title: 'تصميم 1120', category: 'مناقشة رسالة',    price: '100', imageUrl: 'image/2.png', gender: 'ذكوري',  isNew: true  },
    { id: '11', title: 'تصميم 1121', category: 'مناقشة رسالة',    price: '100', imageUrl: 'image/3.png', gender: 'أنثوي',  isNew: false },
    { id: '12', title: 'تصميم 1130', category: 'حدث تقني / خاص',  price: '130', imageUrl: 'image/4.png', gender: 'ذكوري',  isNew: false },
    { id: '13', title: 'تصميم 1131', category: 'حدث تقني / خاص',  price: '130', imageUrl: 'image/5.png', gender: 'أنثوي',  isNew: true  },
    { id: '14', title: 'تصميم 1140', category: 'عيد ميلاد',       price: '90',  imageUrl: 'image/6.png', gender: 'أنثوي',  isNew: false },
    { id: '15', title: 'تصميم 1141', category: 'عيد ميلاد',       price: '90',  imageUrl: 'image/7.png', gender: 'ذكوري',  isNew: false },
    { id: '16', title: 'تصميم 1150', category: 'سبوع',            price: '90',  imageUrl: 'image/8.png', gender: 'أنثوي',  isNew: true  },
    { id: '17', title: 'تصميم 1151', category: 'سبوع',            price: '90',  imageUrl: 'image/1.png', gender: 'ذكوري',  isNew: false },
    { id: '18', title: 'تصميم 1160', category: 'تهنئة',           price: '80',  imageUrl: 'image/2.png', gender: 'أنثوي',  isNew: false },
    { id: '19', title: 'تصميم 1161', category: 'تهنئة',           price: '80',  imageUrl: 'image/3.png', gender: 'ذكوري',  isNew: true  },
    { id: '20', title: 'تصميم 1162', category: 'تهنئة',           price: '80',  imageUrl: 'image/4.png', gender: 'أنثوي',  isNew: false },
    { id: '21', title: 'تصميم 1200', category: 'حفل زفاف',        price: '180', imageUrl: 'image/5.png', gender: 'أنثوي',  isNew: true  },
    { id: '22', title: 'تصميم 1201', category: 'حفل زفاف',        price: '180', imageUrl: 'image/6.png', gender: 'ذكوري',  isNew: false },
    { id: '23', title: 'تصميم 1202', category: 'خطبة / حناء',     price: '140', imageUrl: 'image/7.png', gender: 'أنثوي',  isNew: true  },
    { id: '24', title: 'تصميم 1203', category: 'حفل تخرج',        price: '110', imageUrl: 'image/8.png', gender: 'ذكوري',  isNew: false },
    { id: '25', title: 'تصميم 1204', category: 'مناقشة رسالة',    price: '110', imageUrl: 'image/1.png', gender: 'أنثوي',  isNew: false },
    { id: '26', title: 'تصميم 1205', category: 'عيد ميلاد',       price: '95',  imageUrl: 'image/2.png', gender: 'ذكوري',  isNew: true  },
    { id: '27', title: 'تصميم 1206', category: 'سبوع',            price: '95',  imageUrl: 'image/3.png', gender: 'أنثوي',  isNew: false },
    { id: '28', title: 'تصميم 1207', category: 'تهنئة',           price: '85',  imageUrl: 'image/4.png', gender: 'ذكوري',  isNew: false },
    { id: '29', title: 'تصميم 1208', category: 'حفل زفاف',        price: '160', imageUrl: 'image/5.png', gender: 'أنثوي',  isNew: false },
    { id: '30', title: 'تصميم 1209', category: 'خطبة / حناء',     price: '130', imageUrl: 'image/6.png', gender: 'ذكوري',  isNew: false },
    { id: '31', title: 'تصميم 1210', category: 'حفل تخرج',        price: '115', imageUrl: 'image/7.png', gender: 'أنثوي',  isNew: true  },
    { id: '32', title: 'تصميم 1211', category: 'مناقشة رسالة',    price: '105', imageUrl: 'image/8.png', gender: 'ذكوري',  isNew: false },
    { id: '33', title: 'تصميم 1212', category: 'عيد ميلاد',       price: '85',  imageUrl: 'image/1.png', gender: 'أنثوي',  isNew: false },
    { id: '34', title: 'تصميم 1213', category: 'سبوع',            price: '85',  imageUrl: 'image/2.png', gender: 'ذكوري',  isNew: false },
    { id: '35', title: 'تصميم 1214', category: 'تهنئة',           price: '75',  imageUrl: 'image/3.png', gender: 'أنثوي',  isNew: true  },
    { id: '36', title: 'تصميم 1215', category: 'حفل زفاف',        price: '170', imageUrl: 'image/4.png', gender: 'ذكوري',  isNew: true  },
    { id: '37', title: 'تصميم 1216', category: 'خطبة / حناء',     price: '145', imageUrl: 'image/5.png', gender: 'أنثوي',  isNew: false },
    { id: '38', title: 'تصميم 1217', category: 'حفل تخرج',        price: '120', imageUrl: 'image/6.png', gender: 'ذكوري',  isNew: false },
    { id: '39', title: 'تصميم 1218', category: 'مناقشة رسالة',    price: '115', imageUrl: 'image/7.png', gender: 'أنثوي',  isNew: false },
    { id: '40', title: 'تصميم 1219', category: 'عيد ميلاد',       price: '100', imageUrl: 'image/8.png', gender: 'ذكوري',  isNew: true  },
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
