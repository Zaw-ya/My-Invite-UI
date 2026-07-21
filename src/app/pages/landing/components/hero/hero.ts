import { Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../../../services/content.service';
import { ScrollService } from '../../../../services/scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent {
  private readonly contentService = inject(ContentService);
  readonly scrollService = inject(ScrollService);
  private readonly carouselCards = this.contentService.carouselCards;

  // Reference's phone mockup shows one static design shot — using the
  // first real card from the library rather than a placeholder so the
  // hero still reflects actual product imagery.
  readonly mockCard = computed(() => this.carouselCards()[0] ?? null);

  // Reference tracks the cursor and re-centers the nebula glow under it
  // via a CSS transform, recomputed on every mousemove.
  glowTransform = 'translate(0px, 0px)';

  onHeroMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const damp = 0.15;
    this.glowTransform = `translate(${x * damp}px, ${y * damp}px)`;
  }
}
