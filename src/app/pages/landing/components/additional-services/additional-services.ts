import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-additional-services',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './additional-services.html',
  styleUrl: './additional-services.css'
})
export class AdditionalServicesComponent {
  smoothNav(e: Event) {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
