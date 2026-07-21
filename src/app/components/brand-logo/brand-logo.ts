import { Component, Input, computed, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LanguageService } from '../../i18n/language.service';

/**
 * Reference logo is an inline SVG using fill="currentColor" so it can be
 * recolored per-context via CSS (cream on the dark navbar/footer). An
 * <img src="*.svg"> can't do that — the SVG's own color context is opaque
 * to the page — so this loads the SVG text and injects it as real DOM,
 * letting `color` on the host cascade into it exactly like the reference.
 */
@Component({
  selector: 'app-brand-logo',
  standalone: true,
  template: `<span class="brand-logo-inline" [innerHTML]="svg()"></span>`,
  styles: [`
    .brand-logo-inline { display: inline-flex; width: 180px; height: 71px; }
    .brand-logo-inline ::ng-deep svg { display: block; width: 100% !important; height: 100% !important; }
  `],
})
export class BrandLogoComponent {
  @Input() variant: 'ar' | 'en' | 'auto' = 'auto';

  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly languageService = inject(LanguageService);

  private readonly svgCache = new Map<string, string>();
  private readonly rawSvg = signal('');
  readonly svg = computed<SafeHtml>(() => this.sanitizer.bypassSecurityTrustHtml(this.rawSvg()));

  constructor() {
    effect(() => {
      const variant = this.variant === 'auto' ? this.languageService.activeLanguage().code : this.variant;
      this.loadSvg(variant);
    });
  }

  private loadSvg(variant: string): void {
    const cached = this.svgCache.get(variant);
    if (cached) {
      this.rawSvg.set(cached);
      return;
    }
    const path = variant === 'ar' ? '/assets/images/svg/logo-ar.svg' : '/assets/images/svg/logo-en.svg';
    this.http.get(path, { responseType: 'text' }).subscribe((text) => {
      this.svgCache.set(variant, text);
      this.rawSvg.set(text);
    });
  }
}
