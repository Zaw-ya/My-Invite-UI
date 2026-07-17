import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { FontRoles } from './language-registry';
import { LanguageService } from './language.service';

const CSS_VAR_MAP: Record<keyof FontRoles, string> = {
  display: '--font-display',
  heading: '--font-heading',
  body: '--font-body',
  kicker: '--font-kicker',
};

/**
 * The only thing in the codebase responsible for deciding which font
 * stack is "active" for the current language. It knows nothing about
 * `'ar'`/`'en'` as literals — it reacts to LanguageService's active
 * language signal and looks up that language's `fontRoles` in the
 * Language Registry, then writes them to `document.documentElement` as
 * CSS custom properties.
 *
 * This deliberately extends a pattern already established throughout this
 * codebase: every component's CSS already reads shared tokens like
 * `var(--gold)`/`var(--bg-card)` rather than hardcoding values. Typography
 * becomes the same kind of token (`var(--font-display)` etc.), so component
 * stylesheets never need to know or care what language is active — only
 * this service does.
 *
 * Per-language font loading falls out of this for free: browsers only
 * fetch an `@font-face` resource once something actually renders with that
 * `font-family`. Since Arabic's fontRoles never reference
 * ThmanyahSerifDisplay/Cormorant Garamond and English's never reference
 * ManchetteFine/29LTBukra, switching the active language's CSS variables is
 * all that's needed to guarantee neither language ever downloads the
 * other's font files — no manual <link> injection/removal required.
 */
@Injectable({ providedIn: 'root' })
export class FontService {
  private readonly document = inject(DOCUMENT);
  private readonly languageService = inject(LanguageService);

  constructor() {
    effect(() => {
      const { fontRoles } = this.languageService.activeLanguage();
      this.applyFontRoles(fontRoles);
    });
  }

  private applyFontRoles(fontRoles: FontRoles): void {
    const root = this.document.documentElement;
    for (const key of Object.keys(CSS_VAR_MAP) as (keyof FontRoles)[]) {
      root.style.setProperty(CSS_VAR_MAP[key], fontRoles[key]);
    }
  }
}
