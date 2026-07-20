import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ContentService } from '../../../../services/content.service';
import { LanguageService } from '../../../../i18n/language.service';
import { COUNTRY_REGISTRY } from '../../../../shared/countries';
import { SupervisorCardComponent } from '../../../../components/supervisor-card/supervisor-card';

@Component({
  selector: 'app-supervisors',
  standalone: true,
  imports: [RouterModule, LucideAngularModule, TranslocoModule, SupervisorCardComponent],
  templateUrl: './supervisors.html',
  styleUrl: './supervisors.css'
})
export class SupervisorsComponent {
  private contentService = inject(ContentService);
  private transloco = inject(TranslocoService);
  readonly languageService = inject(LanguageService);

  supervisors = this.contentService.supervisors;
  loading = this.contentService.supervisorsLoading;
  error = this.contentService.supervisorsError;

  retry() {
    this.contentService.retryFetchSupervisors();
  }

  viewAllIcon = computed(() =>
    this.languageService.activeLanguage().direction === 'rtl' ? 'arrow-left' : 'arrow-right'
  );

  // Backend only ever returns country names in one language (English, e.g.
  // "Egypt") — there's no nameAr field in that API response, so on the
  // Arabic page these were showing untranslated English names next to
  // otherwise-Arabic copy. The demo-form phone picker already keeps a
  // static nameAr/nameEn/flagUrl registry for the same real-world
  // countries, so reuse it here both to translate the name back to
  // Arabic and to resolve a flag for the availability cards; countries
  // outside that registry just keep their raw name and no flag.
  private matchCountry(name: string) {
    return COUNTRY_REGISTRY.find(c => c.nameEn.toLowerCase() === name.trim().toLowerCase());
  }

  // Map API cities to display groups. The loading-time placeholder below
  // mimics backend country/city data shape-for-shape, so it deliberately
  // stays Arabic like the real data would — only the "coming soon" filler
  // text for a country with no cities yet is frontend-owned UI copy.
  dynamicCities = computed(() => {
    const countries = this.contentService.countries();
    const allCities = this.contentService.cities();
    const isAr = this.languageService.activeLanguage().code === 'ar';

    if (countries.length === 0) {
      return [
        { country: 'السعودية', cities: 'الرياض - مكة - المدينة - جدة - القصيم - الدمام - الخبر - الظهران - الأحساء - حائل.', flagUrl: 'https://flagcdn.com/w320/sa.png' },
        { country: 'الإمارات', cities: 'أبوظبي - دبي.', flagUrl: 'https://flagcdn.com/w320/ae.png' },
        { country: 'الكويت',   cities: 'الكويت.', flagUrl: 'https://flagcdn.com/w320/kw.png' },
        { country: 'قطر',      cities: 'الدوحة.', flagUrl: 'https://flagcdn.com/w320/qa.png' },
        { country: 'البحرين',  cities: 'المنامة.', flagUrl: 'https://flagcdn.com/w320/bh.png' },
      ];
    }

    return countries.map(country => {
      const countryCities = allCities
        .filter(c => c.countryId === country.id)
        .map(c => c.name)
        .join(' - ');
      const match = this.matchCountry(country.name);
      return {
        country: isAr && match ? match.nameAr : country.name,
        cities: countryCities || this.transloco.translate('common.comingSoon'),
        flagUrl: match?.flagUrl,
      };
    });
  });
}
