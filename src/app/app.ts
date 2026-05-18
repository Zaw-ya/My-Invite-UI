import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('My-Invite-UI');
  private seoService = inject(SeoService);

  ngOnInit() {
    // Initialize automatic SEO updates on every route change
    this.seoService.init();
  }
}
