import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { combineLatest, filter, map, switchMap } from 'rxjs';
import { LanguageService } from '../i18n/language.service';

export interface SeoConfig {
  title?: string;
  description?: string;
  /** Path relative to the locale prefix, e.g. '/designs' or '' for home. Locale is prepended automatically. */
  path?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  noIndex?: boolean;
  jsonLd?: object;
}

export interface PageSeoConfig {
  titleKey: string;
  descriptionKey: string;
  /**
   * Path relative to the locale prefix, e.g. '/designs' or '' for home.
   * Omit entirely for pages that shouldn't declare a canonical at all
   * (e.g. a 404 page — there's no real content to point a canonical at).
   */
  path?: string;
  noIndex?: boolean;
  keywords?: string;
  jsonLd?: object;
  ogType?: string;
  ogImage?: string;
}

const SITE_URL = 'https://www.specialcards.net';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/tab.png`;

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);
  private languageService = inject(LanguageService);
  private transloco = inject(TranslocoService);

  private pageConfig = signal<PageSeoConfig | null>(null);

  constructor() {
    // Both observables must be created here, during construction, while an
    // injection context is still active — `toObservable()` calls `inject()`
    // internally, so creating it lazily inside the switchMap callback below
    // (which runs outside any injection context) throws NG0203 on every
    // navigation after the first and silently kills the whole subscription.
    const pageConfig$ = toObservable(this.pageConfig);
    const activeLanguage$ = toObservable(this.languageService.activeLanguage);

    // Re-applies whenever the page config, the active language, OR the
    // translation file's load state changes. `selectTranslate` (unlike the
    // synchronous `translate()`) correctly waits for the language file to
    // finish loading before emitting — using `translate()` directly here
    // would return the raw key as a fallback on the first render, since the
    // HTTP fetch for the translation JSON hasn't resolved yet at that point.
    pageConfig$
      .pipe(
        filter((cfg): cfg is PageSeoConfig => cfg !== null),
        switchMap((cfg) =>
          combineLatest([
            this.transloco.selectTranslate(cfg.titleKey),
            this.transloco.selectTranslate(cfg.descriptionKey),
            activeLanguage$,
          ]).pipe(map(([title, description, lang]) => ({ cfg, title, description, lang: lang.code })))
        )
      )
      .subscribe(({ cfg, title, description, lang }) => {
        this.applySeo({
          title,
          description,
          path: cfg.path,
          noIndex: cfg.noIndex,
          keywords: cfg.keywords,
          jsonLd: cfg.jsonLd,
          ogType: cfg.ogType,
          ogImage: cfg.ogImage,
        }, lang);
      });
  }

  /**
   * Call once per static page component (typically in ngOnInit) with
   * translation keys rather than resolved strings — title/description stay
   * correct across language switches without the component needing to know
   * anything about Transloco or re-invoke this on its own.
   */
  setPage(config: PageSeoConfig) {
    this.pageConfig.set(config);
  }

  /**
   * Direct SEO update for pages whose title/description are already-resolved
   * strings rather than translation keys — e.g. a blog post detail page,
   * where the content is backend-provided and not itself translated.
   * `path` (if given) is still locale-prefixed automatically.
   */
  updateSeo(config: SeoConfig) {
    this.applySeo(config, this.languageService.activeLanguage().code);
  }

  private applySeo(config: SeoConfig, lang: string) {
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

    // Canonical & og:url — locale-prefixed automatically from `path`
    if (config.path !== undefined) {
      const canonical = `${SITE_URL}/${lang}${config.path}`;
      this.setCanonical(canonical);
      this.meta.updateTag({ property: 'og:url', content: canonical });
      this.meta.updateTag({ property: 'twitter:url', content: canonical });
    }

    // JSON-LD structured data (kept out of the reduced SEO scope —
    // content stays as provided, not itself translated)
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

  /** Update SEO for a blog post detail page — title/content are backend-provided, not translated */
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
    const metaTitle = post.metaTitle || post.title;
    const metaDesc = post.metaDescription || post.title;

    this.updateSeo({
      title: `${metaTitle} | Special Cards | مؤسسة بطاقتي الخاصة`,
      description: metaDesc,
      path: `/blog/${slug}`,
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
        '@id': `${SITE_URL}/${this.languageService.activeLanguage().code}/blog/${slug}`
      }
    };

    this.injectJsonLd(jsonLd);
  }
}
