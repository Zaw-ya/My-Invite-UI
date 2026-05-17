import { Component, Input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DemoService } from '../../../../services/demo.service';

type Step = 'form' | 'otp' | 'success';

interface Country { name: string; code: string; dialCode: string; flag: string; }

const COUNTRIES: Country[] = [
  { name: 'السعودية',          code: 'SA', dialCode: '966', flag: '🇸🇦' },
  { name: 'الإمارات',          code: 'AE', dialCode: '971', flag: '🇦🇪' },
  { name: 'الكويت',            code: 'KW', dialCode: '965', flag: '🇰🇼' },
  { name: 'قطر',               code: 'QA', dialCode: '974', flag: '🇶🇦' },
  { name: 'البحرين',           code: 'BH', dialCode: '973', flag: '🇧🇭' },
  { name: 'عُمان',             code: 'OM', dialCode: '968', flag: '🇴🇲' },
  { name: 'الأردن',            code: 'JO', dialCode: '962', flag: '🇯🇴' },
  { name: 'مصر',               code: 'EG', dialCode: '20',  flag: '🇪🇬' },
  { name: 'اليمن',             code: 'YE', dialCode: '967', flag: '🇾🇪' },
  { name: 'المغرب',            code: 'MA', dialCode: '212', flag: '🇲🇦' },
  { name: 'العراق',            code: 'IQ', dialCode: '964', flag: '🇮🇶' },
  { name: 'ليبيا',             code: 'LY', dialCode: '218', flag: '🇱🇾' },
  { name: 'الجزائر',           code: 'DZ', dialCode: '213', flag: '🇩🇿' },
  { name: 'تونس',              code: 'TN', dialCode: '216', flag: '🇹🇳' },
  { name: 'سوريا',             code: 'SY', dialCode: '963', flag: '🇸🇾' },
  { name: 'لبنان',             code: 'LB', dialCode: '961', flag: '🇱🇧' },
  { name: 'فلسطين',            code: 'PS', dialCode: '970', flag: '🇵🇸' },
  { name: 'السودان',           code: 'SD', dialCode: '249', flag: '🇸🇩' },
  { name: 'المملكة المتحدة',   code: 'GB', dialCode: '44',  flag: '🇬🇧' },
  { name: 'الولايات المتحدة',  code: 'US', dialCode: '1',   flag: '🇺🇸' },
  { name: 'فرنسا',             code: 'FR', dialCode: '33',  flag: '🇫🇷' },
  { name: 'تركيا',             code: 'TR', dialCode: '90',  flag: '🇹🇷' },
  { name: 'ألمانيا',           code: 'DE', dialCode: '49',  flag: '🇩🇪' },
  { name: 'كندا',              code: 'CA', dialCode: '1',   flag: '🇨🇦' },
  { name: 'أستراليا',          code: 'AU', dialCode: '61',  flag: '🇦🇺' },
];

@Component({
  selector: 'app-demo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './demo-form.html',
  styleUrl: './demo-form.css'
})
export class DemoFormComponent {
  @Input() selectedCardId: number | null = null;

  private demoService = inject(DemoService);

  step = signal<Step>('form');
  loading = signal(false);
  errorMsg = signal('');

  countries = COUNTRIES;
  selectedCountry = COUNTRIES[0]; // Saudi Arabia default
  showCountryDropdown = false;

  name = '';
  phoneLocal = '';
  otp = '';

  get whatsAppNumber(): string {
    return this.selectedCountry.dialCode + this.phoneLocal.replace(/^0+/, '');
  }

  selectCountry(c: Country) {
    this.selectedCountry = c;
    this.showCountryDropdown = false;
  }

  sendOtp() {
    this.errorMsg.set('');
    if (!this.name.trim() || !this.phoneLocal.trim()) {
      this.errorMsg.set('الاسم ورقم الواتساب مطلوبان');
      return;
    }

    this.loading.set(true);
    this.demoService.sendOtp(this.name.trim(), this.whatsAppNumber, this.selectedCardId ?? undefined)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.step.set('otp');
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(err?.error?.message ?? 'حدث خطأ، حاول مرة أخرى');
        }
      });
  }

  verifyOtp() {
    this.errorMsg.set('');
    if (!this.otp.trim()) {
      this.errorMsg.set('أدخل رمز التحقق');
      return;
    }

    this.loading.set(true);
    this.demoService.verifyOtp(this.whatsAppNumber, this.otp.trim())
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.step.set('success');
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMsg.set(err?.error?.message ?? 'رمز التحقق غير صحيح');
        }
      });
  }

  resend() {
    this.otp = '';
    this.phoneLocal = '';
    this.errorMsg.set('');
    this.step.set('form');
  }
}
