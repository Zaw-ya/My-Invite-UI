import { Component, signal, inject, computed } from '@angular/core';
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
export class HeroComponent {
  private contentService = inject(ContentService);
  
  eventTypes = this.contentService.eventTypes;

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
