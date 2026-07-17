import { Injectable, computed, inject } from '@angular/core';
import { LanguageService } from '../i18n/language.service';
import { COUNTRY_REGISTRY, CountryOption, DEFAULT_COUNTRY_ISO } from './countries';

export interface DisplayCountry extends CountryOption {
  displayName: string;
}

/**
 * Locale-aware view over the country registry — every form's phone-code
 * picker consumes this instead of maintaining its own list. Sorting and
 * display name both react to the active language; `isoCode`/`dialCode`
 * (what backend payloads actually use) never change with language.
 */
@Injectable({ providedIn: 'root' })
export class CountriesService {
  private readonly languageService = inject(LanguageService);

  readonly countries = computed<DisplayCountry[]>(() => {
    const lang = this.languageService.activeLanguage().code;
    const withNames = COUNTRY_REGISTRY.map((c) => ({
      ...c,
      displayName: lang === 'ar' ? c.nameAr : c.nameEn,
    }));
    return withNames.sort((a, b) => a.displayName.localeCompare(b.displayName, lang));
  });

  readonly defaultCountry = computed<DisplayCountry>(() => {
    const list = this.countries();
    return list.find((c) => c.isoCode === DEFAULT_COUNTRY_ISO) ?? list[0];
  });

  filter(query: string): DisplayCountry[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.countries();
    return this.countries().filter(
      (c) => c.displayName.toLowerCase().includes(q) || c.dialCode.includes(q),
    );
  }
}
