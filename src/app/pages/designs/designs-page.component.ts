import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';
import { DesignOrderService } from '../../services/design-order.service';
import { OrderModalComponent } from '../../components/order-modal/order-modal.component';
import { InvitationCard } from '../../models/content.interface';

@Component({
  selector: 'app-designs-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent, OrderModalComponent],
  templateUrl: './designs-page.component.html',
  styleUrl: './designs-page.component.css'
})
export class DesignsPageComponent {
  private contentService = inject(ContentService);
  private designOrderService = inject(DesignOrderService);
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
