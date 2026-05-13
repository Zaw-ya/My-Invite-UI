import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DesignOrderService {
  private _messageTemplate = signal('يعجبني تصميم الكارت بالكود "{id}"');
  private _prefillMessage = signal('');
  private _showModal = signal(false);

  messageTemplate = this._messageTemplate.asReadonly();
  prefillMessage = this._prefillMessage.asReadonly();
  showModal = this._showModal.asReadonly();

  setTemplate(template: string) {
    this._messageTemplate.set(template);
  }

  buildMessage(designId: string): string {
    return this._messageTemplate().replace('{id}', designId);
  }

  openModal(designId: string) {
    this._prefillMessage.set(this.buildMessage(designId));
    this._showModal.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this._showModal.set(false);
    this._prefillMessage.set('');
    document.body.style.overflow = '';
  }

  // kept for contact section pre-fill (direct link)
  setPrefillMessage(message: string) {
    this._prefillMessage.set(message);
  }

  clearPrefill() {
    this._prefillMessage.set('');
  }
}
