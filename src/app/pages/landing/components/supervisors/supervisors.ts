import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ContentService } from '../../../../services/content.service';

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
  selectedPlan = signal<number | null>(null);

  showInitial(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  pricingRows = [
    { price: '785',   label: 'عدد', count: '1 مشرف',    suffix: 'بوابة', note: 'للمناسبات من 50 إلى 100 مدعو' },
    { price: '1,550', label: 'عدد', count: '2 مشرفَين', suffix: 'بوابة', note: 'للمناسبات أكثر من 100 إلى 300 مدعو' },
    { price: '2,250', label: 'عدد', count: '3 مشرفين',  suffix: 'بوابة', note: 'للمناسبات أكثر من 300 إلى 500 مدعو' },
  ];

  supervisorFeatures = [
    { text: 'مشرفين أو مشرفات', bold: 'بزي موحد' },
    { text: '', bold: 'طاولة', after: 'تنظيم دخول.' },
    { text: '', bold: 'مسح', after: 'أكواد الدخول.' },
    { text: 'التواجد لمدة', bold: '5 ساعات', after: '.' },
  ];

  cities = [
    { country: 'السعودية', cities: 'الرياض - مكة - المدينة - جدة - القصيم - الدمام - الخبر - الظهران - الأحساء - حائل.' },
    { country: 'الإمارات', cities: 'أبوظبي - دبي.' },
    { country: 'الكويت',   cities: 'الكويت.' },
    { country: 'قطر',      cities: 'الدوحة.' },
    { country: 'البحرين',  cities: 'المنامة.' },
  ];
}
