import { Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-app-showcase',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './app-showcase.html',
  styleUrl: './app-showcase.css'
})
export class AppShowcaseComponent {
  private readonly contentService = inject(ContentService);
  private readonly carouselCards = this.contentService.carouselCards;

  readonly mockCard = computed(() => this.carouselCards()[0] ?? null);
}
