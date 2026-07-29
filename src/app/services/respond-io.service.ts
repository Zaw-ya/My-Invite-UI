import { Injectable, inject, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Respond.io Website Chat widget id(s), keyed by site language code — the
 * `cId` query param on the widget script. Both languages point at the same
 * channel today (there's only one Respond.io channel configured). If a
 * dedicated Arabic-configured channel is created later in the Respond.io
 * dashboard, drop its cId in under 'ar' and the correct widget will start
 * loading automatically for Arabic visitors — no other code changes needed.
 *
 * Note this only picks the widget language once, at first page load: the
 * Respond.io widget exposes no supported API to swap languages on an
 * already-mounted widget (it's a cross-origin iframe with no such method),
 * so a mid-session language toggle (SPA navigation, no reload) cannot
 * retroactively change an already-loaded widget's language.
 */
const RESPOND_IO_WIDGET_IDS: Record<string, string> = {
  ar: '83617e5ee4c18e40dad32c5fc356307',
  en: '83617e5ee4c18e40dad32c5fc356307',
};
const RESPOND_IO_DEFAULT_WIDGET_ID = RESPOND_IO_WIDGET_IDS['en'];
const RESPOND_IO_SCRIPT_ID = 'respondio__widget';

/**
 * Loads the Respond.io Website Chat widget script exactly once per
 * application lifetime. The widget manages its own floating launcher/panel
 * outside Angular's view tree, so it only needs to be injected — not
 * re-injected on route changes or re-rendered on navigation.
 */
@Injectable({ providedIn: 'root' })
export class RespondIoService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private loaded = false;

  /**
   * Injects the Respond.io widget script into <head> if it hasn't been
   * loaded yet. Safe to call multiple times (e.g. from APP_INITIALIZER
   * and again defensively from a component) — subsequent calls are no-ops.
   * No-op on the server: the widget is a browser-only chat UI and SSR has
   * no DOM for it to attach to.
   */
  loadWidget(): void {
    if (!isPlatformBrowser(this.platformId) || this.loaded) {
      return;
    }

    if (this.document.getElementById(RESPOND_IO_SCRIPT_ID)) {
      this.loaded = true;
      return;
    }

    const script = this.document.createElement('script');
    script.id = RESPOND_IO_SCRIPT_ID;
    script.src = `https://cdn.respond.io/webchat/widget/widget.js?cId=${this.resolveWidgetId()}`;
    script.async = true;
    this.document.body.appendChild(script);

    this.loaded = true;
  }

  /**
   * Reads the language straight off the URL's locale prefix (routes are
   * always `/:lang/...`) rather than injecting LanguageService: this runs
   * from an APP_INITIALIZER, which fires before the locale route resolver
   * has set LanguageService's signal, so that signal isn't trustworthy yet
   * at this point.
   */
  private resolveWidgetId(): string {
    const lang = this.document.location.pathname.split('/')[1];
    return RESPOND_IO_WIDGET_IDS[lang] ?? RESPOND_IO_DEFAULT_WIDGET_ID;
  }
}
