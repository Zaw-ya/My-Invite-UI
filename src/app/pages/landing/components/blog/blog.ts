import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}
