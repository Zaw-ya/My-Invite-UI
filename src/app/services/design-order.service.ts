import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '../i18n/language.service';
import { BackendContentLocalizer } from '../i18n/backend-content';

@Injectable({ providedIn: 'root' })
export class DesignOrderService {
  private readonly transloco = inject(TranslocoService);
  private readonly languageService = inject(LanguageService);
  private readonly localizer = inject(BackendContentLocalizer);

  // Arabic template, overridable from the backend's site settings
  // ("design-order-message"). Other languages use orderModal.designMessage,
  // since the backend setting is Arabic-only.
  private _messageTemplate = signal('يعجبني تصميم الكارت بالكود "{id}"');
  private _prefillMessage = signal('');
  private _modalTitle = signal('');
  private _showModal = signal(false);

  messageTemplate = this._messageTemplate.asReadonly();
  prefillMessage = this._prefillMessage.asReadonly();
  modalTitle = this._modalTitle.asReadonly();
  showModal = this._showModal.asReadonly();

  setTemplate(template: string) {
    this._messageTemplate.set(template);
  }

  buildMessage(designId: string): string {
    if (this.languageService.activeLanguage().code !== 'ar') {
      return this.transloco.translate('orderModal.designMessage', { id: designId });
    }
    return this._messageTemplate().replace('{id}', designId);
  }

  openModal(designId: string, title?: string) {
    this._prefillMessage.set(this.buildMessage(designId));
    this._modalTitle.set(title || '');
    this._showModal.set(true);
    document.body.style.overflow = 'hidden';
  }

  openModalWithMessage(message: string, title?: string) {
    this._prefillMessage.set(message);
    this._modalTitle.set(title || '');
    this._showModal.set(true);
    document.body.style.overflow = 'hidden';
  }

  /** Opens the order modal pre-filled with a package request in the active language. */
  openPackageOrder(packageName: string, tier: { count: number; price: number }) {
    const details = tier.count > 0
      ? this.transloco.translate('pricing.orderMessageDetails', { count: tier.count, price: tier.price })
      : '';
    const message = this.transloco.translate('pricing.orderMessage', {
      name: this.localizer.localize(packageName),
      details,
    });
    this.openModalWithMessage(message, this.transloco.translate('orderModal.packageTitle'));
  }

  closeModal() {
    this._showModal.set(false);
    this._prefillMessage.set('');
    this._modalTitle.set('');
    document.body.style.overflow = '';
  }
}
