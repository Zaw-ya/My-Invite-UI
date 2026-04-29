import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Testimonial } from '../../../../models/content.interface';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './testimonials.html'
})
export class TestimonialsComponent {
  @Input() testimonials: Testimonial[] = [];
}
