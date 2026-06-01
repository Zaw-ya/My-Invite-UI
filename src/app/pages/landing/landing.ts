import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { ContentService } from '../../services/content.service';
import { DesignOrderService } from '../../services/design-order.service';
import { SeoService } from '../../services/seo.service';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

// Sub-components
import { HeroComponent } from './components/hero/hero';
import { DemoFormComponent } from './components/demo-form/demo-form';
import { PricingComponent } from './components/pricing/pricing';
import { PortfolioSliderComponent } from './components/portfolio-slider/portfolio-slider';
import { SupervisorsComponent } from './components/supervisors/supervisors';
import { AdditionalServicesComponent } from './components/additional-services/additional-services';
import { BlogComponent } from './components/blog/blog';
import { ContactComponent } from './components/contact/contact';
import { OrderModalComponent } from '../../components/order-modal/order-modal.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    ScrollRevealDirective,
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    DemoFormComponent,
    PricingComponent,
    PortfolioSliderComponent,
    SupervisorsComponent,
    AdditionalServicesComponent,
    BlogComponent,
    ContactComponent,
    OrderModalComponent
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingPageComponent implements OnInit {
  private contentService = inject(ContentService);
  private designOrderService = inject(DesignOrderService);
  private seoService = inject(SeoService);

  showOrderModal = this.designOrderService.showModal;

  services = this.contentService.services;
  packages = this.contentService.packages;
  invitations = this.contentService.invitations;
  carouselCards = this.contentService.carouselCards;
  supervisors = this.contentService.supervisors;
  eventTypes = this.contentService.eventTypes;
  blogPosts = this.contentService.blogPosts;
  testimonials = this.contentService.testimonials;

  categories = computed(() => ['كل التصميمات', ...this.eventTypes().map(et => et.name)]);

  ngOnInit() {
    this.seoService.updateSeo({
      title: 'Special Cards | مؤسسة بطاقتي الخاصة | كروت دعوة رقمية للأيام الخاصة',
      description: 'كروت دعوة رقمية فاخرة لجميع مناسباتك - حفلات زواج، تخرج، أعياد ميلاد، ومناسبات خاصة. صمّم دعوتك الرقمية الآن مع Special Cards مؤسسة بطاقتي الخاصة.',
      canonical: 'https://specialcards.net/',
      keywords: 'كروت دعوة رقمية, دعوات زواج, دعوات تخرج, بطاقات دعوة, مناسبات خاصة, Special Cards, مؤسسة بطاقتي الخاصة',
      ogType: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Special Cards | مؤسسة بطاقتي الخاصة',
        url: 'https://specialcards.net',
        logo: 'https://specialcards.net/assets/images/logo.png',
        description: 'كروت دعوة رقمية فاخرة لجميع مناسباتك - حفلات زواج، تخرج، مناسبات خاصة',
        priceRange: '$$',
        serviceType: 'Digital Invitation Cards',
        areaServed: 'SA',
        availableLanguage: 'Arabic'
      }
    });
  }
}
