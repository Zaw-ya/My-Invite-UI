import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-tech-platform',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './tech-platform.html',
  styleUrl: './tech-platform.css'
})
export class TechPlatformComponent {
  readonly steps = [0, 1, 2, 3];
}
