import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../../../services/content.service';
import { ScrollService } from '../../../../services/scroll.service';

interface PricingTier {
  count: number;
  price: number;
}

interface PlanData {
  id: string;
  label: string;
  tiers: PricingTier[];
  features: string[];
  compensatoryPercent: number;
  ctaLabelKey: string;
  ctaClass: string;
  contactThreshold: number;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslocoModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.css'
})
export class PricingComponent {
  private contentService = inject(ContentService);
  readonly scrollService = inject(ScrollService);

  activeTab = signal<string>('');

  plans = computed<PlanData[]>(() => {
    const pkgs = this.contentService.packages();
    return pkgs.map(p => ({
      id: p.id,
      label: p.name,
      tiers: p.tiers || [],
      features: p.features,
      compensatoryPercent: p.compensationPercentage || 0,
      // Branches on the backend's own package-name contract value (Arabic,
      // per confirmed decision) — not a translated display string, so this
      // stays stable across languages. The CTA wording itself is now a
      // translation key rather than a hardcoded Arabic literal.
      ctaLabelKey: p.name.includes('الأعمال') ? 'pricing.ctaContactUs' : 'pricing.ctaOrderNow',
      ctaClass: p.name.includes('الأعمال') ? 'bg-[#9a6f09] hover:bg-[#7a5807] text-white' : 'bg-[#B8860B] hover:bg-[#9a6f09] text-white',
      contactThreshold: (p.tiers && p.tiers.length > 0) ? p.tiers[p.tiers.length - 1].count : 400,
    }));
  });

  selectedCounts = signal<Record<string, number>>({});

  constructor() {
    effect(() => {
      const currentPlans = this.plans();
      if (currentPlans.length > 0 && !this.activeTab()) {
        const firstPlan = currentPlans[0];
        this.activeTab.set(firstPlan.id);
        
        const counts: Record<string, number> = {};
        currentPlans.forEach(p => {
          if (p.tiers && p.tiers.length > 0) {
            counts[p.id] = p.tiers[0].count;
          }
        });
        this.selectedCounts.set(counts);
      }
    });
  }

  activePlan = computed<PlanData>(() => {
    const p = this.plans();
    const tab = this.activeTab();
    return p.find(plan => plan.id === tab) ?? p[0] ?? {
      id: '', label: '', tiers: [], features: [],
      compensatoryPercent: 0, ctaLabelKey: '', ctaClass: '',
      contactThreshold: 0
    };
  });

  selectedTier = computed(() => {
    const plan = this.activePlan();
    if (!plan || !plan.tiers?.length) return { count: 0, price: 0 };
    const count = this.selectedCounts()[plan.id];
    return plan.tiers.find(t => t.count === count) ?? plan.tiers[0];
  });

  compensatoryCount = computed(() => {
    const tier = this.selectedTier();
    const plan = this.activePlan();
    if (!tier || !plan) return 0;
    return Math.floor(tier.count * plan.compensatoryPercent / 100);
  });

  setTab(tab: string) {
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
