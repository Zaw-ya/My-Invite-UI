import { CanMatchFn } from '@angular/router';
import { isSupportedLanguageCode } from './language-registry';

/**
 * Determines whether the `:lang` route config matches at all. Returning
 * `false` lets the router fall through to the next route in the array
 * (ultimately the wildcard) rather than treating an arbitrary first path
 * segment — like a pre-migration URL such as `/designs` — as if it were a
 * language code.
 */
export const localeCanMatchGuard: CanMatchFn = (_route, segments) => {
  const firstSegment = segments[0]?.path;
  return isSupportedLanguageCode(firstSegment);
};
