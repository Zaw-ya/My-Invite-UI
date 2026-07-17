import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LanguageConfig } from './language-registry';
import { LanguageService } from './language.service';

/**
 * Runs before the `:lang` route subtree activates — on the server during
 * SSR and on the client during navigation alike, since Angular resolvers
 * execute identically in both contexts. This is what makes `lang`/`dir`
 * (and, via FontService reacting to the same signal, the font CSS
 * variables) correct in the very first server-rendered response rather
 * than only after client-side hydration.
 *
 * `:lang` is guaranteed to be a supported code by this point — invalid
 * codes never reach here because `localeCanMatchGuard` rejects them first.
 */
export const localeResolver: ResolveFn<LanguageConfig> = (route) => {
  const languageService = inject(LanguageService);
  const lang = route.paramMap.get('lang')!;
  return languageService.setLanguage(lang);
};
