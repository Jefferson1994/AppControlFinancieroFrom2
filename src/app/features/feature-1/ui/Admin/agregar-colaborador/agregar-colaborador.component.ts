import { Component, OnInit, ChangeDetectionStrategy, signal, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { buscarUserUseCase } from '../../../../feature-1/domain/use-cases/use-caseUsuario/userBusca.use-case';
import { agregarColaboradorServicesUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/agregarColaborador.Servicio.use.case';
import { AuthService } from '../../../services/auth.service';
import { AgregarColaboradorDTO } from '../../../domain/models/empresa.models';
import { LoadingService } from '../../../services/loading.service';
import { AlertService } from '../../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-agregar-colaborador',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './agregar-colaborador.component.html',
  styleUrl: './agregar-colaborador.component.css'
})
export class AgregarColaboradorComponent implements OnInit {

  @Input() idEmpresa: number | undefined;
  @Input() nombreEmpresa: string | undefined;
  @Output() modalClosed = new EventEmitter<void>();
  private loadingService = inject(LoadingService);
  private alertService = inject(AlertService);
  loading = false;

  constructor(
      private buscarUserUseCase: buscarUserUseCase,
      private authService: AuthService,
      private router: Router,
      private agregarColaboradorServicesUseCase : agregarColaboradorServicesUseCase,
    ) {}

  // ✅ Objeto para el formulario
  cedulaData = signal<any>({ cedula: '' });
  colaboradorData = signal<any>({
    cedula: '',
    nombre: '',
    correo: '',
    numero_telefono: '',
    numero_identificacion: '',
    id_negocio: null,
    codigo_punto_emision_movil: ''
  });

  // ✅ Estado para controlar la habilitación de los campos
  camposBloqueados = signal<boolean>(true);
  desbloquepunto = signal<boolean>(true);
  ngOnInit(): void {
    if (this.idEmpresa) {
      this.colaboradorData.update(data => ({ ...data, id_negocio: this.idEmpresa }));
      console.log('Agregando colaborador a la empresa:', this.nombreEmpresa, 'con ID:', this.idEmpresa);
    }
  }

  async onBuscarColaborador(): Promise<void> {
    // ✅ Usa una variable local para obtener el valor de la señal
    const cedula = this.cedulaData().cedula;

    
    if (!cedula || cedula.length !== 10) {
      this.colaboradorData.set(null); 
      this.camposBloqueados.set(false); 
      return; 
    }


    try {
      this.loading = true;      // <-- Inicia la carga del componente
      this.loadingService.show(); // <-- Inicia la carga global
      console.log('Buscando colaborador con cédula:', cedula);
      const userCredentials = { cedula: cedula };
      const respuesta = await this.buscarUserUseCase.execute(userCredentials);
      console.log('la respues de consulta',JSON.stringify(respuesta))

      if (respuesta && respuesta) {
        this.colaboradorData.set(respuesta);
        this.camposBloqueados.set(true); // Bloquea los campos si se encuentra al colaborador
        this.desbloquepunto.set(false);
        this.loading = false;     // <-- Detiene la carga del componente
        this.loadingService.hide();
      } else {
        console.log('No se encontró un colaborador con esa cédula.');
        this.colaboradorData.set(null);
        this.camposBloqueados.set(false); // Desbloquea los campos para que se puedan editar
        this.desbloquepunto.set(true);
        this.loading = false;     // <-- Detiene la carga del componente
        this.loadingService.hide();
      }
    } catch (error) {
      console.error('Error al buscar colaborador:', error);
      this.colaboradorData.set(null);
      this.camposBloqueados.set(false); // Desbloquea los campos en caso de error
      this.desbloquepunto.set(true);

    }finally {
      this.loading = false;  
      this.loadingService.hide(); 
    }
  }

  async onAgregarColaborador(): Promise<void> {
    const colaborador = this.colaboradorData();
    if (!this.idEmpresa || !colaborador.id || !colaborador.codigo_punto_emision_movil) {
      console.error('Datos incompletos para agregar el colaborador.');
      return;
    }

    // ✅ Se crea el DTO con los datos del formulario y del componente
    const datosParaAPI: AgregarColaboradorDTO = {
      id_negocio: this.idEmpresa,
      id_usuario: colaborador.id,
      codigo_punto_emision_movil: colaborador.codigo_punto_emision_movil,
    };

    try {
      // ✅ Se llama al caso de uso para enviar la data
      this.loading = true;      // <-- Inicia la carga del componente
      this.loadingService.show();
      const respuesta = await this.agregarColaboradorServicesUseCase.execute(datosParaAPI);
      console.log('Colaborador agregado exitosamente:', respuesta);
      this.closeModal();
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 400) {
      // 1. Extrae el mensaje específico del backend.
        const mensajeDelBackend = error.error.mensaje;
        
        // 2. Muestra ese mensaje al usuario.
        this.alertService.showError(mensajeDelBackend);

      } else {
        // Manejo para cualquier otro tipo de error.
        this.alertService.showError('Ocurrió un error inesperado. Inténtelo de nuevo.');
        console.error('Error no controlado:', error);
      }
    }finally{
      this.loading = false;
      this.loadingService.hide();
    }
  }

  onCancel(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.modalClosed.emit();
  }
}


