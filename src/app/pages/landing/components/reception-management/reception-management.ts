import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-reception-management',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './reception-management.html',
  styleUrl: './reception-management.css'
})
export class ReceptionManagementComponent {}
