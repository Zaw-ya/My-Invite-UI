import { Component, Input, signal, computed, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
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
  @Input() invitations: InvitationCard[] = [];
  @ViewChild('track') trackRef!: ElementRef<HTMLElement>;

  activeFilter = signal('كل التصميمات');
  activeGender = signal('كل التصميمات');
  currentIndex = signal(0);
  visibleCount = signal(this.getVisible());

  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  private isDragging = false;
  private dragStartX = 0;
  private dragDelta = 0;

  categories = ['كل التصميمات', 'حفل زفاف', 'خطبة / حناء', 'حفل تخرج', 'مناقشة رسالة', 'حدث تقني / خاص', 'عيد ميلاد', 'سبوع', 'تهنئة'];

  previewCard = signal<InvitationCard | null>(null);

  filtered = computed(() => {
    const cat = this.activeFilter();
    const gender = this.activeGender();
    let items = this.invitations;
    if (cat !== 'كل التصميمات') items = items.filter(i => i.category === cat);
    if (gender === 'تصميمات ذكورية') items = items.filter(i => i.gender === 'ذكوري');
    else if (gender === 'تصميمات أنثوية') items = items.filter(i => i.gender === 'أنثوي');
    return items;
  });

  maxIndex = computed(() => Math.max(0, this.filtered().length - this.visibleCount()));

  dots = computed(() => Array.from({ length: this.maxIndex() + 1 }, (_, i) => i));

  private getVisible(): number {
    if (typeof window === 'undefined') return 1;
    const w = window.innerWidth;
    if (w > 1200) return 4;
    if (w > 992) return 3;
    if (w > 640) return 2;
    return 1;
  }

  @HostListener('window:resize')
  onResize() {
    this.visibleCount.set(this.getVisible());
    this.currentIndex.set(0);
  }

  constructor(@Inject(PLATFORM_ID) private platformId: object, private router: Router) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.visibleCount.set(this.getVisible());
      this.startAutoPlay();
    }
  }

  ngOnDestroy() { this.stopAutoPlay(); }

  setFilter(cat: string) {
    this.activeFilter.set(cat);
    this.currentIndex.set(0);
  }

  setGender(g: string) {
    this.activeGender.set(g);
    this.currentIndex.set(0);
  }

  prev() {
    this.currentIndex.update(i => Math.max(0, i - 1));
    this.resetAutoPlay();
  }

  next() {
    this.currentIndex.update(i => (i >= this.maxIndex() ? 0 : i + 1));
    this.resetAutoPlay();
  }

  goTo(i: number) {
    this.currentIndex.set(i);
    this.resetAutoPlay();
  }

  translateX = computed(() => -(this.currentIndex() * (100 / this.visibleCount())));

  navigateToDesigns() {
    this.router.navigate(['/designs']);
  }

  private startAutoPlay() {
    this.autoPlayTimer = setInterval(() => this.next(), 3500);
  }

  private stopAutoPlay() {
    if (this.autoPlayTimer) { clearInterval(this.autoPlayTimer); this.autoPlayTimer = null; }
  }

  private resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }

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

  openPreview(card: InvitationCard) {
    this.previewCard.set(card);
    document.body.style.overflow = 'hidden';
  }

  closePreview() {
    this.previewCard.set(null);
    document.body.style.overflow = '';
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
