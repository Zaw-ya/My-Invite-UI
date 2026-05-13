import { Component, signal, inject, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ContentService } from '../../../../services/content.service';

interface EventTag {
  label: string;
  imageUrl: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  private contentService = inject(ContentService);
  settings = this.contentService.siteSettings;
  carouselCards = this.contentService.carouselCards;
  
  eventTypes = this.contentService.eventTypes;
  
  currentCardIndex = signal(0);
  private rotationTimer: any;

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

  brandParts = computed(() => {
    const name = this.settings()['site-name'] || 'My Invite';
    const words = name.split(' ');
    if (words.length === 1) return { p1: words[0], p2: '' };
    const p1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
    const p2 = words.slice(Math.ceil(words.length / 2)).join(' ');
    return { p1, p2 };
  });

  tags = computed<EventTag[]>(() => {
    return this.eventTypes().map(et => ({
      label: et.name,
      imageUrl: et.imageUrl
    }));
  });

  activeTag = signal<EventTag | null>(null);

  selectTag(tag: EventTag) {
    this.activeTag.set(this.activeTag()?.label === tag.label ? null : tag);
  }
}
