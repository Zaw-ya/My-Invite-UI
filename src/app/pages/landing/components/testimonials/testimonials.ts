import { Component, inject, computed } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ContentService } from '../../../../services/content.service';
import { LanguageService } from '../../../../i18n/language.service';
import { containsArabic } from '../../../../i18n/backend-content';

interface TestimonialView {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  /** When true, name/role/content are translation keys rather than text. */
  translate?: boolean;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class TestimonialsComponent {
  private readonly contentService = inject(ContentService);
  private readonly languageService = inject(LanguageService);

  readonly defaultTestimonials: TestimonialView[] = [0, 1, 2].map(i => ({
    id: `default-${i}`,
    name: `testimonialsSection.defaults.t${i}.name`,
    role: `testimonialsSection.defaults.t${i}.city`,
    content: `testimonialsSection.defaults.t${i}.content`,
    rating: 5,
    translate: true,
  }));

  readonly testimonials = computed<TestimonialView[]>(() => {
    let list: TestimonialView[] = this.contentService.testimonials() ?? [];
    // Backend reviews are Arabic-only today — keep them off other
    // languages' pages rather than mixing Arabic into the English site.
    if (this.languageService.activeLanguage().code !== 'ar') {
      list = list.filter(t => !containsArabic(t.content));
    }
    return list.length > 0 ? list : this.defaultTestimonials;
  });

  readonly stars = [0, 1, 2, 3, 4];
}
