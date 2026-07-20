import { Component, inject, OnInit } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { SupervisorCardComponent } from '../../components/supervisor-card/supervisor-card';
import { ContentService } from '../../services/content.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-supervisors-page',
  standalone: true,
  imports: [LucideAngularModule, TranslocoModule, NavbarComponent, FooterComponent, SupervisorCardComponent],
  templateUrl: './supervisors-page.component.html',
  styleUrl: './supervisors-page.component.css'
})
export class SupervisorsPageComponent implements OnInit {
  private contentService = inject(ContentService);
  private seoService = inject(SeoService);

  supervisors = this.contentService.supervisors;
  loading = this.contentService.supervisorsLoading;
  error = this.contentService.supervisorsError;

  retry() {
    this.contentService.retryFetchSupervisors();
  }

  ngOnInit() {
    this.seoService.setPage({
      titleKey: 'seo.supervisors.title',
      descriptionKey: 'seo.supervisors.description',
      path: '/supervisors',
      keywords: 'مشرفين بوابة, تنظيم دخول, مشرفي مناسبات, Special Cards, مؤسسة بطاقتي الخاصة',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'مشرفو البوابة',
        description: 'فريق مشرفي البوابة الميداني لدى Special Cards',
        url: 'https://www.specialcards.net/supervisors',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Special Cards | مؤسسة بطاقتي الخاصة',
          url: 'https://www.specialcards.net'
        }
      }
    });
  }
}
