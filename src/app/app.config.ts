import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  LucideAngularModule,
  // existing icons
  Heart, GraduationCap, Briefcase, Landmark, Users, User, Check,
  Star, ArrowRight, ArrowLeft, Play, Calendar, Clock, MapPin, Mail, Phone, MessageSquare,
  Send, Menu, X, ChevronDown, ChevronUp, Instagram, Twitter, Facebook, Linkedin,
  ShoppingBag, Search,
  // new icons
  Sparkles, Moon, Sun, Eye, Crown, Zap, Palette, Smartphone, Puzzle,
  Mars, Venus, FileX, MessageCircle,
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    importProvidersFrom(LucideAngularModule.pick({
      // existing
      Heart, GraduationCap, Briefcase, Landmark, Users, User, Check,
      Star, ArrowRight, ArrowLeft, Play, Calendar, Clock, MapPin, Mail, Phone, MessageSquare,
      Send, Menu, X, ChevronDown, ChevronUp, Instagram, Twitter, Facebook, Linkedin,
      ShoppingBag, Search,
      // new
      Sparkles, Moon, Sun, Eye, Crown, Zap, Palette, Smartphone, Puzzle,
      Mars, Venus, FileX, MessageCircle,
    }))
  ]
};
