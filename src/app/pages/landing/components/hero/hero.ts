import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface EventTag {
  label: string;
  imageUrl: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './hero.html',
  styleUrl: './hero.css'
})
export class HeroComponent {
  tags: EventTag[] = [
    { label: 'حفل زفاف',                                      imageUrl: 'image/1.png' },
    { label: 'خطبة / حناء',                                   imageUrl: 'image/2.png' },
    { label: 'حفل تخرج',                                      imageUrl: 'image/3.png' },
    { label: 'مناقشة رسالة',                                  imageUrl: 'image/4.png' },
    { label: 'حدث تقني / أدبي / خاص بشركتك/ خلافه..', imageUrl: 'image/5.png' },
    { label: 'عيد ميلاد',                                     imageUrl: 'image/6.png' },
    { label: 'سبوع',                                           imageUrl: 'image/7.png' },
    { label: 'تهنئة',                                          imageUrl: 'image/8.png' },
  ];

  activeTag = signal<EventTag | null>(null);

  selectTag(tag: EventTag) {
    this.activeTag.set(this.activeTag()?.label === tag.label ? null : tag);
  }
}
