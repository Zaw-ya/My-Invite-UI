import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-platform-modules',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './platform-modules.html',
  styleUrl: './platform-modules.css'
})
export class PlatformModulesComponent {
  readonly items = [0, 1, 2, 3];
}
