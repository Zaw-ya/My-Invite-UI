import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LanguageService } from './language.service';

/**
 * Attaches `Accept-Language` to every outgoing HTTP request, reflecting
 * whatever language is currently active. The backend ignores this header
 * today — every ContentService endpoint returns Arabic-only fields
 * regardless, per the confirmed project decision — so this changes nothing
 * about current behavior. Its entire purpose is forward-looking: when
 * backend localization is scheduled as its own future project, the header
 * is already flowing on every request, for every endpoint, and has been
 * since this phase. No ContentService method, no call-site, needs to
 * change at that point — only the backend's handling of a header the
 * frontend has been sending all along.
 */
export const acceptLanguageInterceptor: HttpInterceptorFn = (req, next) => {
  const languageService = inject(LanguageService);
  const activeCode = languageService.activeLanguage().code;

  return next(
    req.clone({
      setHeaders: { 'Accept-Language': activeCode },
    }),
  );
};
