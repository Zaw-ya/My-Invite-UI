import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.css'
})
export class BlogPageComponent implements OnInit {
  private contentService = inject(ContentService);
  private router = inject(Router);
  private seoService = inject(SeoService);

  blogPosts = this.contentService.blogPosts;

  activeCategory = 'الكل';

  /** Build category list dynamically from API data */
  categories = computed(() => {
    const cats = new Set<string>();
    this.blogPosts().forEach(p => { if (p.category) cats.add(p.category); });
    return ['الكل', ...Array.from(cats)];
  });

  filteredPosts = computed(() => {
    const posts = this.blogPosts();
    if (this.activeCategory === 'الكل') return posts;
    return posts.filter(p => p.category === this.activeCategory);
  });

  ngOnInit() {
    this.seoService.updateSeo({
      title: 'مدونة Special Cards | مؤسسة بطاقتي الخاصة | نصائح وأفكار للمناسبات',
      description: 'اقرأ أحدث المقالات والنصائح حول تنظيم المناسبات وتصميم الدعوات الرقمية من خبراء Special Cards مؤسسة بطاقتي الخاصة.',
      canonical: 'https://specialcards.net/blog',
      keywords: 'مدونة مناسبات, نصائح تنظيم حفلات, أفكار دعوات, تصميم دعوة, Special Cards, مؤسسة بطاقتي الخاصة',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'مدونة Special Cards | مؤسسة بطاقتي الخاصة',
        description: 'نصائح وأفكار للمناسبات وتصميم الدعوات الرقمية',
        url: 'https://specialcards.net/blog',
        publisher: {
          '@type': 'Organization',
          name: 'Special Cards | مؤسسة بطاقتي الخاصة',
          url: 'https://specialcards.net',
          logo: 'https://specialcards.net/assets/images/logo.png'
        }
      }
    });
  }

  setCategory(cat: string) {
    this.activeCategory = cat;
  }

  navigateToPost(post: any) {
    // Navigate by slug if available, otherwise by id
    const segment = post.slug || post.id;
    this.router.navigate(['/blog', segment]);
  }
}
