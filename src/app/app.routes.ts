import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing';
import { DesignsPageComponent } from './pages/designs/designs-page.component';
import { BlogPageComponent } from './pages/blog/blog-page.component';
import { BlogPostDetailComponent } from './pages/blog/blog-post-detail.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsComponent } from './pages/terms/terms.component';
import { CancellationPolicyComponent } from './pages/cancellation-policy/cancellation-policy.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'designs', component: DesignsPageComponent },
  { path: 'blog', component: BlogPageComponent },
  { path: 'blog/:id', component: BlogPostDetailComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'cancellation-policy', component: CancellationPolicyComponent },
  { path: '**', redirectTo: '' }
];
