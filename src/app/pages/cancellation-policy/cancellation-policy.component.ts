import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-cancellation-policy',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './cancellation-policy.component.html',
  styleUrl: './cancellation-policy.component.css'
})
export class CancellationPolicyComponent implements OnInit {
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.updateSeo({
      title: 'سياسة الإلغاء | كروتي الخاصة .نت',
      description: 'تعرف على سياسة الإلغاء واسترداد الأموال الخاصة بخدمات كروتي الخاصة .نت.',
      canonical: 'https://specialcards.net/cancellation-policy',
      ogType: 'website',
    });
  }
}
