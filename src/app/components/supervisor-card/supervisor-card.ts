import { Component, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { Supervisor } from '../../models/content.interface';

// Shared by the landing page's Supervisors section and the standalone
// /supervisors page, so the card's markup/styling lives in exactly one
// place instead of being duplicated across both.
@Component({
  selector: 'app-supervisor-card',
  standalone: true,
  imports: [LucideAngularModule, TranslocoModule],
  templateUrl: './supervisor-card.html',
  styleUrl: './supervisor-card.css'
})
export class SupervisorCardComponent {
  supervisor = input.required<Supervisor>();

  // Was just hiding the broken <img>, leaving an empty card with nothing
  // in it. Now flags the container so CSS can show a graceful fallback —
  // the supervisor's first initial over a gradient — instead of a blank
  // gap where a photo should be.
  showInitial(event: Event) {
    const img = event.target as HTMLImageElement;
    img.closest('.sup-card-img-fill')?.classList.add('img-fallback');
  }
}
