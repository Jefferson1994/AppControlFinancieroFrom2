// En: src/app/servicios/location.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Coordenadas {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  public getUserLocation(): Observable<Coordenadas> {
    return new Observable(observer => {
      if (!navigator.geolocation) {
        observer.error('La geolocalización no es compatible con este navegador.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          observer.complete();
        },
        (error) => {
          let message = '';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Permiso de ubicación denegado.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Información de ubicación no disponible.';
              break;
            case error.TIMEOUT:
              message = 'La solicitud de ubicación ha caducado.';
              break;
            default:
              message = 'Ocurrió un error desconocido.';
          }
          observer.error(message);
        }
      );
    });
  }
}
