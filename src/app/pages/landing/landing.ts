import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { ContentService } from '../../services/content.service';
import { DesignOrderService } from '../../services/design-order.service';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

// Sub-components
import { HeroComponent } from './components/hero/hero';
import { DemoFormComponent } from './components/demo-form/demo-form';
import { PricingComponent } from './components/pricing/pricing';
import { DesignsComponent } from './components/designs/designs';
import { SupervisorsComponent } from './components/supervisors/supervisors';
import { AdditionalServicesComponent } from './components/additional-services/additional-services';
import { BlogComponent } from './components/blog/blog';
import { TestimonialsComponent } from './components/testimonials/testimonials';
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
    DesignsComponent,
    SupervisorsComponent,
    AdditionalServicesComponent,
    BlogComponent,
    TestimonialsComponent,
    ContactComponent,
    OrderModalComponent
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingPageComponent {
  private contentService = inject(ContentService);
  private designOrderService = inject(DesignOrderService);
  showOrderModal = this.designOrderService.showModal;
  
  services = this.contentService.services;
  packages = this.contentService.packages;
  invitations = this.contentService.invitations;
  supervisors = this.contentService.supervisors;
  eventTypes = this.contentService.eventTypes;
  blogPosts = this.contentService.blogPosts;
  testimonials = this.contentService.testimonials;

  categories = computed(() => ['كل التصميمات', ...this.eventTypes().map(et => et.name)]);
}
