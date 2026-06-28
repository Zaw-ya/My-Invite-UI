import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface SeoConfig {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noIndex?: boolean;
  jsonLd?: object;
}

const SITE_URL = 'https://www.specialcards.net';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/tab.png`;

const PAGE_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'Special Cards | مؤسسة بطاقتي الخاصة | كروت دعوة رقمية للأيام الخاصة',
    description: 'كروت دعوة رقمية فاخرة لجميع مناسباتك - حفلات زواج، تخرج، أعياد ميلاد، ومناسبات خاصة. صمّم دعوتك الرقمية الآن مع Special Cards مؤسسة بطاقتي الخاصة.',
    canonical: `${SITE_URL}/`,
    ogType: 'website',
    keywords: 'كروت دعوة رقمية, دعوات زواج, دعوات تخرج, بطاقات دعوة, مناسبات خاصة, Special Cards, مؤسسة بطاقتي الخاصة',
  },
  '/designs': {
    title: 'تصاميم الدعوات | Special Cards | مؤسسة بطاقتي الخاصة',
    description: 'اكتشف مجموعتنا الواسعة من تصاميم كروت الدعوة الرقمية الفاخرة لحفلات الزواج، التخرج، وكل المناسبات الخاصة من Special Cards.',
    canonical: `${SITE_URL}/designs`,
    ogType: 'website',
    keywords: 'تصاميم دعوات, كروت زواج, كروت تخرج, تصميم دعوة رقمية, Special Cards, مؤسسة بطاقتي الخاصة',
  },
  '/blog': {
    title: 'المدونة | Special Cards | مؤسسة بطاقتي الخاصة - نصائح وأفكار للمناسبات',
    description: 'اقرأ أحدث المقالات والنصائح حول تنظيم المناسبات وتصميم الدعوات الرقمية من خبراء Special Cards مؤسسة بطاقتي الخاصة.',
    canonical: `${SITE_URL}/blog`,
    ogType: 'website',
    keywords: 'مدونة مناسبات, نصائح تنظيم حفلات, أفكار دعوات, Special Cards, مؤسسة بطاقتي الخاصة',
  },
  '/privacy-policy': {
    title: 'سياسة الخصوصية | Special Cards | مؤسسة بطاقتي الخاصة',
    description: 'تعرف على سياسة الخصوصية الخاصة بموقع Special Cards مؤسسة بطاقتي الخاصة وكيف نحمي بياناتك الشخصية.',
    canonical: `${SITE_URL}/privacy-policy`,
    ogType: 'website',
    noIndex: false,
  },
  '/terms': {
    title: 'الشروط والأحكام | Special Cards | مؤسسة بطاقتي الخاصة',
    description: 'اقرأ شروط الاستخدام والأحكام الخاصة بخدمات موقع Special Cards مؤسسة بطاقتي الخاصة.',
    canonical: `${SITE_URL}/terms`,
    ogType: 'website',
    noIndex: false,
  },
  '/cancellation-policy': {
    title: 'سياسة الإلغاء | Special Cards | مؤسسة بطاقتي الخاصة',
    description: 'تعرف على سياسة الإلغاء واسترداد الأموال الخاصة بخدمات Special Cards مؤسسة بطاقتي الخاصة.',
    canonical: `${SITE_URL}/cancellation-policy`,
    ogType: 'website',
    noIndex: false,
  },
};

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  /**
   * Initialize automatic SEO updates on route changes.
   * Call this once in AppComponent.
   */
  init() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const path = event.urlAfterRedirects?.split('?')[0]?.split('#')[0] || '/';
        const config = PAGE_SEO[path];
        if (config) {
          this.updateSeo(config);
        }
      });
  }

  /** Apply full SEO config — call from any component for custom overrides */
  updateSeo(config: SeoConfig) {
    const siteTitle = config.title || 'Special Cards | مؤسسة بطاقتي الخاصة';
    const description = config.description || 'كروت دعوة رقمية فاخرة لجميع مناسباتك';
    const ogTitle = config.ogTitle || config.title || 'Special Cards | مؤسسة بطاقتي الخاصة';
    const ogDescription = config.ogDescription || description;
    const ogImage = config.ogImage || DEFAULT_OG_IMAGE;
    const ogType = config.ogType || 'website';

    // Page title
    this.title.setTitle(siteTitle);

    // Core meta
    this.meta.updateTag({ name: 'description', content: description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }
    this.meta.updateTag({
      name: 'robots',
      content: config.noIndex ? 'noindex, nofollow' : 'index, follow'
    });

    // Open Graph
    this.meta.updateTag({ property: 'og:type', content: ogType });
    this.meta.updateTag({ property: 'og:title', content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDescription });
    this.meta.updateTag({ property: 'og:image', content: ogImage });

    // Twitter
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:title', content: ogTitle });
    this.meta.updateTag({ property: 'twitter:description', content: ogDescription });
    this.meta.updateTag({ property: 'twitter:image', content: ogImage });

    // Canonical & og:url — MUST be set per page
    if (config.canonical) {
      this.setCanonical(config.canonical);
      this.meta.updateTag({ property: 'og:url', content: config.canonical });
      this.meta.updateTag({ property: 'twitter:url', content: config.canonical });
    }

    // JSON-LD structured data
    if (config.jsonLd) {
      this.injectJsonLd(config.jsonLd);
    }
  }

  /** Specifically set/update the canonical link tag */
  setCanonical(url: string) {
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /** Inject or replace JSON-LD structured data */
  private injectJsonLd(data: object) {
    // Remove existing app-generated JSON-LD
    const existing = this.document.querySelector('script[data-seo="json-ld"]');
    if (existing) existing.remove();

    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'json-ld');
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  /** Update SEO for a blog post detail page */
  updateBlogPostSeo(post: {
    title: string;
    metaTitle?: string;
    metaDescription?: string;
    imageUrl?: string;
    slug?: string;
    id?: string;
    author?: string;
    date?: string;
    category?: string;
  }) {
    const slug = post.slug || post.id || '';
    const canonical = `${SITE_URL}/blog/${slug}`;
    const metaTitle = post.metaTitle || post.title;
    const metaDesc = post.metaDescription || post.title;

    this.updateSeo({
      title: `${metaTitle} | Special Cards | مؤسسة بطاقتي الخاصة`,
      description: metaDesc,
      canonical,
      ogTitle: metaTitle,
      ogDescription: metaDesc,
      ogImage: post.imageUrl || DEFAULT_OG_IMAGE,
      ogType: 'article',
    });

    // Article structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: metaTitle,
      description: metaDesc,
      image: post.imageUrl || DEFAULT_OG_IMAGE,
      datePublished: post.date || new Date().toISOString(),
      author: {
        '@type': 'Person',
        name: post.author || 'فريق Special Cards | مؤسسة بطاقتي الخاصة'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Special Cards | مؤسسة بطاقتي الخاصة',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: DEFAULT_OG_IMAGE
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonical
      }
    };

    this.injectJsonLd(jsonLd);
  }
}
