import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../../../services/content.service';
import { ScrollService } from '../../../../services/scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LucideAngularModule, TranslocoModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  private contentService = inject(ContentService);
  readonly scrollService = inject(ScrollService);
  settings = this.contentService.siteSettings;
  carouselCards = this.contentService.carouselCards;

  currentCardIndex = signal(0);
  private rotationTimer: any;

  // The two designs flanking the active one in the carousel — rendered
  // as smaller, dimmed cards fanned behind it (see hero.html/.css), so
  // the visual reads as a styled deck from the real design library
  // instead of one flat image. Real assets already on hand, no new
  // artwork needed.
  prevCard = computed(() => {
    const cards = this.carouselCards();
    if (cards.length < 2) return null;
    const idx = (this.currentCardIndex() - 1 + cards.length) % cards.length;
    return cards[idx];
  });

  nextCard = computed(() => {
    const cards = this.carouselCards();
    if (cards.length < 2) return null;
    const idx = (this.currentCardIndex() + 1) % cards.length;
    return cards[idx];
  });

  ngOnInit() {
    this.startRotation();
  }

  ngOnDestroy() {
    if (this.rotationTimer) clearInterval(this.rotationTimer);
  }

  private startRotation() {
    this.rotationTimer = setInterval(() => {
      const cards = this.carouselCards();
      if (cards.length > 0) {
        this.currentCardIndex.update(i => (i + 1) % cards.length);
      }
    }, 5000);
  }
}
