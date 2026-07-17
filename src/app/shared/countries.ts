/**
 * Single source of truth for the phone-code country picker used by every
 * form (Demo Form, Contact, Order Modal). Previously each form maintained
 * its own hardcoded list with a different shape (Arabic-only names, or
 * English-only names, or a live restcountries.com fetch with an English
 * fallback) — three independently-drifting copies of essentially the same
 * data. Consolidated here per the Phase 6 decision.
 *
 * `isoCode`/`dialCode` are the only fields any backend payload ever reads
 * (via `dialCode`) — those values are unchanged from what each form sent
 * before this refactor. `nameAr`/`nameEn` exist purely for display and are
 * picked via `CountriesService.displayName()`, never used in comparisons.
 */
export interface CountryOption {
  isoCode: string;
  dialCode: string;
  nameAr: string;
  nameEn: string;
  flagUrl: string;
}

function flag(isoCode: string): string {
  return `https://flagcdn.com/w320/${isoCode.toLowerCase()}.png`;
}

export const COUNTRY_REGISTRY: readonly CountryOption[] = [
  { isoCode: 'SA', dialCode: '966', nameAr: 'السعودية', nameEn: 'Saudi Arabia', flagUrl: flag('SA') },
  { isoCode: 'AE', dialCode: '971', nameAr: 'الإمارات', nameEn: 'United Arab Emirates', flagUrl: flag('AE') },
  { isoCode: 'KW', dialCode: '965', nameAr: 'الكويت', nameEn: 'Kuwait', flagUrl: flag('KW') },
  { isoCode: 'QA', dialCode: '974', nameAr: 'قطر', nameEn: 'Qatar', flagUrl: flag('QA') },
  { isoCode: 'BH', dialCode: '973', nameAr: 'البحرين', nameEn: 'Bahrain', flagUrl: flag('BH') },
  { isoCode: 'OM', dialCode: '968', nameAr: 'عُمان', nameEn: 'Oman', flagUrl: flag('OM') },
  { isoCode: 'JO', dialCode: '962', nameAr: 'الأردن', nameEn: 'Jordan', flagUrl: flag('JO') },
  { isoCode: 'EG', dialCode: '20', nameAr: 'مصر', nameEn: 'Egypt', flagUrl: flag('EG') },
  { isoCode: 'YE', dialCode: '967', nameAr: 'اليمن', nameEn: 'Yemen', flagUrl: flag('YE') },
  { isoCode: 'MA', dialCode: '212', nameAr: 'المغرب', nameEn: 'Morocco', flagUrl: flag('MA') },
  { isoCode: 'IQ', dialCode: '964', nameAr: 'العراق', nameEn: 'Iraq', flagUrl: flag('IQ') },
  { isoCode: 'LY', dialCode: '218', nameAr: 'ليبيا', nameEn: 'Libya', flagUrl: flag('LY') },
  { isoCode: 'DZ', dialCode: '213', nameAr: 'الجزائر', nameEn: 'Algeria', flagUrl: flag('DZ') },
  { isoCode: 'TN', dialCode: '216', nameAr: 'تونس', nameEn: 'Tunisia', flagUrl: flag('TN') },
  { isoCode: 'SY', dialCode: '963', nameAr: 'سوريا', nameEn: 'Syria', flagUrl: flag('SY') },
  { isoCode: 'LB', dialCode: '961', nameAr: 'لبنان', nameEn: 'Lebanon', flagUrl: flag('LB') },
  { isoCode: 'PS', dialCode: '970', nameAr: 'فلسطين', nameEn: 'Palestine', flagUrl: flag('PS') },
  { isoCode: 'SD', dialCode: '249', nameAr: 'السودان', nameEn: 'Sudan', flagUrl: flag('SD') },
  { isoCode: 'GB', dialCode: '44', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom', flagUrl: flag('GB') },
  { isoCode: 'US', dialCode: '1', nameAr: 'الولايات المتحدة', nameEn: 'United States', flagUrl: flag('US') },
  { isoCode: 'FR', dialCode: '33', nameAr: 'فرنسا', nameEn: 'France', flagUrl: flag('FR') },
  { isoCode: 'TR', dialCode: '90', nameAr: 'تركيا', nameEn: 'Turkey', flagUrl: flag('TR') },
  { isoCode: 'DE', dialCode: '49', nameAr: 'ألمانيا', nameEn: 'Germany', flagUrl: flag('DE') },
  { isoCode: 'CA', dialCode: '1', nameAr: 'كندا', nameEn: 'Canada', flagUrl: flag('CA') },
  { isoCode: 'AU', dialCode: '61', nameAr: 'أستراليا', nameEn: 'Australia', flagUrl: flag('AU') },
  { isoCode: 'IN', dialCode: '91', nameAr: 'الهند', nameEn: 'India', flagUrl: flag('IN') },
  { isoCode: 'PK', dialCode: '92', nameAr: 'باكستان', nameEn: 'Pakistan', flagUrl: flag('PK') },
  { isoCode: 'BD', dialCode: '880', nameAr: 'بنغلاديش', nameEn: 'Bangladesh', flagUrl: flag('BD') },
  { isoCode: 'PH', dialCode: '63', nameAr: 'الفلبين', nameEn: 'Philippines', flagUrl: flag('PH') },
] as const;

export const DEFAULT_COUNTRY_ISO = 'SA';
