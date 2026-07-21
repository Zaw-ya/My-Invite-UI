import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../services/content.service';
import { LanguageService } from '../../i18n/language.service';
import { ScrollService } from '../../services/scroll.service';
import { BrandLogoComponent } from '../brand-logo/brand-logo';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, TranslocoModule, BrandLogoComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  contentService = inject(ContentService);
  settings = this.contentService.siteSettings;
  private readonly languageService = inject(LanguageService);
  readonly activeLanguage = this.languageService.activeLanguage;
  readonly scrollService = inject(ScrollService);

  // Same derivation landing.ts uses for the gallery filter pills — kept
  // in sync here so the footer's "Designs" column reflects real backend
  // categories instead of the reference's static wedding/graduation list.
  readonly categories = computed(() => this.contentService.eventTypes().map(et => et.name));

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
