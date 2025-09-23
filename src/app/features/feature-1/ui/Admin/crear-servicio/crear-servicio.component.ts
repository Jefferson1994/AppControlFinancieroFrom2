import { Component, OnInit, ChangeDetectionStrategy, signal, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { crearServicesUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/crear.Servicio.use.case';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-crear-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-servicio.component.html',
  styleUrls: ['./crear-servicio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearServicioComponent implements OnInit {

  constructor(
      private crearServicioUseCase: crearServicesUseCase,
      private authService: AuthService,private router: Router

  ) {}

  @Input() idEmpresa: number | undefined;
  @Input() nombreEmpresa: string | undefined;

  @Output() modalClosed = new EventEmitter<void>();
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  
  loading = true;

  servicio = signal<any>({
    nombre: '',
    descripcion: '',
    precio: null,
    precio_descuento: null,
    porcentaje_descuento: null,
    porcentaje_comision_colaborador: null,
    activo: 0,
    id_negocio: null,
    id_tipo_servicio: null,
    duracion_minutos: null,
  });



  ngOnInit(): void {
    if (this.idEmpresa) {
      this.servicio.update(serv => ({ ...serv, id_negocio: this.idEmpresa }));
      console.log('Creando servicio para la empresa:', this.nombreEmpresa, 'con ID:', this.idEmpresa);
    }
  }

  async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
      const datosServicio = this.servicio();

      try {
        this.loading = true;      // <-- Inicia la carga del componente
        this.loadingService.show(); // <-- Inicia la carga global
        const respuesta = await this.crearServicioUseCase.execute(datosServicio); // ✅ Llama al caso de uso
        console.log('Servicio creado:', respuesta);
        this.alertService.showSuccess('Servicio creado con exito.');
        this.closeModal();
      } catch (error) {
        console.error('Error al crear el servicio:', error);
        this.alertService.showError('No se pudo crear el servicio.');
      }finally{
        this.loading = false;     // <-- Detiene la carga del componente
        this.loadingService.hide()
      }
    } else {
      console.log('Formulario no válido. Por favor, revisa los campos.');
    }
  }

  onCancel(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.modalClosed.emit();
  }
}
