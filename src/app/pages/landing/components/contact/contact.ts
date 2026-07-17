import { Component, signal, computed, ElementRef, ViewChild, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { environment } from '../../../../../environments/environment';
import { ContentService } from '../../../../services/content.service';
import { CountriesService, DisplayCountry } from '../../../../shared/countries.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, TranslocoModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  contentService = inject(ContentService);
  settings = this.contentService.siteSettings;
  private http = inject(HttpClient);
  private countriesService = inject(CountriesService);
  private transloco = inject(TranslocoService);

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  form = { name: '', email: '', phone: '', message: '' };
  submitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal('');

  countries = this.countriesService.countries;
  selectedCountry = signal<DisplayCountry>(this.countriesService.defaultCountry());
  searchQuery = signal('');
  dropdownOpen = signal(false);

  filteredCountries = computed(() => this.countriesService.filter(this.searchQuery()));

  selectCountry(c: DisplayCountry) {
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
    return this.selectedCountry().dialCode;
  }

  submit() {
    if (this.submitting()) return;
    if (!this.form.name || !this.form.email || !this.form.phone || !this.form.message) {
      this.submitError.set(this.transloco.translate('contact.form.errors.allFieldsRequired'));
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
        this.submitError.set(err?.error?.message || this.transloco.translate('contact.form.errors.genericError'));
      }
    });
  }
}
