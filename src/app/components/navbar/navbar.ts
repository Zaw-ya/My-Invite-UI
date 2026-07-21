import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { LanguageService } from '../../i18n/language.service';
import { LANGUAGE_REGISTRY } from '../../i18n/language-registry';
import { ScrollService } from '../../services/scroll.service';
import { BrandLogoComponent } from '../brand-logo/brand-logo';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, TranslocoModule, BrandLogoComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private readonly languageService = inject(LanguageService);
  private readonly scrollService = inject(ScrollService);

  readonly activeLanguage = this.languageService.activeLanguage;

  // Reference has one toggle button showing the *other* language's short
  // label, not a per-language button loop — matched here rather than kept
  // as a forward-compatible N-language list, per reference fidelity.
  readonly otherLanguage = computed(() =>
    LANGUAGE_REGISTRY.find((l) => l.code !== this.activeLanguage().code) ?? LANGUAGE_REGISTRY[0]
  );

  isMenuOpen = false;

  toggleLanguage(): void {
    this.isMenuOpen = false;
    this.languageService.switchLanguage(this.otherLanguage().code);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
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
