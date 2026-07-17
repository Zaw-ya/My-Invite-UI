# Bilingual (AR/EN) Architecture Summary

This document describes how localization works in Special Cards (My-Invite-UI) after the full i18n migration, so future developers can extend it without re-deriving the design.

## 1. Language Registry

`src/app/i18n/language-registry.ts` (or equivalent) defines the single source of truth for supported locales:

```ts
LANGUAGE_REGISTRY = {
  ar: { code: 'ar', direction: 'rtl', fontRoles: { display: '...', heading: '...', body: '...', kicker: '...' } },
  en: { code: 'en', direction: 'ltr', fontRoles: { ... } },
}
```

`LanguageService` (`src/app/i18n/language.service.ts`) exposes the active locale as a signal — `activeLanguage()` — computed from the current route's `/:lang` segment. Every component that needs locale-aware behavior (routing links, `dir`, font roles, SEO) injects this service rather than reading the URL directly.

## 2. Routing

All real application routes live under a `/:lang` prefix (`/ar/*`, `/en/*`). Two concerns are deliberately kept separate in `app.routes.ts` / `server.ts`:

- **Static resources** (`/env.js` — since removed, `/favicon.ico`, `/robots.txt`, `/assets/*`, etc.) are short-circuited in `server.ts` *before* they reach the Angular router, so they never get mistaken for an unmatched app route and redirected/localized.
- **Unknown application routes** terminate inside the localized tree via a `NotFoundComponent` mounted at `/:lang/**`, returning a real 404 status (via `RESPONSE_INIT`) instead of redirecting to a default locale. This preserves correct HTTP semantics for bad/expired links.

All internal navigation uses `[routerLink]="['/', languageService.activeLanguage().code, ...segments]"` or `router.navigate(['/', languageService.activeLanguage().code, ...])` — never a bare `/segment` — so navigation never drops the active locale.

## 3. Transloco

`@jsverse/transloco` is configured with one flat translation file per language (`src/assets/i18n/ar.json`, `en.json`) — no per-route scoping. This was an explicit, confirmed tradeoff: scoping the large legal-page translation keys would save ~11KB gzipped on non-legal pages, but the team chose to keep a single file per language for simplicity.

Two consumption patterns exist, used deliberately for different cases:
- `'key' | transloco` in templates, and `TranslocoService.translate('key')` for synchronous one-off reads (safe only when the language is already guaranteed loaded).
- `TranslocoService.selectTranslate('key')` (observable) for anything constructed at app/service startup before the translation file is guaranteed loaded (e.g. `SeoService`) — `translate()` there would race the initial HTTP fetch and return the raw key.

Rule of thumb baked into the codebase: **frontend-owned UI chrome is translated; backend-provided dynamic content (blog posts, invitation card titles/categories, supervisor/city names) is not** — it is rendered exactly as received from the API, in its original language, on both `/ar` and `/en`. Filter/comparison logic never uses a translated display string as its key; it uses stable IDs, enums, or `null` sentinels instead (see `PortfolioSliderComponent.activeCategory`).

## 4. FontService

`FontService` reacts to `LanguageService.activeLanguage()` and applies the active language's font role mapping as CSS custom properties on `:root` (`--font-display`, `--font-heading`, `--font-body`, `--font-kicker`). Every component stylesheet routes through these variables:

```css
font-family: var(--font-heading, '29LTBukra', 'Cairo', sans-serif);
```

Never hardcode a literal font name directly in a component stylesheet — it bypasses the language-driven override and will not switch when the active language changes.

The physical font files live in `ui/` and are copied into the build under `/fonts` via the `angular.json` asset glob `*.{ttf,TTF,otf,OTF,woff,WOFF,woff2,WOFF2}` (kept case-insensitive deliberately — the source files use uppercase extensions, and Angular's glob matching is case-sensitive).

## 5. SeoService

`src/app/services/seo.service.ts` has two entry points:
- `setPage({ titleKey, descriptionKey, path, ... })` — for static, translation-key-driven pages. Reactively re-applies title/description/canonical whenever either the page config or the active language changes, via `combineLatest` over `selectTranslate()` streams (both `toObservable()` calls are constructed once in the constructor, inside the injection context — never lazily inside an operator callback, which throws `NG0203`).
- `updateSeo(config)` — for dynamic, backend-content pages (e.g. blog post detail), where the title/description come from the fetched entity, not a translation key.

Canonical URLs are built centrally as `${SITE_URL}/{lang}{path}`. Scope is deliberately limited to title/description/lang/dir/canonical — hreflang tags, sitemap generation, and structured-data expansion are out of scope for this system (sitemap generation is handled separately, see the sitemap/prerendering commits).

## 6. Accept-Language / initial locale resolution

On first load with no `/:lang` in the URL, the server reads the `Accept-Language` header (via SSR) to pick a default locale before issuing a redirect into `/ar/*` or `/en/*`. Once a locale is in the URL, it is the only source of truth — the app never overrides an explicit `/en/*` URL based on browser language.

## 7. Known gaps (tracked, not fixed in this pass)

- **`/designs` page** (`designs-page.component.*`) was never migrated: it is fully hardcoded Arabic UI chrome and uses Arabic display strings (`'كل التصميمات'`, `'تصميمات ذكورية'`, `'تصميمات أنثوية'`) as filter/comparison keys, unlike every other filtered list in the app. A `designsPage` translation namespace already exists in `ar.json`/`en.json` (unused). Left untouched at the user's explicit direction — needs a dedicated pass to translate the template and refactor `activeCategory`/`activeGender` to stable IDs, matching the pattern already used in `PortfolioSliderComponent`.
- Read-time and OTP-timer strings are localized via single Transloco calls with `{{count}}` params, but true grammatical pluralization (Arabic singular/dual/plural forms, English "1 minute" vs "2 minutes") is not implemented — would require the `transloco-messageformat` plugin.
- Pre-existing accessibility findings from Lighthouse (`color-contrast`, `heading-order`, `link-name`) predate the i18n migration and are unrelated to it; not addressed here.
