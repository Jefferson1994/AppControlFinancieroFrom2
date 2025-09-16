import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }


  showSuccess(message: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      showConfirmButton: false,
      timer: 1500
    });
  }


  showError(message: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  }
}
