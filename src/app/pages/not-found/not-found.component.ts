import { Component, OnInit, REQUEST, RESPONSE_INIT, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { SeoService } from '../../services/seo.service';
import { isSupportedLanguageCode } from '../../i18n/language-registry';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, TranslocoModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  readonly languageService = inject(LanguageService);
  // Null on the client; present during SSR, where setting `.status` here
  // makes Angular send a real HTTP 404 instead of 200 for this response.
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });
  private readonly request = inject(REQUEST, { optional: true });

  ngOnInit(): void {
    // Only set 404 when the ORIGINAL request already carried a locale
    // prefix (no redirect happened to get here). If it didn't — e.g. a bare
    // `/random-page` — the wildcard's redirectTo already fired to reach this
    // component, and Angular's SSR engine turns that into a real HTTP
    // redirect response (empty body, its own status code) regardless of
    // what renders afterwards. Setting 404 here in that case would clobber
    // the redirect's status without a body to back it up; the browser
    // follows the redirect and gets a correct 404 on the next request.
    const requestedFirstSegment = this.request?.url
      ? new URL(this.request.url).pathname.split('/').filter(Boolean)[0]
      : undefined;

    if (this.responseInit && isSupportedLanguageCode(requestedFirstSegment)) {
      this.responseInit.status = 404;
    }

    this.seoService.setPage({
      titleKey: 'seo.notFound.title',
      descriptionKey: 'seo.notFound.description',
      // No `path` — a 404 has no real content to declare a canonical for.
      noIndex: true,
    });
  }
}
