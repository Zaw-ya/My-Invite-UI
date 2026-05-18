import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  contentService = inject(ContentService);
  settings = this.contentService.siteSettings;

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
