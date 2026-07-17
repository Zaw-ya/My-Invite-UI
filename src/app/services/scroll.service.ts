import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  scrollTo(event: Event, targetId: string): void {
    event.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
