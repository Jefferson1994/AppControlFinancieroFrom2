import { Component, OnInit, ChangeDetectionStrategy, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CrearProductoDTO } from '../../../domain/models/empresa.models';
import { crearProductoUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/crearProdcuto.use.case';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-crear-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearProductoComponent implements OnInit {

  constructor(
      private crearProductoUseCase: crearProductoUseCase,
      private authService: AuthService,

    ) {}
  // ✅ Input property to receive the company ID
  @Input() idEmpresa: number | undefined;
  @Input() nombreEmpresa: string | undefined;

  // ✅ Output property to emit an event when closing the modal
  @Output() modalClosed = new EventEmitter<void>();



  producto = signal<any>({
    nombre: '',
    descripcion: '',
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
    }
  }

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

      try {
        const respuesta = await this.crearProductoUseCase.execute(productoParaCrear);
        console.log('Respuesta de la API:', respuesta);
        this.closeModal();
      } catch (error) {
        console.error('Error al crear el producto:', error);
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


}
