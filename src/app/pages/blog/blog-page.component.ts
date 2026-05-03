import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './blog-page.component.html',
  styleUrl: './blog-page.component.css'
})
export class BlogPageComponent {
  constructor(private router: Router) {}

  blogPosts = Array.from({ length: 16 }, (_, i) => ({
    id: String(i + 1),
    title: [
      'أفضل الطرق لتنظيم حفل زفافك الرقمي',
      'تريندات دعوات التخرج لعام 2026',
      'كيف تختار التصميم المناسب لمناسبتك',
      'دليل شامل لإدارة قائمة الضيوف',
      'مزايا الدعوات الرقمية مقارنة بالورقية',
      'نصائح لتصميم دعوة مميزة لا تُنسى',
      'كود QR: كل ما تحتاج معرفته',
      'تحليل بيانات الحضور والضيوف'
    ][i % 8],
    excerpt: 'تعرف على كيفية اختيار التصميم المثالي وإدارة قائمة المدعوين بكل سهولة. نصائح الخبراء تجعلك تنجح في تنظيم مناسبتك.',
    date: new Date(2026, 3, 15 + i),
    category: ['نصائح وتنظيم', 'تصاميم', 'إدارة الفعاليات', 'تقنية'][i % 4],
    imageUrl: `image/${(i % 8) + 1}.png`,
    readTime: [5, 8, 6, 10, 7, 12, 4, 9][i % 8] + ' دقيقة'
  }));

  categories = ['الكل', 'نصائح وتنظيم', 'تصاميم', 'إدارة الفعاليات', 'تقنية'];
  activeCategory = 'الكل';

  filteredPosts() {
    if (this.activeCategory === 'الكل') return this.blogPosts;
    return this.blogPosts.filter(p => p.category === this.activeCategory);
  }

  navigateToPost(postId: string) {
    this.router.navigate(['/blog', postId]);
  }
}
