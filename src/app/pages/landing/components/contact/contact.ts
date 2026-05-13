import { Component, OnInit, signal, computed, ElementRef, ViewChild, HostListener, PLATFORM_ID, Inject, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../../../environments/environment';
import { ContentService } from '../../../../services/content.service';

interface RawCountry {
  name: { common: string };
  cca2: string;
  idd: { root?: string; suffixes?: string[] };
  flags: { png: string; svg: string };
}

interface Country {
  name: string;
  alpha2Code: string;
  callingCodes: string[];
  flags: { png: string; svg: string };
}

function toCountry(r: RawCountry): Country | null {
  const root = r.idd?.root ?? '';
  const suffix = r.idd?.suffixes?.[0] ?? '';
  if (!root) return null;
  const code = (root + suffix).replace('+', '');
  return {
    name: r.name.common,
    alpha2Code: r.cca2,
    callingCodes: [code],
    flags: r.flags,
  };
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent implements OnInit {
  contentService = inject(ContentService);
  settings = this.contentService.siteSettings;
  
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  form = { name: '', email: '', phone: '', message: '' };
  submitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal('');

  countries = signal<Country[]>([]);
  selectedCountry = signal<Country | null>(null);
  searchQuery = signal('');
  dropdownOpen = signal(false);
  loading = signal(true);

  filteredCountries = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.countries();
    return this.countries().filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.callingCodes[0] || '').includes(q)
    );
  });

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<RawCountry[]>('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flags').subscribe({
      next: (data) => {
        const sorted = data
          .map(toCountry)
          .filter((c): c is Country => c !== null)
          .sort((a, b) => a.name.localeCompare(b.name));
        this.countries.set(sorted);
        // Default: Saudi Arabia
        const sa = sorted.find(c => c.alpha2Code === 'SA') || sorted[0];
        this.selectedCountry.set(sa);
        this.loading.set(false);
      },
      error: () => {
        // Fallback if API fails
        this.countries.set([
          { name: 'Saudi Arabia',        alpha2Code: 'SA', callingCodes: ['966'], flags: { png: 'https://flagcdn.com/w320/sa.png', svg: '' } },
          { name: 'United Arab Emirates',alpha2Code: 'AE', callingCodes: ['971'], flags: { png: 'https://flagcdn.com/w320/ae.png', svg: '' } },
          { name: 'Kuwait',              alpha2Code: 'KW', callingCodes: ['965'], flags: { png: 'https://flagcdn.com/w320/kw.png', svg: '' } },
          { name: 'Qatar',               alpha2Code: 'QA', callingCodes: ['974'], flags: { png: 'https://flagcdn.com/w320/qa.png', svg: '' } },
          { name: 'Bahrain',             alpha2Code: 'BH', callingCodes: ['973'], flags: { png: 'https://flagcdn.com/w320/bh.png', svg: '' } },
          { name: 'Oman',                alpha2Code: 'OM', callingCodes: ['968'], flags: { png: 'https://flagcdn.com/w320/om.png', svg: '' } },
          { name: 'Jordan',              alpha2Code: 'JO', callingCodes: ['962'], flags: { png: 'https://flagcdn.com/w320/jo.png', svg: '' } },
          { name: 'Egypt',               alpha2Code: 'EG', callingCodes: ['20'],  flags: { png: 'https://flagcdn.com/w320/eg.png', svg: '' } },
          { name: 'Iraq',                alpha2Code: 'IQ', callingCodes: ['964'], flags: { png: 'https://flagcdn.com/w320/iq.png', svg: '' } },
          { name: 'Lebanon',             alpha2Code: 'LB', callingCodes: ['961'], flags: { png: 'https://flagcdn.com/w320/lb.png', svg: '' } },
          { name: 'Yemen',               alpha2Code: 'YE', callingCodes: ['967'], flags: { png: 'https://flagcdn.com/w320/ye.png', svg: '' } },
          { name: 'Syria',               alpha2Code: 'SY', callingCodes: ['963'], flags: { png: 'https://flagcdn.com/w320/sy.png', svg: '' } },
          { name: 'Morocco',             alpha2Code: 'MA', callingCodes: ['212'], flags: { png: 'https://flagcdn.com/w320/ma.png', svg: '' } },
          { name: 'Tunisia',             alpha2Code: 'TN', callingCodes: ['216'], flags: { png: 'https://flagcdn.com/w320/tn.png', svg: '' } },
          { name: 'Algeria',             alpha2Code: 'DZ', callingCodes: ['213'], flags: { png: 'https://flagcdn.com/w320/dz.png', svg: '' } },
          { name: 'Sudan',               alpha2Code: 'SD', callingCodes: ['249'], flags: { png: 'https://flagcdn.com/w320/sd.png', svg: '' } },
          { name: 'United Kingdom',      alpha2Code: 'GB', callingCodes: ['44'],  flags: { png: 'https://flagcdn.com/w320/gb.png', svg: '' } },
          { name: 'United States',       alpha2Code: 'US', callingCodes: ['1'],   flags: { png: 'https://flagcdn.com/w320/us.png', svg: '' } },
          { name: 'France',              alpha2Code: 'FR', callingCodes: ['33'],  flags: { png: 'https://flagcdn.com/w320/fr.png', svg: '' } },
          { name: 'Germany',             alpha2Code: 'DE', callingCodes: ['49'],  flags: { png: 'https://flagcdn.com/w320/de.png', svg: '' } },
          { name: 'Turkey',              alpha2Code: 'TR', callingCodes: ['90'],  flags: { png: 'https://flagcdn.com/w320/tr.png', svg: '' } },
          { name: 'India',               alpha2Code: 'IN', callingCodes: ['91'],  flags: { png: 'https://flagcdn.com/w320/in.png', svg: '' } },
          { name: 'Pakistan',            alpha2Code: 'PK', callingCodes: ['92'],  flags: { png: 'https://flagcdn.com/w320/pk.png', svg: '' } },
          { name: 'Bangladesh',          alpha2Code: 'BD', callingCodes: ['880'], flags: { png: 'https://flagcdn.com/w320/bd.png', svg: '' } },
          { name: 'Philippines',         alpha2Code: 'PH', callingCodes: ['63'],  flags: { png: 'https://flagcdn.com/w320/ph.png', svg: '' } },
        ].sort((a, b) => a.name.localeCompare(b.name)));
        this.selectedCountry.set(this.countries()[0]);
        this.loading.set(false);
      }
    });
  }

  selectCountry(c: Country) {
    this.selectedCountry.set(c);
    this.dropdownOpen.set(false);
    this.searchQuery.set('');
  }

  toggleDropdown() {
    this.dropdownOpen.update(v => !v);
    if (this.dropdownOpen()) this.searchQuery.set('');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(e.target)) {
      this.dropdownOpen.set(false);
    }
  }

  get callingCode() {
    return this.selectedCountry()?.callingCodes[0] || '';
  }

  submit() {
    if (this.submitting()) return;
    if (!this.form.name || !this.form.email || !this.form.phone || !this.form.message) {
      this.submitError.set('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    this.submitting.set(true);
    this.submitError.set('');
    this.submitSuccess.set(false);

    this.http.post(`${environment.apiUrl}/Contacts`, {
      name: this.form.name,
      email: this.form.email,
      phoneNumber: `+${this.callingCode}${this.form.phone}`,
      message: this.form.message,
    }).subscribe({
      next: () => {
        this.submitSuccess.set(true);
        this.submitting.set(false);
        this.form = { name: '', email: '', phone: '', message: '' };
      },
      error: (err) => {
        this.submitting.set(false);
        this.submitError.set(err?.error?.message || 'حدث خطأ أثناء الإرسال، يرجى المحاولة مجدداً.');
      }
    });
  }
}
