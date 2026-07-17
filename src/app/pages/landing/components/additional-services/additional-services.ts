import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { ScrollService } from '../../../../services/scroll.service';

@Component({
  selector: 'app-additional-services',
  standalone: true,
  imports: [LucideAngularModule, TranslocoModule],
  templateUrl: './additional-services.html',
  styleUrl: './additional-services.css'
})
export class AdditionalServicesComponent {
  readonly scrollService = inject(ScrollService);
}
