import {
  Component, OnInit, signal, computed,
  ElementRef, ViewChild, HostListener, PLATFORM_ID, Inject, inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { DesignOrderService } from '../../services/design-order.service';
import { environment } from '../../../environments/environment';

interface Country {
  name: string;
  alpha2Code: string;
  callingCode: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { name: 'Saudi Arabia',         alpha2Code: 'SA', callingCode: '966', flag: 'https://flagcdn.com/w320/sa.png' },
  { name: 'United Arab Emirates', alpha2Code: 'AE', callingCode: '971', flag: 'https://flagcdn.com/w320/ae.png' },
  { name: 'Kuwait',               alpha2Code: 'KW', callingCode: '965', flag: 'https://flagcdn.com/w320/kw.png' },
  { name: 'Qatar',                alpha2Code: 'QA', callingCode: '974', flag: 'https://flagcdn.com/w320/qa.png' },
  { name: 'Bahrain',              alpha2Code: 'BH', callingCode: '973', flag: 'https://flagcdn.com/w320/bh.png' },
  { name: 'Oman',                 alpha2Code: 'OM', callingCode: '968', flag: 'https://flagcdn.com/w320/om.png' },
  { name: 'Jordan',               alpha2Code: 'JO', callingCode: '962', flag: 'https://flagcdn.com/w320/jo.png' },
  { name: 'Egypt',                alpha2Code: 'EG', callingCode: '20',  flag: 'https://flagcdn.com/w320/eg.png' },
  { name: 'Yemen',                alpha2Code: 'YE', callingCode: '967', flag: 'https://flagcdn.com/w320/ye.png' },
  { name: 'Morocco',              alpha2Code: 'MA', callingCode: '212', flag: 'https://flagcdn.com/w320/ma.png' },
  { name: 'Iraq',                 alpha2Code: 'IQ', callingCode: '964', flag: 'https://flagcdn.com/w320/iq.png' },
  { name: 'Libya',                alpha2Code: 'LY', callingCode: '218', flag: 'https://flagcdn.com/w320/ly.png' },
  { name: 'Algeria',              alpha2Code: 'DZ', callingCode: '213', flag: 'https://flagcdn.com/w320/dz.png' },
  { name: 'Tunisia',              alpha2Code: 'TN', callingCode: '216', flag: 'https://flagcdn.com/w320/tn.png' },
  { name: 'United Kingdom',       alpha2Code: 'GB', callingCode: '44',  flag: 'https://flagcdn.com/w320/gb.png' },
  { name: 'United States',        alpha2Code: 'US', callingCode: '1',   flag: 'https://flagcdn.com/w320/us.png' },
  { name: 'France',               alpha2Code: 'FR', callingCode: '33',  flag: 'https://flagcdn.com/w320/fr.png' },
  { name: 'Turkey',               alpha2Code: 'TR', callingCode: '90',  flag: 'https://flagcdn.com/w320/tr.png' },
].sort((a, b) => a.name.localeCompare(b.name));

@Component({
  selector: 'app-order-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './order-modal.component.html',
  styleUrl: './order-modal.component.css'
})
export class OrderModalComponent implements OnInit {
  @ViewChild('phoneRef') phoneRef!: ElementRef;

  readonly designOrderService = inject(DesignOrderService);
  private readonly http = inject(HttpClient);

  name = '';
  email = '';
  phone = '';
  message = '';

  submitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal('');

  countries = COUNTRIES;
  selectedCountry = signal<Country>(COUNTRIES.find(c => c.alpha2Code === 'SA')!);
  searchQuery = signal('');
  dropdownOpen = signal(false);

  filteredCountries = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.countries;
    return this.countries.filter(c =>
      c.name.toLowerCase().includes(q) || c.callingCode.includes(q)
    );
  });

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    // Set the pre-filled message when the modal mounts (it only mounts when open)
    this.message = this.designOrderService.prefillMessage();
  }

  selectCountry(c: Country) {
    this.selectedCountry.set(c);
    this.dropdownOpen.set(false);
    this.searchQuery.set('');
  }

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
  }

  closeDropdown(e: Event) {
    if (this.phoneRef && !this.phoneRef.nativeElement.contains(e.target)) {
      this.dropdownOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.close(); }

  close() {
    this.designOrderService.closeModal();
  }

  submit() {
    if (this.submitting()) return;
    if (!this.name || !this.email || !this.phone || !this.message) {
      this.submitError.set('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }
    this.submitting.set(true);
    this.submitError.set('');

    this.http.post(`${environment.apiUrl}/Contacts`, {
      name: this.name,
      email: this.email,
      phoneNumber: `+${this.selectedCountry().callingCode}${this.phone}`,
      message: this.message,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitSuccess.set(true);
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(err?.error?.message || 'حدث خطأ أثناء الإرسال، يرجى المحاولة مجدداً.');
      }
    });
  }
}
