import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { BlogPost } from '../../../../models/content.interface';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class BlogComponent {
  @Input() blogPosts: BlogPost[] = [];

  constructor(private router: Router) {}

  navigateToBlog() {
    this.router.navigate(['/blog']);
  }

  navigateToPost(postId: string) {
    this.router.navigate(['/blog', postId]);
  }
}
