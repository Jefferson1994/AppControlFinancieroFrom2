import { Component, OnInit, ChangeDetectionStrategy, signal, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CrearProductoDTO, TipoProducto } from '../../../domain/models/empresa.models';
import { crearProductoUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/crearProdcuto.use.case';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { listarTiposProductosxEmpresaUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/listarTipoProductosXEmpresa.use.case';


@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearProductoComponent implements OnInit {



  @Input() idEmpresa: number | undefined;
  @Input() nombreEmpresa: string | undefined;

  @Output() modalClosed = new EventEmitter<void>();
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  loading = true;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  isDragging = false;
  imagenes!: string[];

  constructor(
    private crearProductoUseCase: crearProductoUseCase,
    private authService: AuthService,private cd: ChangeDetectorRef,
    private listarTiposUseCase :listarTiposProductosxEmpresaUseCase

  ) {}


  producto = signal<any>({
    nombre: '',
    descripcion: '',
    precio_compra: null,
    precio_venta: null,
    precio_promocion: null,
    precio_descuento: null,
    stock_actual: null,
    id_negocio: null,
    id_tipo_producto: null,
  });

  ngOnInit(): void {
    if (this.idEmpresa) {
      this.producto.update(prod => ({ ...prod, id_negocio: this.idEmpresa }));
      console.log('Creando producto para la empresa con ID:', this.idEmpresa , 'Y EL NOMBRE' , this.nombreEmpresa);
      this.cargarTiposDeProducto();
    }
  }

  tiposDeProducto = signal<TipoProducto[]>([]);
  
  // Señal para manejar errores (buena práctica)
  error = signal<string | null>(null);

   async onSubmit(form: NgForm): Promise<void> {
    if (form.valid) {
      const datosProducto = form.value;

      // ✅ Crea el objeto DTO y asigna el id_negocio
      const productoParaCrear: CrearProductoDTO = {
        ...datosProducto,
        id_negocio: this.idEmpresa,
        precio_promocion: datosProducto.precio_promocion || null,
        precio_descuento: datosProducto.precio_descuento || null,
      };

      console.log("el producto para guardar",productoParaCrear )

      try {
         this.loading = true;      // <-- Inicia la carga del componente
        this.loadingService.show();
        const respuesta = await this.crearProductoUseCase.execute(productoParaCrear);
        console.log('Respuesta de la API:', respuesta);
        this.alertService.showSuccess('Se creo exitosamente el producto');
        this.closeModal();
      } catch (error) {
        console.error('Error al crear el producto:', error);
        this.alertService.showError('Error al crear el producto:');
      }finally {
        this.loading = false;     // <-- Detiene la carga del componente
        this.loadingService.hide(); // <-- Detiene la carga global
      }
    } else {
      console.log('Formulario no válido. Por favor, revisa los campos.');
    }
  }

  onCancel(): void {
    // ✅ Cierra el modal al cancelar
    this.closeModal();
  }

  closeModal(): void {
    console.log("EN CERRAR EL MODAL");
    this.modalClosed.emit();
  }
  // manejar images

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

  async cargarTiposDeProducto(): Promise<void> {
    try {
      // Asumimos que tienes el id de la empresa.
      // Podría venir de un @Input(), de una ruta, etc.
      const idEmpresa = 1; // <-- REEMPLAZA ESTO con el ID real de la empresa

      const respuesta = await this.listarTiposUseCase.execute(idEmpresa);
      console.log('la respuesta de los tipos de productos',JSON.stringify(respuesta))
      // Guarda la lista de tipos de producto en la señal
      this.tiposDeProducto.set(respuesta);

    } catch (err: any) {
      // Si ocurre un error, lo guardamos para mostrarlo en el HTML
      this.error.set('No se pudieron cargar los tipos de producto.');
      console.error(err);
    }
  }


}
