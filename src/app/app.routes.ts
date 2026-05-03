import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing';
import { DesignsPageComponent } from './pages/designs/designs-page.component';
import { BlogPageComponent } from './pages/blog/blog-page.component';
import { BlogPostDetailComponent } from './pages/blog/blog-post-detail.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'designs', component: DesignsPageComponent },
  { path: 'blog', component: BlogPageComponent },
  { path: 'blog/:id', component: BlogPostDetailComponent },
  { path: '**', redirectTo: '' }
];
