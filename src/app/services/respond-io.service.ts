import { Injectable, inject, PLATFORM_ID, DOCUMENT } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Respond.io Website Chat widget id — the `cId` query param on the widget
 * script. Swap this if the widget is ever re-issued from Respond.io.
 */
const RESPOND_IO_WIDGET_ID = '83617e5ee4c18e40dad32c5fc356307';
const RESPOND_IO_SCRIPT_ID = 'respondio__widget';
const RESPOND_IO_SCRIPT_SRC = `https://cdn.respond.io/webchat/widget/widget.js?cId=${RESPOND_IO_WIDGET_ID}`;

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
    script.src = RESPOND_IO_SCRIPT_SRC;
    script.async = true;
    this.document.body.appendChild(script);

    this.loaded = true;
  }
}
