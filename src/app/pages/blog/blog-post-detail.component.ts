import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';

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
  private platformId = inject(PLATFORM_ID);

  postId = signal<string>('');
  currentPost = signal<any>(null);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.currentPost.set(null); // Reset for transition
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
          const formatted = {
            id: data.id?.toString() || '',
            title: data.title || '',
            category: 'نصائح',
            date: new Date(data.createdAt || data.createdDate || Date.now()).toLocaleDateString('ar-SA'),
            readTime: '5 دقائق',
            imageUrl: data.imageUrl || '',
            content: data.content || ''
          };
          this.currentPost.set(formatted);
        }
      },
      error: (err) => {
        console.error('Error fetching blog post:', err);
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
      content: ''
    };
  }

  getRelatedPosts() {
    const allPosts = this.contentService.blogPosts();
    return allPosts
      .filter(p => p.id !== this.postId())
      .slice(0, 3);
  }

  navigateToPost(postId: string) {
    this.router.navigate(['/blog', postId]);
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
}
