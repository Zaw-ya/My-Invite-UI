import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-platform-modules',
  standalone: true,
  imports: [LucideAngularModule, TranslocoModule],
  templateUrl: './platform-modules.html',
  styleUrl: './platform-modules.css'
})
export class PlatformModulesComponent {
  // One line-icon family (Lucide, same stroke/size) instead of emojis, to
  // match the rest of the site's icons.
  readonly categories = [
    { key: 'platform.categories.c0', icon: 'heart' },
    { key: 'platform.categories.c1', icon: 'gem' },
    { key: 'platform.categories.c2', icon: 'graduation-cap' },
    { key: 'platform.categories.c3', icon: 'baby' },
    { key: 'platform.categories.c4', icon: 'cake' },
    { key: 'platform.categories.c5', icon: 'building-2' },
    { key: 'platform.categories.c6', icon: 'gift' },
  ];
}
