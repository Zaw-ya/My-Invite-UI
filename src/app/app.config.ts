import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { 
  LucideAngularModule,
  Heart, GraduationCap, Briefcase, Landmark, Users, User, Check, 
  Star, ArrowRight, ArrowLeft, Play, Calendar, MapPin, Mail, Phone, MessageSquare, 
  Send, Menu, X, ChevronDown, ChevronUp, Instagram, Twitter, Facebook, Linkedin,
  ShoppingBag, Search
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    importProvidersFrom(LucideAngularModule.pick({ 
      Heart, GraduationCap, Briefcase, Landmark, Users, User, Check, 
      Star, ArrowRight, ArrowLeft, Play, Calendar, MapPin, Mail, Phone, MessageSquare, 
      Send, Menu, X, ChevronDown, ChevronUp, Instagram, Twitter, Facebook, Linkedin,
      ShoppingBag, Search
    }))
  ]
};
