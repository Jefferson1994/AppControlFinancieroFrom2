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

  async showConfirm(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });

    // Devuelve true si el usuario hizo clic en "Sí, continuar"
    return result.isConfirmed;
  }
}
