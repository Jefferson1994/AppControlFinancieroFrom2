// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserResponse } from '../domain/models/userModelos'; // La interfaz corregida

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSource = new BehaviorSubject<UserResponse | null>(null);
  user$: Observable<UserResponse | null> = this.userSource.asObservable();

  constructor() {
    this.loadUserSession();
  }

  // Método para guardar el token y el usuario
  login(response: UserResponse): void {
    localStorage.setItem('authToken', response.token);
    // ✅ Usa 'response.user' en lugar de 'response.usuario'
    localStorage.setItem('user', JSON.stringify(response.user));
    this.userSource.next(response);
  }

  // Método para cargar la sesión desde localStorage
  private loadUserSession(): void {
    const token = localStorage.getItem('authToken');
    const userString = localStorage.getItem('user');

    if (token && userString) {
      try {
        // ✅ Obtiene el objeto 'user' del localStorage
        const user = JSON.parse(userString);

        // ✅ Creamos un objeto UserResponse completo para restaurar la sesión
        const restoredUser: UserResponse = {
          token: token,
          user: user,
          message: 'Sesión restaurada' // Propiedad necesaria según tu interfaz
        };
        this.userSource.next(restoredUser);
        console.log('Sesión restaurada desde el almacenamiento local.');
      } catch (e) {
        console.error('Error al restaurar la sesión:', e);
        this.logout(); // Si el JSON está corrupto, cerramos la sesión
      }
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.userSource.next(null);
  }

  // Nuevo método público para obtener el usuario
  getCurrentUser(): UserResponse | null {
    return this.userSource.getValue();
  }
}
