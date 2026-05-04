import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-designs-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, NavbarComponent, FooterComponent],
  templateUrl: './designs-page.component.html',
  styleUrl: './designs-page.component.css'
})
export class DesignsPageComponent {
  designs = Array.from({ length: 24 }, (_, i) => ({
    id: String(i + 1),
    title: `تصميم ${String(i + 1001).padStart(4, '0')}`,
    category: ['حفل زفاف', 'خطبة / حناء', 'حفل تخرج', 'مناقشة رسالة', 'حدث تقني / خاص', 'عيد ميلاد', 'سبوع', 'تهنئة'][i % 8],
    gender: (i % 2 === 0 ? 'ذكوري' : 'أنثوي') as 'ذكوري' | 'أنثوي',
    price: ['120', '150', '180', '200', '250'][i % 5],
    imageUrl: `image/${(i % 8) + 1}.png`,
    isNew: i < 6
  }));

  categories = ['كل التصميمات', 'حفل زفاف', 'خطبة / حناء', 'حفل تخرج', 'مناقشة رسالة', 'حدث تقني / خاص', 'عيد ميلاد', 'سبوع', 'تهنئة'];
  activeCategory = 'كل التصميمات';

  genders = ['كل التصميمات', 'تصميمات ذكورية', 'تصميمات أنثوية'];
  activeGender = 'كل التصميمات';

  filteredDesigns() {
    let items = this.designs;
    if (this.activeCategory !== 'كل التصميمات') items = items.filter(d => d.category === this.activeCategory);
    if (this.activeGender === 'تصميمات ذكورية') items = items.filter(d => d.gender === 'ذكوري');
    else if (this.activeGender === 'تصميمات أنثوية') items = items.filter(d => d.gender === 'أنثوي');
    return items;
  }

  previewDesign: typeof this.designs[0] | null = null;

  openPreview(design: typeof this.designs[0]) {
    this.previewDesign = design;
    document.body.style.overflow = 'hidden';
  }

  closePreview() {
    this.previewDesign = null;
    document.body.style.overflow = '';
  }
}
