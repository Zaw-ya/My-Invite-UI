import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

const SITE_URL = 'https://specialcards.net';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/logo.png`;

const PAGE_SEO: Record<string, SeoConfig> = {
  '/': {
    title: 'كروتي الخاصة .نت | كروت دعوة رقمية للأيام الخاصة',
    description: 'كروت دعوة رقمية فاخرة لجميع مناسباتك - حفلات زواج، تخرج، أعياد ميلاد، ومناسبات خاصة. صمّم دعوتك الرقمية الآن مع كروتي الخاصة.',
    canonical: `${SITE_URL}/`,
    ogType: 'website',
    keywords: 'كروت دعوة رقمية, دعوات زواج, دعوات تخرج, بطاقات دعوة, مناسبات خاصة, كروتي الخاصة',
  },
  '/designs': {
    title: 'تصاميم الدعوات | كروتي الخاصة',
    description: 'اكتشف مجموعتنا الواسعة من تصاميم كروت الدعوة الرقمية الفاخرة لحفلات الزواج، التخرج، وكل المناسبات الخاصة.',
    canonical: `${SITE_URL}/designs`,
    ogType: 'website',
    keywords: 'تصاميم دعوات, كروت زواج, كروت تخرج, تصميم دعوة رقمية',
  },
  '/blog': {
    title: 'المدونة | كروتي الخاصة - نصائح وأفكار للمناسبات',
    description: 'اقرأ أحدث المقالات والنصائح حول تنظيم المناسبات وتصميم الدعوات الرقمية من خبراء كروتي الخاصة.',
    canonical: `${SITE_URL}/blog`,
    ogType: 'website',
    keywords: 'مدونة مناسبات, نصائح تنظيم حفلات, أفكار دعوات',
  },
  '/privacy-policy': {
    title: 'سياسة الخصوصية | كروتي الخاصة',
    description: 'تعرف على سياسة الخصوصية الخاصة بموقع كروتي الخاصة وكيف نحمي بياناتك الشخصية.',
    canonical: `${SITE_URL}/privacy-policy`,
    ogType: 'website',
    noIndex: false,
  },
  '/terms': {
    title: 'الشروط والأحكام | كروتي الخاصة',
    description: 'اقرأ شروط الاستخدام والأحكام الخاصة بخدمات موقع كروتي الخاصة.',
    canonical: `${SITE_URL}/terms`,
    ogType: 'website',
    noIndex: false,
  },
  '/cancellation-policy': {
    title: 'سياسة الإلغاء | كروتي الخاصة',
    description: 'تعرف على سياسة الإلغاء واسترداد الأموال الخاصة بخدمات كروتي الخاصة.',
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
    const siteTitle = config.title || 'كروتي الخاصة .نت';
    const description = config.description || 'كروت دعوة رقمية فاخرة لجميع مناسباتك';
    const ogTitle = config.ogTitle || config.title || 'كروتي الخاصة';
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
    if (config.jsonLd && isPlatformBrowser(this.platformId)) {
      this.injectJsonLd(config.jsonLd);
    }
  }

  /** Specifically set/update the canonical link tag */
  setCanonical(url: string) {
    if (isPlatformBrowser(this.platformId)) {
      let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    }
  }

  /** Inject or replace JSON-LD structured data */
  private injectJsonLd(data: object) {
    if (!isPlatformBrowser(this.platformId)) return;
    // Remove existing app-generated JSON-LD
    const existing = document.querySelector('script[data-seo="json-ld"]');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'json-ld');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
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
      title: `${metaTitle} | كروتي الخاصة`,
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
        name: post.author || 'فريق كروتي الخاصة'
      },
      publisher: {
        '@type': 'Organization',
        name: 'كروتي الخاصة',
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

    if (isPlatformBrowser(this.platformId)) {
      this.injectJsonLd(jsonLd);
    }
  }
}
