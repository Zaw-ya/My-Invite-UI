import { Injectable, Pipe, PipeTransform, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService, Translation } from '@jsverse/transloco';
import { switchMap } from 'rxjs';

const DICTIONARY_PREFIX = 'backendContent.';
const PATTERN_PREFIX = 'backendContentPatterns.';

/**
 * Backend strings that follow a predictable shape rather than being a fixed
 * value (e.g. auto-generated card titles "تصميم 3"). Each maps to a
 * `backendContentPatterns.<key>` translation containing `{{number}}`.
 */
const PATTERNS: { regex: RegExp; key: string }[] = [
  { regex: /^تصميم\s*(\d+)$/, key: 'design' },
];

/**
 * Stopgap display-layer translation for backend content. The API returns
 * Arabic-only values for event types, packages, card titles, etc. (see
 * accept-language.interceptor.ts) — until the backend localizes them, the
 * active language's `backendContent` map translates known values by their
 * exact (trimmed) Arabic text. Anything not in the map is returned as-is,
 * so new backend content degrades to its original text, never to a raw key.
 *
 * Display only: filter/comparison logic must keep using the raw backend
 * value, never the localized one.
 */
@Injectable({ providedIn: 'root' })
export class BackendContentLocalizer {
  private readonly transloco = inject(TranslocoService);

  private readonly translation = toSignal(
    this.transloco.langChanges$.pipe(switchMap(lang => this.transloco.selectTranslation(lang))),
    { initialValue: {} as Translation },
  );

  localize(text: string | null | undefined): string {
    if (!text) return text ?? '';
    const key = text.trim().replace(/\s+/g, ' ');
    const direct = this.lookup(DICTIONARY_PREFIX, key);
    if (direct) return direct;

    for (const { regex, key: patternKey } of PATTERNS) {
      const match = key.match(regex);
      const template = match && this.lookup(PATTERN_PREFIX, patternKey);
      if (template) return template.replace('{{number}}', match[1]);
    }
    return text;
  }

  // Transloco stores translations flattened ("backendContent.<text>"), but
  // fall back to a nested read in case flattening is ever turned off.
  private lookup(prefix: string, key: string): string | undefined {
    const t = this.translation();
    const flat = t[prefix + key];
    if (typeof flat === 'string') return flat;
    const nested = t[prefix.slice(0, -1)]?.[key];
    return typeof nested === 'string' ? nested : undefined;
  }
}

@Pipe({ name: 'localizeContent', standalone: true, pure: false })
export class LocalizeContentPipe implements PipeTransform {
  private readonly localizer = inject(BackendContentLocalizer);

  transform(value: string | null | undefined): string {
    return this.localizer.localize(value);
  }
}

/** True when the text contains Arabic script — used to keep untranslated
    backend content (blog posts, reviews) off non-Arabic pages. */
export function containsArabic(text: string | null | undefined): boolean {
  return !!text && /[؀-ۿ]/.test(text);
}
