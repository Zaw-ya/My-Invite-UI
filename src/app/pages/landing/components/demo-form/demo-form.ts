import { Component, Input, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { DemoService } from '../../../../services/demo.service';
import { CountriesService, DisplayCountry } from '../../../../shared/countries.service';
import { ScrollService } from '../../../../services/scroll.service';

type Step = 'form' | 'otp' | 'success';

@Component({
  selector: 'app-demo-form',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, TranslocoModule],
  templateUrl: './demo-form.html',
  styleUrl: './demo-form.css'
})
export class DemoFormComponent {
  @Input() selectedCardId: number | null = null;

  private demoService = inject(DemoService);
  private countriesService = inject(CountriesService);
  private transloco = inject(TranslocoService);
  readonly scrollService = inject(ScrollService);

  step = signal<Step>('form');
  loading = signal(false);
  errorMsg = signal('');

  countries = this.countriesService.countries;
  selectedCountry = signal<DisplayCountry>(this.countriesService.defaultCountry());
  showCountryDropdown = false;

  name = '';
  phoneLocal = '';
  otp = '';

  get whatsAppNumber(): string {
    return this.selectedCountry().dialCode + this.phoneLocal.replace(/^0+/, '');
  }

  selectCountry(c: DisplayCountry) {
    this.selectedCountry.set(c);
    this.showCountryDropdown = false;
  }

  sendOtp() {
    this.errorMsg.set('');
    if (!this.name.trim() || !this.phoneLocal.trim()) {
      this.errorMsg.set(this.transloco.translate('demoForm.errors.nameAndPhoneRequired'));
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
          this.errorMsg.set(err?.error?.message ?? this.transloco.translate('demoForm.errors.genericError'));
        }
      });
  }

  verifyOtp() {
    this.errorMsg.set('');
    if (!this.otp.trim()) {
      this.errorMsg.set(this.transloco.translate('demoForm.errors.otpRequired'));
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
          this.errorMsg.set(err?.error?.message ?? this.transloco.translate('demoForm.errors.otpInvalid'));
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
