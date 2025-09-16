import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root' // 'root' hace que esté disponible en toda la app
})
export class LoadingService {

  private _isLoading = signal<boolean>(false);

  public readonly isLoading = this._isLoading.asReadonly();


  show(): void {
    this._isLoading.set(true);
  }


  hide(): void {
    this._isLoading.set(false);
  }
}
