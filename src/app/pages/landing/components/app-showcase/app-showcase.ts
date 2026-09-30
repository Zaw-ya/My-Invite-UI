import { Component, computed, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../../../services/content.service';
import { LocalizeContentPipe } from '../../../../i18n/backend-content';

@Component({
  selector: 'app-app-showcase',
  standalone: true,
  imports: [TranslocoModule, LocalizeContentPipe],
  templateUrl: './app-showcase.html',
  styleUrl: './app-showcase.css'
})
export class AppShowcaseComponent {
  private readonly contentService = inject(ContentService);
  private readonly carouselCards = this.contentService.carouselCards;

  readonly mockCard = computed(() => this.carouselCards()[0] ?? null);
}
