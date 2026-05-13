import { Component, inject, computed } from '@angular/core';
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

  setCategory(cat: string) {
    this.activeCategory = cat;
  }

  navigateToPost(post: any) {
    // Navigate by slug if available, otherwise by id
    const segment = post.slug || post.id;
    this.router.navigate(['/blog', segment]);
  }
}
