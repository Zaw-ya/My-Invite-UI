import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Prerendering is intentionally disabled while the route structure is
 * changing (Phase 2 of the bilingual rollout introduces the `:lang` prefix
 * and per-request redirect resolution for unprefixed URLs). Every route
 * now renders per-request instead of being baked at build time:
 *
 *   - The bare root (`/`) and the wildcard fallback resolve their redirect
 *     target from a real visitor's cookie/Accept-Language header — a
 *     build-time prerender would freeze that decision to whatever the
 *     build environment happened to resolve (always the default language,
 *     since there's no real request at build time), silently defeating the
 *     whole point of per-visitor language resolution.
 *   - The `:lang`-prefixed content routes previously prerendered per the
 *     original route list; re-introducing `RenderMode.Prerender` for them
 *     (including the blog/:id `getPrerenderParams` fetch this file used to
 *     do) is a reasonable follow-up once the bilingual URL structure and
 *     English content are settled, not part of this infrastructure-only
 *     phase.
 *
 * This is a deliberate, temporary tradeoff — not a regression to be
 * silently reverted. Revisit once Phase 4+ content work stabilizes.
 */
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Server }];
