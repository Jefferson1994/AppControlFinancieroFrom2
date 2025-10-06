import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginUseCase } from '../../../domain/use-cases/use-caseUsuario/login.use-case';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router'; // Importación correcta del Router de Angular
import { CrearCuentaComponent } from '../crear-cuenta/crear-cuenta.component';
import { LoadingService } from '../../../services/loading.service';
import { AlertService } from '../../../services/alert.service';
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
   private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  async onSubmit() {
    if (!this.email || !this.password) {
      this.alertService.showError('Debe ingresar su correo y contraseña.');
      return;
    }
    const credentials = {
      email: this.email,
      password: this.password
    };
    console.log("Login datasssss:", credentials);

    try {
      this.loadingService.show();

      const response = await this.loginCase.execute(credentials);
      console.log('Login successful!', JSON.stringify(response));
      this.authService.login(response);

      if (response.user.rol.nombre === 'Administrador') {
        console.log('Redirigiendo a la página de administrador...');
        this.router.navigate(['/admin-dashboard']);
      } else if (response.user.rol.nombre === 'Colaborador') {
        console.log('esta en la pagina del Colaborador');
        this.router.navigate(['/admin-dashboard']);
      } else if (response.user.rol.nombre === 'Admin Sistema') {
        console.log('esta en la pagina del Admin Sistema');
        this.router.navigate(['/admin-dashboard']);
      }else if (response.user.rol.nombre === 'Cliente') {
        console.log('esta en la pagina del Cliente');
        this.router.navigate(['/Cliente-dashboard']);
      }

    } catch (error) {
      console.error('Login failed:', error);
      this.alertService.showError('No se pudo iniciar sesión. Verifique sus credenciales.');
    } finally {
      this.loadingService.hide();
    }
  }


   abrirModalCrearCuenta(): void {
    this.showCrearCuentaModal = true;
  }

  onModalClosed(): void {
    this.showCrearCuentaModal = false;
  }
}
