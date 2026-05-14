import { Component, Input, ElementRef, ViewChild, AfterViewInit, HostListener, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { InvitationCard } from '../../../../models/content.interface';
import { DesignOrderService } from '../../../../services/design-order.service';

@Component({
  selector: 'app-portfolio-slider',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './portfolio-slider.html',
  styleUrl: './portfolio-slider.css'
})
export class PortfolioSliderComponent implements AfterViewInit {
  private designOrderService = inject(DesignOrderService);

  @Input() invitations: InvitationCard[] = [];
  @Input() categories: string[] = ['كل التصميمات'];
  @ViewChild('sliderContainer') container!: ElementRef<HTMLDivElement>;

  cardWidth = signal(300);
  currentIndex = signal(0);
  gap = 24; // 1.5rem (24px)

  previewCard = signal<InvitationCard | null>(null);

  activeCategory = signal('كل التصميمات');
  activeGender = signal('كل التصميمات');
  genderOptions = ['كل التصميمات', 'تصميمات ذكورية', 'تصميمات أنثوية'];

  filteredInvitations = computed(() => {
    let items = this.invitations;
    const cat = this.activeCategory();
    const gender = this.activeGender();

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

    // Reset scroll when filters change
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.currentIndex.set(0);
        if (this.container) {
          this.container.nativeElement.scrollLeft = 0;
        }
        this.updateCardWidth();
      }, 50);
    }

    return items;
  });

  setCategory(cat: string) {
    this.activeCategory.set(cat);
  }

  setGender(gender: string) {
    this.activeGender.set(gender);
  }

  openPreview(card: InvitationCard) {
    this.previewCard.set(card);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closePreview() {
    this.previewCard.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  orderDesign(card: InvitationCard) {
    this.closePreview();
    this.designOrderService.openModal(card.id);
  }

  ngAfterViewInit() {
    this.updateCardWidth();
    // Small delay to ensure exact container sizing after initial render
    setTimeout(() => this.updateCardWidth(), 150);
  }

  @HostListener('window:resize')
  onResize() {
    this.updateCardWidth();
  }

  updateCardWidth() {
    if (typeof window === 'undefined' || !this.container) return;
    const containerWidth = this.container.nativeElement.clientWidth;
    
    if (window.innerWidth < 640) {
      // Mobile: Cards take 100% of the container width
      const width = containerWidth;
      this.cardWidth.set(width);
    } else {
      const visibleCards = this.getVisibleCards(window.innerWidth);
      const totalGapSpace = this.gap * (visibleCards - 1);
      const width = (containerWidth - totalGapSpace) / visibleCards;
      this.cardWidth.set(width);
    }
  }

  getVisibleCards(windowWidth: number): number {
    if (windowWidth >= 1280) return 4;
    if (windowWidth >= 1024) return 3;
    if (windowWidth >= 640) return 2;
    return 1;
  }

  scrollNext() {
    if (typeof window === 'undefined' || !this.container) return;
    const visible = this.getVisibleCards(window.innerWidth);
    const maxIndex = Math.max(0, this.invitations.length - visible);
    
    let nextIndex = this.currentIndex() + 1;
    if (nextIndex > maxIndex) {
      nextIndex = 0; // Loop seamlessly to start
    }
    
    this.scrollToIndex(nextIndex);
  }

  scrollPrev() {
    if (typeof window === 'undefined' || !this.container) return;
    const visible = this.getVisibleCards(window.innerWidth);
    const maxIndex = Math.max(0, this.invitations.length - visible);
    
    let prevIndex = this.currentIndex() - 1;
    if (prevIndex < 0) {
      prevIndex = maxIndex; // Loop to end
    }
    
    this.scrollToIndex(prevIndex);
  }

  scrollToIndex(index: number) {
    if (!this.container) return;
    const track = this.container.nativeElement.querySelector('.slider-track');
    if (!track) return;
    
    const card = track.children[index] as HTMLElement;
    if (card) {
      // scrollIntoView native alignment works perfectly across all devices and RTL/LTR
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      this.currentIndex.set(index);
    }
  }

  onScroll() {
    if (!this.container) return;
    const scrollPos = Math.abs(this.container.nativeElement.scrollLeft);
    const cardPlusGap = this.cardWidth() + this.gap;
    const index = Math.round(scrollPos / cardPlusGap);
    
    if (index !== this.currentIndex()) {
      this.currentIndex.set(index);
    }
  }
}
