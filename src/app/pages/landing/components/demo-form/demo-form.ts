import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { EventType } from '../../../../models/content.interface';

@Component({
  selector: 'app-demo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './demo-form.html',
  styleUrl: './demo-form.css'
})
export class DemoFormComponent {
  @Input() eventTypes: EventType[] = [];

  demoForm = {
    name: '',
    type: '1',
    date: '',
    guests: null
  };

  onTryService() {
    console.log('Demo Request:', this.demoForm);
    alert('Demo request sent! You will receive a WhatsApp message shortly (mock).');
  }
}
