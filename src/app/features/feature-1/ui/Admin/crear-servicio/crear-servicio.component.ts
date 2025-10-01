import { Component, OnInit, ChangeDetectionStrategy, signal, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { crearServicesUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/crear.Servicio.use.case';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { TipoServicio } from '../../../domain/models/empresa.models';
import { listarTiposServiciosxEmpresaUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/listarTipoServicioXEmpresa.use.case';


@Component({
  selector: 'app-crear-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-servicio.component.html',
  styleUrls: ['./crear-servicio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearServicioComponent implements OnInit {


  @Input() idEmpresa: number | undefined;
  @Input() nombreEmpresa: string | undefined;
  @Input() idTipoEmpresa: number | undefined | null;

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
    activo: 1,
    id_negocio: null,
    id_tipo_servicio: null,
    duracion_minutos: null,
  });
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  isDragging = false;
  imagenes!: string[];

  tiposDeServicio = signal<TipoServicio[]>([]);

    // Señal para manejar errores (buena práctica)
  error = signal<string | null>(null);

  constructor(
      private crearServicioUseCase: crearServicesUseCase,
      private authService: AuthService,private router: Router,
      private cd: ChangeDetectorRef, private listaTiposServicio : listarTiposServiciosxEmpresaUseCase

  ) {}



  ngOnInit(): void {
    if (this.idEmpresa) {
      this.servicio.update(serv => ({ ...serv, id_negocio: this.idEmpresa }));
      console.log('Creando servicio para la empresa:', this.nombreEmpresa, 'con ID:', this.idEmpresa);
      this.cargarTiposDeServicios(this.idTipoEmpresa ||  0);
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

  //manejar imagenes
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }


  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(files);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(input.files);
      input.value = '';
    }
  }


  private processFiles(files: FileList): void {
    Array.from(files).forEach(file => {
      if (this.selectedFiles.length < 4 && file.type.startsWith('image/')) {
        this.selectedFiles.push(file);
        this.previewImage(file);
      }
    });
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviews.push(reader.result as string);
      this.cd.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  async cargarTiposDeServicios(idEmpresa: number): Promise<void> {
    try {
      this.loading = true;      // <-- Inicia la carga del componente
      this.loadingService.show();

      const respuesta = await this.listaTiposServicio.execute(idEmpresa);
      console.log('la respuesta de los tipos de servicios',JSON.stringify(respuesta))
      this.tiposDeServicio.set(respuesta);

    } catch (err: any) {
      // Si ocurre un error, lo guardamos para mostrarlo en el HTML
      this.error.set('No se pudieron cargar los tipos de producto.');
      console.error(err);
    }finally{
        this.loading = false;     // <-- Detiene la carga del componente
        this.loadingService.hide()
    }
  }
}
