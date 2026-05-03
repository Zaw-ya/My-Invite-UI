import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { EventType } from '../../../../models/content.interface';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class EventsComponent {
  @Input() eventTypes: EventType[] = [];
}
