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
      title: 'سياسة الخصوصية | مؤسسة بطاقتي الخاصة .نت',
      description: 'تعرف على سياسة الخصوصية الخاصة بموقع مؤسسة بطاقتي الخاصة .نت وكيف نحمي بياناتك الشخصية.',
      canonical: 'https://specialcards.net/privacy-policy',
      ogType: 'website',
    });
  }
}
