import { Component, inject, computed, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';
import { SeoService } from '../../services/seo.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent, TranslocoModule],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent implements OnInit {
  private contentService = inject(ContentService);
  private seoService = inject(SeoService);
  private transloco = inject(TranslocoService);
  readonly languageService = inject(LanguageService);

  siteName = computed(() => this.contentService.siteSettings()['site-name'] || this.transloco.translate('common.defaultCompanyName'));

  // The billing section's numbered badges use Arabic-Indic numerals to match
  // the Arabic document's numbering style; English uses Western digits.
  billingNumerals = computed(() =>
    this.languageService.activeLanguage().code === 'ar'
      ? ['١', '٢', '٣', '٤', '٥', '٦']
      : ['1', '2', '3', '4', '5', '6']
  );

  ngOnInit() {
    this.seoService.setPage({
      titleKey: 'seo.terms.title',
      descriptionKey: 'seo.terms.description',
      path: '/terms',
      ogType: 'website',
    });
  }
}
