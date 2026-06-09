import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css'
})
export class PrivacyPolicyComponent implements OnInit {
  private contentService = inject(ContentService);
  private seoService = inject(SeoService);

  siteName = computed(() => this.contentService.siteSettings()['site-name'] || 'الشركة');

  ngOnInit() {
    this.seoService.updateSeo({
      title: 'سياسة الخصوصية | Special Cards | مؤسسة بطاقتي الخاصة',
      description: 'تعرف على سياسة الخصوصية الخاصة بموقع Special Cards مؤسسة بطاقتي الخاصة وكيف نحمي بياناتك الشخصية.',
      canonical: 'https://www.specialcards.net/privacy-policy',
      ogType: 'website',
    });
  }
}
