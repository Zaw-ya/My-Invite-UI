import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Service, Package, InvitationCard, Supervisor, Testimonial, BlogPost, EventType } from '../models/content.interface';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Arabic Event Types
  eventTypes = signal<EventType[]>([]);

  // Arabic Packages
  packages = signal<Package[]>([]);

  // Arabic Invitations
  invitations = signal<InvitationCard[]>([]);

  // Arabic Supervisors
  supervisors = signal<Supervisor[]>([]);

  // Arabic Blog Posts
  blogPosts = signal<BlogPost[]>([]);

  // Arabic Testimonials
  testimonials = signal<Testimonial[]>([]);

  // Locations
  countries = signal<any[]>([]);
  cities = signal<any[]>([]);

  services = signal<Service[]>([
    { id: '1', title: 'دعوات الزفاف', description: 'تصاميم فاخرة تليق بليلة العمر.', icon: 'heart' },
    { id: '2', title: 'مناسبات الشركات', description: 'حلول احترافية لفعاليات أعمالكم.', icon: 'briefcase' }
  ]);

  constructor() {
    this.fetchAllData();
  }

  private fetchAllData() {
    this.fetchEventTypes();
    this.fetchPackages();
    this.fetchInvitations();
    this.fetchSupervisors();
    this.fetchBlogPosts();
    this.fetchTestimonials();
    this.fetchCountries();
    this.fetchCities();
  }

  private extractData(res: any): any {
    if (res && res.data) return res.data;
    if (res && res.Data) return res.Data;
    return res;
  }

  private fetchEventTypes() {
    this.http.get<any>(`${this.apiUrl}/EventTypes`).subscribe({
      next: (res) => {
        const data = this.extractData(res);
        if (!Array.isArray(data)) return;
        const formatted = data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          icon: item.icon || 'star'
        }));
        this.eventTypes.set(formatted);
      },
      error: (err) => console.error('Error fetching event types:', err)
    });
  }

  private fetchPackages() {
    this.http.get<any>(`${this.apiUrl}/Packages/active`).subscribe({
      next: (res) => {
        const data = this.extractData(res);
        if (!Array.isArray(data)) return;
        const formatted = data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          price: item.pricingTiers?.[0]?.price?.toString() || '0',
          description: item.description,
          features: item.features?.map((f: any) => f.description) || [],
          isPopular: item.isPopular,
          compensationPercentage: item.compensationPercentage,
          tiers: item.pricingTiers?.map((t: any) => ({
            count: t.maxInvitations,
            price: t.price
          })) || []
        }));
        this.packages.set(formatted);
      },
      error: (err) => console.error('Error fetching packages:', err)
    });
  }

  private fetchInvitations() {
    this.http.get<any>(`${this.apiUrl}/InvitationCards/visible`).subscribe({
      next: (res) => {
        const data = this.extractData(res);
        if (!Array.isArray(data)) return;
        const formatted = data.map(item => ({
          id: item.id.toString(),
          title: item.title,
          category: item.eventTypes?.[0]?.name || item.category || 'عام',
          price: item.price?.toString() || '0',
          imageUrl: item.imageUrl,
          gender: (item.gender === 0 ? 'ذكوري' : 'أنثوي') as 'ذكوري' | 'أنثوي',
          isNew: item.rating >= 4
        }));
        this.invitations.set(formatted as InvitationCard[]);
      },
      error: (err) => console.error('Error fetching invitations:', err)
    });
  }

  private fetchSupervisors() {
    this.http.get<any>(`${this.apiUrl}/Supervisors/visible`).subscribe({
      next: (res) => {
        const data = this.extractData(res);
        if (!Array.isArray(data)) return;
        const formatted = data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          role: item.nickname || 'مشرف',
          imageUrl: item.imageUrl,
          cost: '100'
        }));
        this.supervisors.set(formatted);
      },
      error: (err) => console.error('Error fetching supervisors:', err)
    });
  }

  private fetchBlogPosts() {
    this.http.get<any>(`${this.apiUrl}/Blog/published`).subscribe({
      next: (res) => {
        const data = this.extractData(res);
        if (!Array.isArray(data)) return;
        const formatted = data.map(item => ({
          id: item.id.toString(),
          title: item.title,
          category: 'نصائح',
          date: new Date(item.createdAt || item.createdDate || Date.now()).toISOString().split('T')[0],
          excerpt: (item.content || '').substring(0, 100) + '...',
          imageUrl: item.imageUrl,
          readTime: '5 دقائق'
        }));
        this.blogPosts.set(formatted);
      },
      error: (err) => console.error('Error fetching blog posts:', err)
    });
  }

  private fetchTestimonials() {
    this.http.get<any>(`${this.apiUrl}/Testimonials/visible`).subscribe({
      next: (res) => {
        const data = this.extractData(res);
        if (!Array.isArray(data)) return;
        const formatted = data.map(item => ({
          id: item.id.toString(),
          name: item.name,
          role: item.role,
          content: item.content,
          rating: item.rating,
          eventType: 'عام'
        }));
        this.testimonials.set(formatted);
      },
      error: (err) => console.error('Error fetching testimonials:', err)
    });
  }

  getBlogPostById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/Blog/${id}`).pipe(
      map(res => this.extractData(res))
    );
  }

  private fetchCountries() {
    this.http.get<any>(`${this.apiUrl}/Countries`).subscribe({
      next: (res) => this.countries.set(this.extractData(res)),
      error: (err) => console.error('Error fetching countries:', err)
    });
  }

  private fetchCities() {
    this.http.get<any>(`${this.apiUrl}/Cities`).subscribe({
      next: (res) => this.cities.set(this.extractData(res)),
      error: (err) => console.error('Error fetching cities:', err)
    });
  }
}
