import { Component, inject, computed } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-supervisors',
  standalone: true,
  imports: [LucideAngularModule, TranslocoModule],
  templateUrl: './supervisors.html',
  styleUrl: './supervisors.css'
})
export class SupervisorsComponent {
  private contentService = inject(ContentService);
  private transloco = inject(TranslocoService);

  supervisors = this.contentService.supervisors;

  // Map API cities to display groups. The loading-time placeholder below
  // mimics backend country/city data shape-for-shape, so it deliberately
  // stays Arabic like the real data would — only the "coming soon" filler
  // text for a country with no cities yet is frontend-owned UI copy.
  dynamicCities = computed(() => {
    const countries = this.contentService.countries();
    const allCities = this.contentService.cities();

    if (countries.length === 0) {
      return [
        { country: 'السعودية', cities: 'الرياض - مكة - المدينة - جدة - القصيم - الدمام - الخبر - الظهران - الأحساء - حائل.' },
        { country: 'الإمارات', cities: 'أبوظبي - دبي.' },
        { country: 'الكويت',   cities: 'الكويت.' },
        { country: 'قطر',      cities: 'الدوحة.' },
        { country: 'البحرين',  cities: 'المنامة.' },
      ];
    }

    return countries.map(country => {
      const countryCities = allCities
        .filter(c => c.countryId === country.id)
        .map(c => c.name)
        .join(' - ');
      return { country: country.name, cities: countryCities || this.transloco.translate('common.comingSoon') };
    });
  });

  showInitial(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
