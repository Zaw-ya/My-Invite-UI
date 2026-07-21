import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-privacy-section',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './privacy-section.html',
  styleUrl: './privacy-section.css'
})
export class PrivacySectionComponent {}
