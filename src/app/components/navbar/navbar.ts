import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../services/content.service';
import { LanguageService } from '../../i18n/language.service';
import { LANGUAGE_REGISTRY } from '../../i18n/language-registry';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, TranslocoModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  contentService = inject(ContentService);
  settings = this.contentService.siteSettings;
  private readonly languageService = inject(LanguageService);
  private readonly scrollService = inject(ScrollService);

  readonly languages = LANGUAGE_REGISTRY;
  readonly activeLanguage = this.languageService.activeLanguage;

  isMenuOpen = false;
  isScrolled = false;

  switchLanguage(code: string): void {
    this.isMenuOpen = false;
    this.languageService.switchLanguage(code);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 40;
    if (!this.isScrolled) this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  smoothScroll(event: Event, href: string) {
    this.isMenuOpen = false;
    const id = href.replace('#', '');
    if (!id) {
      this.scrollService.goHome(event);
      return;
    }
    this.scrollService.scrollTo(event, id);
  }
}
