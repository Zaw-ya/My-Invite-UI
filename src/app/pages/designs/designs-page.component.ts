import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';
import { DesignOrderService } from '../../services/design-order.service';
import { SeoService } from '../../services/seo.service';
import { OrderModalComponent } from '../../components/order-modal/order-modal.component';
import { InvitationCard } from '../../models/content.interface';

@Component({
  selector: 'app-designs-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent, OrderModalComponent],
  templateUrl: './designs-page.component.html',
  styleUrl: './designs-page.component.css'
})
export class DesignsPageComponent implements OnInit {
  private contentService = inject(ContentService);
  private designOrderService = inject(DesignOrderService);
  private seoService = inject(SeoService);

  showOrderModal = this.designOrderService.showModal;

  activeCategory = signal('كل التصميمات');
  activeGender = signal('كل التصميمات');
  previewCard = signal<InvitationCard | null>(null);

  invitations = this.contentService.invitations;
  eventTypes = this.contentService.eventTypes;

  categories = computed(() => {
    const names = this.eventTypes().map(e => e.name);
    return ['كل التصميمات', ...names];
  });

  filtered = computed(() => {
    const cat = this.activeCategory();
    const gender = this.activeGender();
    let items = this.invitations();

    if (cat && cat !== 'كل التصميمات') {
      const searchCat = cat.trim();
      items = items.filter(i =>
        (i.category && i.category.trim() === searchCat) ||
        (i.allCategories && i.allCategories.some(c => c.trim() === searchCat))
      );
    }

    if (gender === 'تصميمات ذكورية') {
      items = items.filter(i => i.gender === 'ذكوري');
    } else if (gender === 'تصميمات أنثوية') {
      items = items.filter(i => i.gender === 'أنثوي');
    }

    return items;
  });

  isLoading = computed(() => this.invitations().length === 0);

  ngOnInit() {
    this.seoService.updateSeo({
      title: 'تصاميم الدعوات الرقمية | Special Cards | مؤسسة بطاقتي الخاصة',
      description: 'اكتشف مجموعتنا الواسعة من تصاميم كروت الدعوة الرقمية الفاخرة لحفلات الزواج، التخرج، وكل المناسبات الخاصة من Special Cards.',
      canonical: 'https://www.specialcards.net/designs',
      keywords: 'تصاميم دعوات رقمية, كروت زواج, كروت تخرج, تصميم دعوة, بطاقات دعوة فاخرة, Special Cards, مؤسسة بطاقتي الخاصة',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'تصاميم الدعوات الرقمية',
        description: 'مجموعة تصاميم كروت الدعوة الرقمية الفاخرة',
        url: 'https://www.specialcards.net/designs',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Special Cards | مؤسسة بطاقتي الخاصة',
          url: 'https://www.specialcards.net'
        }
      }
    });
  }

  openPreview(card: InvitationCard) {
    this.previewCard.set(card);
    document.body.style.overflow = 'hidden';
  }

  closePreview() {
    this.previewCard.set(null);
    document.body.style.overflow = '';
  }

  orderDesign(card: InvitationCard) {
    this.closePreview();
    this.designOrderService.openModal(card.id);
  }
}
