import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  LucideAngularModule,
  // existing icons
  Heart, GraduationCap, Briefcase, Landmark, Users, User, Check,
  Star, ArrowRight, ArrowLeft, Play, Calendar, MapPin, Mail, Phone, MessageSquare,
  Send, Menu, X, ChevronDown, ChevronUp, Instagram, Twitter, Facebook, Linkedin,
  ShoppingBag, Search,
  // new icons added by redesign
  Sparkles, Moon, Sun, Eye, Crown, Zap, Palette, Smartphone, Puzzle,
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    importProvidersFrom(LucideAngularModule.pick({
      // existing
      Heart, GraduationCap, Briefcase, Landmark, Users, User, Check,
      Star, ArrowRight, ArrowLeft, Play, Calendar, MapPin, Mail, Phone, MessageSquare,
      Send, Menu, X, ChevronDown, ChevronUp, Instagram, Twitter, Facebook, Linkedin,
      ShoppingBag, Search,
      // new
      Sparkles, Moon, Sun, Eye, Crown, Zap, Palette, Smartphone, Puzzle,
    }))
  ]
};
