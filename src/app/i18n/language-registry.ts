/**
 * Language Registry — the single source of truth for every supported
 * language. Routing, LanguageService, FontService, and Transloco's own
 * config all derive their behavior from this list rather than branching on
 * specific language codes. Adding a language later (French, Turkish, etc.)
 * means adding one entry here — no application logic elsewhere should need
 * to change shape.
 */

export type TextDirection = 'rtl' | 'ltr';

export interface FontRoles {
  /** Hero/display headings — the largest, most decorative type on the page. */
  display: string;
  /** Section-level headings. */
  heading: string;
  /** Body copy, buttons, forms, nav — the workhorse UI voice. */
  body: string;
  /** Kicker/eyebrow labels. */
  kicker: string;
}

export interface LanguageConfig {
  /** ISO 639-1 code, used as the URL prefix segment (e.g. /ar, /en). */
  code: string;
  direction: TextDirection;
  /** Native display name, e.g. "العربية" / "English". */
  label: string;
  /** Exactly one entry should be true. Arabic is the brand's primary language. */
  isDefault: boolean;
  fontRoles: FontRoles;
  /** Reference header's language-toggle button always shows the *other*
   * language's short label (e.g. the Arabic page shows "EN"; the English
   * page shows "ع") rather than the current language's own code. */
  toggleLabel: string;
}

// Arabic fonts are unchanged from the site's existing stack (styles.css).
// English fonts are the ones forensically verified from the client's
// approved reference file (ThmanyahSerifDisplay/ThmanyahSerifText carry full
// Latin glyph coverage; Cormorant Garamond is the reference's own English
// kicker voice). See Phase 0 Discovery Report for the verification detail.
export const LANGUAGE_REGISTRY: readonly LanguageConfig[] = [
  {
    code: 'ar',
    direction: 'rtl',
    label: 'العربية',
    isDefault: true,
    toggleLabel: 'EN',
    fontRoles: {
      display: "'ManchetteFine', 'Thmanyah Serif Display', '29LTBukra', 'Cairo', sans-serif",
      heading: "'29LTBukra', 'Cairo', sans-serif",
      body: "'Cairo', sans-serif",
      kicker: "'29LTBukra', 'Cairo', sans-serif",
    },
  },
  {
    code: 'en',
    direction: 'ltr',
    label: 'English',
    isDefault: false,
    toggleLabel: 'ع',
    fontRoles: {
      display: "'Thmanyah Serif Display', 'Cairo', sans-serif",
      heading: "'Thmanyah Serif Display', 'Cairo', sans-serif",
      body: "'Cairo', sans-serif",
      kicker: "'Cormorant Garamond', serif",
    },
  },
] as const;

export const SUPPORTED_LANGUAGE_CODES: readonly string[] = LANGUAGE_REGISTRY.map((l) => l.code);

export const DEFAULT_LANGUAGE: LanguageConfig =
  LANGUAGE_REGISTRY.find((l) => l.isDefault) ?? LANGUAGE_REGISTRY[0];

export function getLanguageConfig(code: string | null | undefined): LanguageConfig | undefined {
  return LANGUAGE_REGISTRY.find((l) => l.code === code);
}

export function isSupportedLanguageCode(code: string | null | undefined): code is string {
  return !!code && LANGUAGE_REGISTRY.some((l) => l.code === code);
}
