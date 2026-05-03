import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ContentService } from '../../../../services/content.service';

interface PricingRow {
  price: string;
  description: string;
  highlight: string[];
}

@Component({
  selector: 'app-supervisors',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './supervisors.html',
  styleUrl: './supervisors.css'
})
export class SupervisorsComponent {
  private contentService = inject(ContentService);
  supervisors = this.contentService.supervisors;
  activeTab = signal<'pricing' | 'supervisors'>('pricing');

  showInitial(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const fallback = img.nextElementSibling as HTMLElement;
    if (fallback) fallback.classList.remove('hidden');
  }

  pricingRows: PricingRow[] = [
    {
      price: '785',
      description: 'عدد 1 مشرف بوابة\n(للمناسبات من 50 مدعو إلى 100 مدعو)',
      highlight: ['1 مشرف', '50', '100']
    },
    {
      price: '1,550',
      description: 'عدد 2 مشرفَين بوابة\n(للمناسبات أكثر من 100 مدعو إلى 300 مدعو)',
      highlight: ['2 مشرفَين', '100', '300']
    },
    {
      price: '2,250',
      description: 'عدد 3 مشرفين بوابة\n(للمناسبات أكثر من 300 مدعو إلى 500 مدعو)',
      highlight: ['3 مشرفين', '300', '500']
    }
  ];

  supervisorFeatures = [
    'مشرفين أو مشرفات بزي موحد.',
    'طاولة تنظيم دخول.',
    'مسح أكواد الدخول.',
    'التواجد لمدة 5 ساعات.'
  ];

  boldWords: Record<string, string> = {
    'بزي موحد': 'text-[#B8860B] font-bold',
    'طاولة': 'text-[#B8860B] font-bold',
    'مسح': 'text-[#B8860B] font-bold',
    '5 ساعات': 'text-[#B8860B] font-bold'
  };

  cities = [
    { country: 'السعودية', cities: 'الرياض - مكة - المدينة - جدة - القصيم - الدمام - الخير - الظهران - الأحساء - حائل.' },
    { country: 'الإمارات', cities: 'أبوظبي - دبي.' },
    { country: 'الكويت', cities: 'الكويت.' },
    { country: 'قطر', cities: 'الدوحة.' },
    { country: 'البحرين', cities: 'المنامة.' }
  ];
}
