import { Component, ChangeDetectionStrategy, signal, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CiudadanoEstandar, CrearUsuarioResponse, RolUsuario } from '../../../domain/models/userModelos';
import { crearUsuarioUseCase } from '../../../domain/use-cases/use-caseUsuario/crearUsuario.use-case';
import { buscarUserCiudadanoUseCase } from '../../../domain/use-cases/use-caseUsuario/userBuscarCiudadano.use.case';
import { UserRolUseCase } from '../../../domain/use-cases/use-caseUsuario/roles.use-case';
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.css'],
})
export class CrearCuentaComponent implements OnInit  {

  @Output() modalClosed = new EventEmitter<void>();
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  loading = true;


  registro: any = {
    nombre: '',
    correo: '',
    contrasena: '',
    id_rol: null,
    numero_telefono: '',
    numero_identificacion: '',
  };

  public roles: RolUsuario[] = [];
  identificacionParaValidar: string = '';
  ciudadanoValidado: CiudadanoEstandar | null = null;
  errorValidacion: string | null = null;


  constructor(private router: Router, private  crearUserUseCase :crearUsuarioUseCase,
    private rolesUseCase: UserRolUseCase,private BuscarUserCiudadanoUseCase:buscarUserCiudadanoUseCase) {}

 async ngOnInit(): Promise<void> {
    try {
      this.loadingService.show();
      console.log('Obteniendo roles...');
      this.roles = await this.rolesUseCase.execute();
      console.log('Roles cargadosssss:', JSON.stringify(this.roles));
    } catch (error) {
      console.error('Error al cargar los roles:', error);
      this.alertService.showError('No se pudieron cargar los roles para el registro.');
    }finally{
      //this.loadingService.show();
      this.loadingService.hide();
    }
  }



  async onSubmit(form: NgForm): Promise<void> {
    if (!form.valid) {
      console.log('Formulario no válido. Por favor, revisa los campos.');
      return;
    }

    try {
      const respuesta: CrearUsuarioResponse = await this.crearUserUseCase.execute(this.registro);
      this.alertService.showSuccess(respuesta.mensaje).then(() => {
          this.closeModal();
        });
      console.log('Usuario creado exitosamente:', respuesta);
      //this.closeModal();


    } catch (error) {
      console.error('Error al crear el usuario:', JSON.stringify(error));
      let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';
      if (error instanceof Error) {
          errorMessage = error.message;
      }


    this.alertService.showError(errorMessage);
      // Muestra un mensaje de error al usuario
    }
  }

  onCancel(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.modalClosed.emit();
  }

    async onIdentificacionChange(): Promise<void> {
      // 1. Validar la longitud antes de hacer la llamada
      console.log('Identificación ingresada:', this.registro.numero_identificacion);
      if (this.registro.numero_identificacion.length !== 10) {
        // No hacemos nada si no es una cédula de 10 dígitos
        this.ciudadanoValidado = null;
        return;
      }

 
      this.ciudadanoValidado = null;
      this.errorValidacion = null;

      try {
        this.loadingService.show();
        const request = { tipo: 'C', identificacion: this.registro.numero_identificacion };

        // 3. Ejecutar el caso de uso
        const respuesta = await this.BuscarUserCiudadanoUseCase.execute(request);

        // 4. Manejar la respuesta
        if (respuesta.ok && respuesta.datos) {
          this.ciudadanoValidado = respuesta.datos;
          this.registro.nombre = this.ciudadanoValidado.Nombres + ' '+ this.ciudadanoValidado.Nombres + ' '+respuesta.datos.fechaNacimiento+ ' '+respuesta.datos.edad;
          console.log('Ciudadano validado:', this.ciudadanoValidado);
          // Aquí podrías autocompletar otros campos del formulario
        } else {
          this.errorValidacion = 'La identificación no es válida o no se encontró.';
        }

      } catch (error) {
        console.error('Error al validar ciudadano:', error);
        this.errorValidacion = 'Ocurrió un error al conectar con el servicio.';
      } finally {
        // 5. Ocultar el indicador de carga, tanto en éxito como en error
        this.loadingService.hide();

      }
    }

}
