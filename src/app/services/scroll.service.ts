import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../i18n/language.service';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);

  /**
   * Scrolls to a landing-page section by id. The navbar (and several
   * in-page CTAs) render on every route, but the section ids they target
   * only exist on the landing page itself — on any other route this used
   * to silently do nothing (preventDefault fired, then
   * document.getElementById returned null). Now: if we're already on the
   * landing page, scroll directly; otherwise navigate home first, then
   * scroll once the landing page has actually rendered.
   */
  scrollTo(event: Event, targetId: string): void {
    event.preventDefault();
    const lang = this.languageService.activeLanguage().code;
    const homePath = `/${lang}`;
    const onHomePage = this.router.url === homePath || this.router.url.startsWith(`${homePath}?`) || this.router.url.startsWith(`${homePath}#`);

    if (onHomePage) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    this.router.navigate(['/', lang]).then(() => {
      // Landing page's own components (some behind @if/data fetches) need
      // a frame to actually mount before the target id exists in the DOM.
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    });
  }

  /** The navbar's "Home" link (empty hash) — same route-awareness as
   * scrollTo above: scroll to the top in place if already home,
   * otherwise actually navigate there instead of scrolling the current
   * (wrong) page to its own top. */
  goHome(event: Event): void {
    event.preventDefault();
    const lang = this.languageService.activeLanguage().code;
    const homePath = `/${lang}`;
    const onHomePage = this.router.url === homePath || this.router.url.startsWith(`${homePath}?`) || this.router.url.startsWith(`${homePath}#`);

    if (onHomePage) {
      document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    this.router.navigate(['/', lang]);
  }
}
