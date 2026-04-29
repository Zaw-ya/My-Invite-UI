import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Supervisor } from '../../../../models/content.interface';

@Component({
  selector: 'app-supervisors',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './supervisors.html'
})
export class SupervisorsComponent {
  @Input() supervisors: Supervisor[] = [];

  showInitial(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    const fallback = img.nextElementSibling as HTMLElement;
    if (fallback) fallback.classList.remove('hidden');
  }
}
