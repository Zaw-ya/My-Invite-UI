import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.css'
})
export class BlogPageComponent {
  private contentService = inject(ContentService);
  private router = inject(Router);

  blogPosts = this.contentService.blogPosts;
  categories = ['الكل', 'نصائح وتنظيم', 'تصاميم', 'إدارة الفعاليات', 'تقنية'];
  activeCategory = 'الكل';

  filteredPosts() {
    const posts = this.blogPosts();
    if (this.activeCategory === 'الكل') return posts;
    return posts.filter(p => p.category === this.activeCategory);
  }

  navigateToPost(postId: string) {
    this.router.navigate(['/blog', postId]);
  }
}
