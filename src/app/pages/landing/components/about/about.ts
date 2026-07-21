import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {
  readonly cards = [0, 1, 2];
}
