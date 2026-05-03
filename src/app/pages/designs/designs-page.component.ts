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
    category: ['حفلات زفاف', 'خطبة / حناء', 'حفل تخرج', 'مناقشة رسالة', 'حدث تقني', 'عيد ميلاد', 'سبوع', 'تهنئة'][i % 8],
    price: ['120', '150', '180', '200', '250'][i % 5],
    imageUrl: `image/${(i % 8) + 1}.png`,
    isNew: i < 6
  }));

  categories = ['الكل', 'حفلات زفاف', 'خطبة / حناء', 'حفل تخرج', 'مناقشة رسالة', 'حدث تقني', 'عيد ميلاد', 'سبوع', 'تهنئة'];
  activeCategory = 'الكل';

  filteredDesigns() {
    if (this.activeCategory === 'الكل') return this.designs;
    return this.designs.filter(d => d.category === this.activeCategory);
  }
}
