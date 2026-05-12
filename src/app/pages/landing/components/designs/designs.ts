import { Component, input, signal, computed, HostListener, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { InvitationCard } from '../../../../models/content.interface';

@Component({
  selector: 'app-designs',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './designs.html',
  styleUrl: './designs.css'
})
export class DesignsComponent implements AfterViewInit, OnDestroy {
  invitations = input<InvitationCard[]>([]);
  categories = input<string[]>(['كل التصميمات']);

  activeFilter = signal('كل التصميمات');
  activeGender = signal('كل التصميمات');
  currentIndex = signal(0);
  previewCard = signal<InvitationCard | null>(null);

  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  private isDragging = false;
  private dragStartX = 0;
  private dragDelta = 0;

  // 6 per page on desktop, 3 on mobile
  perPage = signal(6);

  filtered = computed(() => {
    const cat = this.activeFilter();
    const gender = this.activeGender();
    let items = this.invitations();
    if (cat !== 'كل التصميمات')
      items = items.filter(i => i.category === cat || i.allCategories?.includes(cat));
    if (gender === 'تصميمات ذكورية') items = items.filter(i => i.gender === 'ذكوري');
    else if (gender === 'تصميمات أنثوية') items = items.filter(i => i.gender === 'أنثوي');
    return items;
  });

  maxIndex = computed(() => Math.max(0, this.filtered().length - this.perPage()));
  dots = computed(() => Array.from({ length: Math.ceil(this.filtered().length / this.perPage()) }, (_, i) => i));
  translateX = computed(() => -(this.currentIndex() * (100 / this.perPage())));

  constructor(@Inject(PLATFORM_ID) private platformId: object, private router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      this.perPage.set(window.innerWidth < 640 ? 3 : 6);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) this.startAutoPlay();
  }
  ngOnDestroy() { this.stopAutoPlay(); }

  @HostListener('window:resize')
  onResize() {
    this.perPage.set(window.innerWidth < 640 ? 3 : 6);
    this.currentIndex.set(0);
  }

  setFilter(cat: string) { this.activeFilter.set(cat); this.currentIndex.set(0); }
  setGender(g: string) { this.activeGender.set(g); this.currentIndex.set(0); }

  prev() { this.currentIndex.update(i => Math.max(0, i - this.perPage())); this.resetAutoPlay(); }
  next() {
    this.currentIndex.update(i => {
      const next = i + this.perPage();
      return next > this.maxIndex() ? 0 : next;
    });
    this.resetAutoPlay();
  }
  goTo(page: number) { this.currentIndex.set(page * this.perPage()); this.resetAutoPlay(); }

  navigateToDesigns() { this.router.navigate(['/designs']); }

  openPreview(card: InvitationCard) {
    this.previewCard.set(card);
    document.body.style.overflow = 'hidden';
  }
  closePreview() {
    this.previewCard.set(null);
    document.body.style.overflow = '';
  }

  private startAutoPlay() {
    this.autoPlayTimer = setInterval(() => this.next(), 4000);
  }
  private stopAutoPlay() {
    if (this.autoPlayTimer) { clearInterval(this.autoPlayTimer); this.autoPlayTimer = null; }
  }
  private resetAutoPlay() { this.stopAutoPlay(); this.startAutoPlay(); }

  onDragStart(e: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.dragStartX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.dragDelta = 0;
    this.stopAutoPlay();
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onDragMove(e: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    this.dragDelta = x - this.dragStartX;
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.dragDelta < -50) this.next();
    else if (this.dragDelta > 50) this.prev();
    else this.resetAutoPlay();
    this.dragDelta = 0;
  }
}
