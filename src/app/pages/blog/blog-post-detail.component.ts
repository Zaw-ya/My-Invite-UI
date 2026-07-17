import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';
import { SeoService } from '../../services/seo.service';
import { LanguageService } from '../../i18n/language.service';

@Component({
  selector: 'app-blog-post-detail',
  standalone: true,
  imports: [LucideAngularModule, NavbarComponent, FooterComponent, TranslocoModule, RouterLink],
  templateUrl: './blog-post-detail.component.html',
  styleUrl: './blog-post-detail.component.css'
})
export class BlogPostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);
  private transloco = inject(TranslocoService);
  readonly languageService = inject(LanguageService);

  postId = signal<string>('');
  currentPost = signal<any>(null);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // Support both slug-based and id-based routing
      const id = params.get('id');
      if (id) {
        this.currentPost.set(null);
        this.loading.set(true);
        this.postId.set(id);
        this.fetchPost(id);
      }
    });
  }

  private fetchPost(id: string) {
    this.contentService.getBlogPostById(id).subscribe({
      next: (res: any) => {
        if (res) {
          const data = res;
          const rawContent = data.content || '';
          const wordCount = rawContent.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
          const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
          const dateLocale = this.languageService.activeLanguage().code === 'ar' ? 'ar-SA' : 'en-US';

          const formatted = {
            id: data.id?.toString() || '',
            title: data.title || '',
            // No hardcoded UI-language fallback — raw backend value (empty
            // string if absent); the template supplies a translated
            // default so it stays reactive to the active language.
            category: data.category || '',
            date: new Date(data.createdAt || data.createdDate || Date.now()).toLocaleDateString(dateLocale),
            readMinutes,
            imageUrl: data.imageUrl || '',
            altText: data.altText || data.title || '',
            content: rawContent,
            author: data.author || '',
            slug: data.slug || data.id?.toString() || '',
            metaTitle: data.metaTitle || data.title || '',
            metaDescription: data.metaDescription || '',
            tags: data.tags || ''
          };

          this.currentPost.set(formatted);
          this.loading.set(false);

          // Update SEO via centralized SeoService
          this.seoService.updateBlogPostSeo({
            title: formatted.title,
            metaTitle: formatted.metaTitle,
            metaDescription: formatted.metaDescription,
            imageUrl: formatted.imageUrl,
            slug: formatted.slug,
            id: formatted.id,
            author: formatted.author,
            date: formatted.date,
            category: formatted.category
          });
        }
      },
      error: (err) => {
        console.error('Error fetching blog post:', err);
        this.loading.set(false);
        this.currentPost.set({
          title: this.transloco.translate('blogPostDetail.loadingErrorTitle'),
          content: `<p>${this.transloco.translate('blogPostDetail.loadingErrorBody')}</p>`
        });
      }
    });
  }

  getPost() {
    return this.currentPost() || {
      title: this.transloco.translate('blogPostDetail.loadingPlaceholderTitle'),
      category: '',
      date: '',
      readMinutes: 0,
      imageUrl: '',
      altText: '',
      content: '',
      author: '',
      slug: '',
      tags: ''
    };
  }

  getTags(): string[] {
    const tags = this.getPost().tags;
    if (!tags) return [];
    return tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  }

  getRelatedPosts() {
    const allPosts = this.contentService.blogPosts();
    const current = this.currentPost();
    return allPosts
      .filter(p => p.id !== this.postId() && p.id !== current?.id)
      .slice(0, 3);
  }

  navigateToPost(post: any) {
    const segment = post.slug || post.id;
    this.router.navigate(['/', this.languageService.activeLanguage().code, 'blog', segment]);
  }

  shareWhatsApp() {
    const post = this.getPost();
    if (!post.title || this.loading()) return;
    // Use the actual current URL (already locale-prefixed, e.g. /en/blog/123)
    // rather than reconstructing one — matches shareTwitter/shareFacebook/copyLink.
    const text = this.transloco.translate('blogPostDetail.shareTextTemplate', { title: post.title, url: window.location.href });
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (isPlatformBrowser(this.platformId)) {
      window.open(shareUrl, '_blank');
    }
  }

  shareTwitter() {
    const post = this.getPost();
    const text = `${post.title} - ${window.location.href}`;
    if (isPlatformBrowser(this.platformId)) {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    }
  }

  shareFacebook() {
    if (isPlatformBrowser(this.platformId)) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
    }
  }

  copyLink() {
    if (isPlatformBrowser(this.platformId)) {
      navigator.clipboard.writeText(window.location.href);
    }
  }
}
