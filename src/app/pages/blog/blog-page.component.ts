import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';
import { SeoService } from '../../services/seo.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NavbarComponent, FooterComponent, TranslocoModule],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.css'
})
export class BlogPageComponent implements OnInit {
  private contentService = inject(ContentService);
  private router = inject(Router);
  private seoService = inject(SeoService);
  private languageService = inject(LanguageService);

  blogPosts = this.contentService.blogPosts;

  // `null` = "All" — a stable sentinel, not a localized display string, so
  // switching languages never affects the active filter's identity.
  activeCategory = signal<string | null>(null);

  /** Build category list dynamically from API data (backend values, unchanged) */
  categories = computed(() => {
    const cats = new Set<string>();
    this.blogPosts().forEach(p => { if (p.category) cats.add(p.category); });
    return Array.from(cats);
  });

  filteredPosts = computed(() => {
    const posts = this.blogPosts();
    const cat = this.activeCategory();
    if (cat === null) return posts;
    return posts.filter(p => p.category === cat);
  });

  ngOnInit() {
    this.seoService.setPage({
      titleKey: 'seo.blog.title',
      descriptionKey: 'seo.blog.description',
      path: '/blog',
      keywords: 'مدونة مناسبات, نصائح تنظيم حفلات, أفكار دعوات, تصميم دعوة, Special Cards, مؤسسة بطاقتي الخاصة',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'مدونة Special Cards | مؤسسة بطاقتي الخاصة',
        description: 'نصائح وأفكار للمناسبات وتصميم الدعوات الرقمية',
        url: 'https://www.specialcards.net/blog',
        publisher: {
          '@type': 'Organization',
          name: 'Special Cards | مؤسسة بطاقتي الخاصة',
          url: 'https://www.specialcards.net',
          logo: 'https://www.specialcards.net/assets/images/tab.png'
        }
      }
    });
  }

  setCategory(cat: string | null) {
    this.activeCategory.set(cat);
  }

  navigateToPost(post: any) {
    // Navigate by slug if available, otherwise by id
    const segment = post.slug || post.id;
    this.router.navigate(['/', this.languageService.activeLanguage().code, 'blog', segment]);
  }
}
