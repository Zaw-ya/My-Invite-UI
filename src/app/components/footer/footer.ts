import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../services/content.service';
import { LanguageService } from '../../i18n/language.service';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, TranslocoModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  contentService = inject(ContentService);
  settings = this.contentService.siteSettings;
  private readonly languageService = inject(LanguageService);
  readonly activeLanguage = this.languageService.activeLanguage;
  readonly scrollService = inject(ScrollService);

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
