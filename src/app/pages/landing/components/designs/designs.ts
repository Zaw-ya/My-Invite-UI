import { Component, Input, signal, computed, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

  private autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  private isDragging = false;
  private dragStartX = 0;
  private dragDelta = 0;
  readonly VISIBLE = 4;

  categories = ['كل التصميمات', 'حفل زفاف', 'خطبة / حناء', 'حفل تخرج', 'مناقشة رسالة', 'حدث تقني / خاص', 'عيد ميلاد', 'سبوع', 'تهنئة'];

  filtered = computed(() => {
    const cat = this.activeFilter();
    let items = this.invitations;
    if (cat !== 'كل التصميمات') items = items.filter(i => i.category === cat);
    return items;
  });

  maxIndex = computed(() => Math.max(0, this.filtered().length - this.VISIBLE));

  dots = computed(() => Array.from({ length: this.maxIndex() + 1 }, (_, i) => i));

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) this.startAutoPlay();
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

  translateX = computed(() => -(this.currentIndex() * (100 / this.VISIBLE)));

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
