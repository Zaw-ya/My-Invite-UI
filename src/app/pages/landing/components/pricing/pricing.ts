import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface PricingTier {
  count: number;
  price: number;
}

interface PlanData {
  id: 'personal' | 'business';
  label: string;
  tiers: PricingTier[];
  features: string[];
  compensatoryPercent: number;
  ctaLabel: string;
  ctaClass: string;
  contactThreshold: number;
  contactLabel: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './pricing.html'
})
export class PricingComponent {
  activeTab = signal<'personal' | 'business'>('personal');

  plans: PlanData[] = [
    {
      id: 'personal',
      label: 'باقة كرت',
      tiers: [
        { count: 25,  price: 99.95 },
        { count: 50,  price: 189.95 },
        { count: 100, price: 384.99 },
        { count: 150, price: 549.99 },
        { count: 200, price: 699.99 },
        { count: 300, price: 999.99 },
        { count: 400, price: 1299.99 }
      ],
      features: [
        'إرسال الدعوات من خلال التطبيق',
        'وصول الدعوات على الواتساب أو الرسائل النصية',
        'إحصائيات لمعرفة القبول والاعتذار بالاسم و الرقم',
        'إمكانية مسح أكواد الدخول من التطبيق بدون جهاز خاص',
        'الاختيار من بين العديد من التصاميم الجاهزة',
        'إرسال دعوة تجريبية قبل إرسال الدعوات',
        'إمكانية تعيين داعي إضافي للمناسبة',
        'إرسال تذكير قبل المناسبة بيوم',
        'باركود دخول خاص لكل مدعو',
        'إمكانية تعيين أي شخص "كحارس البوابة أو مسؤولة القاعة" مشرف لمسح باركود الدخول',
        'استقبال رسائل المدعوين (شكر - دعاء) من التطبيق',
        '15% رصيد دعوات تعويضية - في حال إعتذار المدعو - من إجمالي عدد الدعوات'
      ],
      compensatoryPercent: 15,
      ctaLabel: 'حقل التطبيق',
      ctaClass: 'bg-[#B8860B] hover:bg-[#9a6f09] text-white',
      contactThreshold: 400,
      contactLabel: 'للمناسبات أكثر من 400 مدعو'
    },
    {
      id: 'business',
      label: 'باقة كرت للأعمال',
      tiers: [
        { count: 50,  price: 299.99 },
        { count: 100, price: 549.99 },
        { count: 150, price: 799.99 },
        { count: 200, price: 1049.99 },
        { count: 250, price: 1299.99 },
        { count: 300, price: 1499.99 },
        { count: 400, price: 1899.99 },
        { count: 500, price: 2299.99 }
      ],
      features: [
        'جميع مميزات باقة كرت الأساسية',
        'وصول الدعوات برقم هوية الجهة الرسمي',
        'تخصيص صفحة ويب للدعوة بلون هوية الجهة مع إضافة الشعار',
        'تصميم الدعوة حسب تيم المناسبة',
        'تخصيص 5 قوالب لإرسال الواتساب',
        'إرسال الدعوات من فريق كرت',
        'تتبع حالة الرسائل (تم الإرسال/ التسليم الفعراء/ ردود المدعوين في الوقت الفعلي',
        '20% رصيد دعوات تعويضية - في حال إعتذار المدعو - من إجمالي عدد الدعوات'
      ],
      compensatoryPercent: 20,
      ctaLabel: 'تواصل معنا',
      ctaClass: 'bg-[#9a6f09] hover:bg-[#7a5807] text-white',
      contactThreshold: 500,
      contactLabel: 'لإعداد دعوات مخصصة'
    }
  ];

  selectedCounts = signal<Record<'personal' | 'business', number>>({
    personal: 25,
    business: 50
  });

  activePlan = computed(() => this.plans.find(p => p.id === this.activeTab())!);

  selectedTier = computed(() => {
    const plan = this.activePlan();
    const count = this.selectedCounts()[plan.id];
    return plan.tiers.find(t => t.count === count) ?? plan.tiers[0];
  });

  compensatoryCount = computed(() => {
    const tier = this.selectedTier();
    const plan = this.activePlan();
    return Math.floor(tier.count * plan.compensatoryPercent / 100);
  });

  setTab(tab: 'personal' | 'business') {
    this.activeTab.set(tab);
  }

  selectCount(count: number) {
    const id = this.activeTab();
    this.selectedCounts.update(v => ({ ...v, [id]: count }));
  }

  isSelected(count: number) {
    return this.selectedCounts()[this.activeTab()] === count;
  }
}
