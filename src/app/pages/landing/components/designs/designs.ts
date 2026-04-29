import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { InvitationCard } from '../../../../models/content.interface';

@Component({
  selector: 'app-designs',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './designs.html'
})
export class DesignsComponent {
  @Input() invitations: InvitationCard[] = [];

  getIconForCategory(category: string): string {
    switch (category.toLowerCase()) {
      case 'wedding': return 'heart';
      case 'graduation': return 'graduation-cap';
      case 'corporate': return 'briefcase';
      case 'engagement': return 'heart';
      default: return 'star';
    }
  }
}
