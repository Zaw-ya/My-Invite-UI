import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-why-riyadh',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './why-riyadh.html',
  styleUrl: './why-riyadh.css'
})
export class WhyRiyadhComponent {
  readonly items = [0, 1, 2, 3];
}
