import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing/landing';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: '**', redirectTo: '' }
];
