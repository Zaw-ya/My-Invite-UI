import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ScrollService } from '../../../../services/scroll.service';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './final-cta.html',
  styleUrl: './final-cta.css'
})
export class FinalCtaComponent {
  readonly scrollService = inject(ScrollService);
}
