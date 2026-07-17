import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, REQUEST, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  DEFAULT_LANGUAGE,
  LanguageConfig,
  SUPPORTED_LANGUAGE_CODES,
  getLanguageConfig,
  isSupportedLanguageCode,
} from './language-registry';

const STORAGE_KEY = 'preferredLanguage';
const COOKIE_KEY = 'lang';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

/**
 * Owns "what language is active right now" and nothing else — no font
 * knowledge, no DOM styling. Direction/lang attributes are applied here
 * because they're intrinsic to the language itself (every LanguageConfig
 * carries its own `direction`), not because this service does styling.
 *
 * Resolution priority (used only to pick a redirect target for an
 * unprefixed URL — once a URL contains a locale segment, that value always
 * wins and this priority chain is never consulted):
 *   1. localStorage (browser only — unavailable during SSR)
 *   2. Cookie (readable both client-side and server-side via the request's
 *      Cookie header, which is exactly why it exists alongside
 *      localStorage rather than replacing it)
 *   3. Browser language (navigator.language client-side, Accept-Language
 *      header server-side)
 *   4. The registry's default language
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transloco = inject(TranslocoService);
  private readonly router = inject(Router);
  // Optional: null on the client and in contexts (e.g. prerendering) where
  // there is no real inbound HTTP request to read cookies/headers from.
  private readonly request = inject(REQUEST, { optional: true });

  readonly activeLanguage = signal<LanguageConfig>(DEFAULT_LANGUAGE);

  /**
   * Sets the active language, applies `lang`/`dir` to the document, syncs
   * Transloco, and (by default) persists the choice for next time. Called
   * by the locale route resolver on every navigation into a `/:lang/...`
   * route, and by the language-switch mechanism.
   */
  setLanguage(code: string, options: { persist?: boolean } = {}): LanguageConfig {
    const config = getLanguageConfig(code) ?? DEFAULT_LANGUAGE;
    const { persist = true } = options;

    this.activeLanguage.set(config);
    this.transloco.setActiveLang(config.code);
    this.applyDocumentAttributes(config);

    if (persist) {
      this.persist(config.code);
    }

    return config;
  }

  private applyDocumentAttributes(config: LanguageConfig): void {
    const root = this.document.documentElement;
    root.lang = config.code;
    root.dir = config.direction;
  }

  private persist(code: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Storage can throw in privacy modes / disabled-storage environments —
      // the cookie write below is enough to keep persistence working.
    }

    this.document.cookie = `${COOKIE_KEY}=${encodeURIComponent(code)}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
  }

  /**
   * The priority chain, used only to decide where an unprefixed URL
   * (the bare root, or a pre-migration deep link with no locale segment)
   * should redirect to.
   */
  resolveRedirectLanguage(): string {
    const fromStorage = this.readFromLocalStorage();
    if (isSupportedLanguageCode(fromStorage)) {
      return fromStorage;
    }

    const fromCookie = this.readFromCookie();
    if (isSupportedLanguageCode(fromCookie)) {
      return fromCookie;
    }

    const fromBrowser = this.readFromBrowserLanguage();
    if (isSupportedLanguageCode(fromBrowser)) {
      return fromBrowser;
    }

    return DEFAULT_LANGUAGE.code;
  }

  private readFromLocalStorage(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private readFromCookie(): string | null {
    const cookieHeader = isPlatformBrowser(this.platformId)
      ? this.document.cookie
      : (this.request?.headers.get('cookie') ?? null);

    if (!cookieHeader) return null;

    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_KEY}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
  }

  private readFromBrowserLanguage(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const lang = typeof navigator !== 'undefined' ? navigator.language : null;
      return lang ? lang.slice(0, 2).toLowerCase() : null;
    }

    const header = this.request?.headers.get('accept-language');
    if (!header) return null;
    // "en-US,en;q=0.9,ar;q=0.8" -> "en"
    const first = header.split(',')[0]?.trim().split('-')[0]?.split(';')[0];
    return first ? first.toLowerCase() : null;
  }

  /** Exposed for anything that needs the static list without importing the registry directly. */
  get supportedCodes(): readonly string[] {
    return SUPPORTED_LANGUAGE_CODES;
  }

  /**
   * Navigates to the equivalent URL under `targetCode`, preserving
   * everything after the locale segment: route path segments (so `:id`-style
   * params carry over automatically, since they're already baked into the
   * path), query parameters, and the fragment. This is a generic operation
   * — it works identically regardless of which route matched, because the
   * locale is always exactly the first path segment.
   *
   * Not yet wired into any component template (Phase 2 is infrastructure
   * only) — this is the mechanism Phase 3's Navbar language toggle will
   * call.
   */
  switchLanguage(targetCode: string): void {
    if (!isSupportedLanguageCode(targetCode)) return;

    const currentTree = this.router.parseUrl(this.router.url);
    const primary = currentTree.root.children['primary'];
    const segments = primary ? primary.segments.map((s) => s.path) : [];
    // First segment is the current locale prefix — drop it, keep the rest.
    const pathAfterLocale = segments.slice(1);

    const newTree = this.router.createUrlTree([`/${targetCode}`, ...pathAfterLocale], {
      queryParams: currentTree.queryParams,
      fragment: currentTree.fragment ?? undefined,
    });

    this.router.navigateByUrl(newTree);
  }
}
