import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule], // Necesitamos CommonModule para usar *ngIf
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {
  // Hacemos el servicio público para poder usarlo en la plantilla HTML
  public loadingService = inject(LoadingService);
}
