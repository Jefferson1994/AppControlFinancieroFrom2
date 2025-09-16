import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginUseCase } from '../../../domain/use-cases/use-caseUsuario/login.use-case';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router'; // Importación correcta del Router de Angular
import { CrearCuentaComponent } from '../crear-cuenta/crear-cuenta.component';
@Component({
  selector: 'app-login-app',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, CrearCuentaComponent],
  templateUrl: './login-app.component.html',
  styleUrl: './login-app.component.css'
})
export class LoginAppComponent {
  email: string = '';
  password: string = '';
  showCrearCuentaModal = false;

  constructor(
    private loginCase: LoginUseCase,
    private authService: AuthService,
    private router: Router // Inyección del servicio Router en el constructor
  ) {}

  onSubmit() {
    // 1. Recopila los valores en una estructura JSON
    const credentials = {
      email: this.email,
      password: this.password
    };
    console.log("Login data:", credentials);

    // 2. Llama al caso de uso y maneja la promesa con .then() y .catch()
    this.loginCase.execute(credentials)
      .then(response => {
        console.log('Login successful!', JSON.stringify(response));

        // Guarda la respuesta completa del servidor en el servicio de autenticación
        this.authService.login(response);

        // 3. Verifica el rol del usuario y redirige
        if (response.user.rol.nombre === 'Administrador') {
          console.log('Redirigiendo a la página de administrador...');
          this.router.navigate(['/admin-dashboard']);
        } else {
          console.log('Redirigiendo a la página por defecto...');
          this.router.navigate(['/productos']);
        }
      })
      .catch(error => {
        console.error('Login failed:', error);
        // Aquí se mostraría un mensaje de error al usuario
      });
  }

   abrirModalCrearCuenta(): void {
    this.showCrearCuentaModal = true;
  }

  onModalClosed(): void {
    this.showCrearCuentaModal = false;
  }
}
