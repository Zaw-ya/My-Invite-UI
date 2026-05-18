import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.css'
})
export class TermsComponent implements OnInit {
  private contentService = inject(ContentService);
  private seoService = inject(SeoService);

  siteName = computed(() => this.contentService.siteSettings()['site-name'] || 'الشركة');

  ngOnInit() {
    this.seoService.updateSeo({
      title: 'الشروط والأحكام | كروتي الخاصة .نت',
      description: 'اقرأ شروط الاستخدام والأحكام الخاصة بخدمات موقع كروتي الخاصة .نت.',
      canonical: 'https://specialcards.net/terms',
      ogType: 'website',
    });
  }
}
