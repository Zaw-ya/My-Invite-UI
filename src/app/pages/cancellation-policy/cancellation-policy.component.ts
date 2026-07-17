import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { SeoService } from '../../services/seo.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-cancellation-policy',
  standalone: true,
  imports: [RouterModule, NavbarComponent, FooterComponent, TranslocoModule],
  templateUrl: './cancellation-policy.component.html',
  styleUrl: './cancellation-policy.component.css'
})
export class CancellationPolicyComponent implements OnInit {
  private seoService = inject(SeoService);
  readonly languageService = inject(LanguageService);

  ngOnInit() {
    this.seoService.setPage({
      titleKey: 'seo.cancellationPolicy.title',
      descriptionKey: 'seo.cancellationPolicy.description',
      path: '/cancellation-policy',
      ogType: 'website',
    });
  }
}
