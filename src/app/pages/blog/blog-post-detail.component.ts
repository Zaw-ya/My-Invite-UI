import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-blog-post-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './blog-post-detail.component.html',
  styleUrl: './blog-post-detail.component.css'
})
export class BlogPostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contentService = inject(ContentService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

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

          const formatted = {
            id: data.id?.toString() || '',
            title: data.title || '',
            category: data.category || 'نصائح',
            date: new Date(data.createdAt || data.createdDate || Date.now()).toLocaleDateString('ar-SA'),
            readTime: `${readMinutes} دقائق`,
            imageUrl: data.imageUrl || '',
            altText: data.altText || data.title || '',
            content: rawContent,
            author: data.author || 'فريق كروتي الخاصة',
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
          title: 'خطأ في التحميل',
          content: '<p>عذراً، تعذر تحميل المقال من الخادم.</p>'
        });
      }
    });
  }

  getPost() {
    return this.currentPost() || {
      title: 'جاري التحميل...',
      category: '',
      date: '',
      readTime: '',
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
    this.router.navigate(['/blog', segment]);
  }

  shareWhatsApp() {
    const post = this.getPost();
    if (!post.title || post.title === 'جاري التحميل...') return;
    const text = `اقرأ: ${post.title} - ${window.location.origin}/blog/${this.postId()}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank');
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
