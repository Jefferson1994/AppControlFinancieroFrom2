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
  @Input() idTipoEmpresa: number | undefined | null;

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
      console.log('Creando producto para la empresa con ID:', this.idEmpresa , 'Y EL NOMBRE' , this.nombreEmpresa, 'y el tipo de empresa ', this.idTipoEmpresa);
      this.cargarTiposDeProducto(this.idTipoEmpresa ||  0);
    }
  }

  tiposDeProducto = signal<TipoProducto[]>([]);

  // Señal para manejar errores (buena práctica)
  error = signal<string | null>(null);

  
  async onSubmit(form: NgForm): Promise<void> {
    if (!form.valid) {
      console.log('Formulario no válido. Por favor, revisa los campos.');
      return;
    }

    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      this.alertService.showError('Debes subir al menos una imagen del producto.');
      return;
    }

    try {
      this.loading = true;
      this.loadingService.show();

      const formData = new FormData();
      const datosProducto = form.value;

      formData.append('nombre', datosProducto.nombre);
      formData.append('descripcion', datosProducto.descripcion || '');
      formData.append('precio_venta', datosProducto.precio_venta.toString());
      formData.append('precio_compra', datosProducto.precio_compra?.toString() || '0');
      formData.append('precio_promocion', datosProducto.precio_promocion?.toString() || '0');
      formData.append('precio_descuento', datosProducto.precio_descuento?.toString() || '0');
      formData.append('stock_actual', datosProducto.stock_actual?.toString() || '0');
      formData.append('id_negocio', this.idEmpresa!.toString());
      formData.append('id_tipo_producto', datosProducto.id_tipo_producto.toString());

      // Adjuntar imágenes (hasta 3)
      this.selectedFiles.slice(0, 3).forEach(file => formData.append('imagenes', file, file.name));

      const respuesta = await this.crearProductoUseCase.execute(formData);

      console.log('Producto creado:', respuesta);
      this.alertService.showSuccess('Producto creado exitosamente.');
      this.closeModal();

    } catch (error) {
      console.error('Error al crear el producto:', error);
      this.alertService.showError('Error al crear el producto.');
    } finally {
      this.loading = false;
      this.loadingService.hide();
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

  async cargarTiposDeProducto(idEmpresa: number): Promise<void> {
    try {
      this.loading = true;      // <-- Inicia la carga del componente
      this.loadingService.show();

      const respuesta = await this.listarTiposUseCase.execute(idEmpresa);
      console.log('la respuesta de los tipos de productos',JSON.stringify(respuesta))
      // Guarda la lista de tipos de producto en la señal
      this.tiposDeProducto.set(respuesta);

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
