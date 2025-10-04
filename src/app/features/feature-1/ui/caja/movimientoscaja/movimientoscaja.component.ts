import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import{listarServiciosxEmpresaUseCase} from '../../../domain/use-cases/empresa-caseEmpresa/listarServiciosXempresa.use.case'
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { Producto, Servicios } from '../../../domain/models/empresa.models';
import{listarProductoxEmpresaUseCase} from '../../../domain/use-cases/empresa-caseEmpresa/listarProductosXempresa.use.case'
import{procesarVentaUseCase} from '../../../domain/use-cases/caja-casaEmpresa/ventaCaja.use.case'
import { CrearVentaPayload, ItemVentaPayload } from '../../../domain/models/caja.models';

// Interfaz para dar una estructura clara a los ítems del ticket
export interface ItemVenta {
  id: number;
  tipo: 'servicio' | 'producto';
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-movimientoscaja',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './movimientoscaja.component.html',
  styleUrls: ['./movimientoscaja.component.css']
})
export class MovimientoscajaComponent implements OnInit {

  //variables reales
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  loading = true;
  // --- Listas Maestras (simulan venir de la API) ---
  servicios: Servicios[] = [];
  serviciosFiltrados: Servicios[] = [];
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  vistaActiva: 'servicios' | 'productos' = 'servicios';
  terminoBusqueda = '';


  itemsVenta: ItemVenta[] = [];
  subtotal = 0;
  impuestos = 0;
  total = 0;
  id_metodo_pago_principal: number | null = null;
  requiereFactura = false;
  procesandoCobro = false;

  constructor(private ListarServiciosxEmpresaUseCase:listarServiciosxEmpresaUseCase,
    private ListarProductoxEmpresaUseCase :listarProductoxEmpresaUseCase,
    private procesarVentaUseCase: procesarVentaUseCase
    ){

  }


  async ngOnInit(): Promise<void>{
    // Cargamos los datos de prueba
    this.filtrarItems();
    this.cargarServicios(14);
    this.cargarProductos(14);
  }


  async cargarServicios(idEmpresa: number): Promise<void> {
    try {
      this.loading = true;
      this.loadingService.show();
      const respuesta = await this.ListarServiciosxEmpresaUseCase.execute(idEmpresa);
      this.servicios = respuesta.servicios;

      this.serviciosFiltrados = this.servicios;

      console.log('Servicios cargados y listos para mostrar: ', this.serviciosFiltrados);

    } catch (error) {
      console.error("Error al cargar los servicios:", error);
      this.alertService.showError('No se pudieron cargar los servicios. Intente nuevamente más tarde.');
      this.servicios = [];
      this.serviciosFiltrados = []; // También se limpia aquí en caso de error
    } finally {
      this.loadingService.hide();

    }
  }

  async cargarProductos(idEmpresa: number): Promise<void> {
    try {
      const respuesta = await this.ListarProductoxEmpresaUseCase.execute(idEmpresa);
      this.productos = respuesta.productos; // respuesta ya es Producto[]
      this.productosFiltrados=this.productos

      console.log('productos en el ts ',this.productos)
    } catch (error) {
      console.error("Error al cargar los productosss:", error);
      this.productos = [];
    }
  }

  // --- Métodos para la Interfaz ---
  seleccionarVista(vista: 'servicios' | 'productos'): void {
    this.vistaActiva = vista;
  }

  filtrarItems(): void {
    const termino = this.terminoBusqueda.toLowerCase();
    this.serviciosFiltrados = this.servicios.filter(s => s.nombre.toLowerCase().includes(termino));
    this.productosFiltrados = this.productos.filter(p => p.nombre.toLowerCase().includes(termino));
  }

  // --- Métodos para la Lógica de Venta ---

  agregarItem(item: any, tipo: 'servicio' | 'producto'): void {
    const itemExistente = this.itemsVenta.find(i => i.id === item.id && i.tipo === tipo);

    if (itemExistente) {
      // ✅ CORRECCIÓN 1: Se incrementa la cantidad solo una vez.
      itemExistente.cantidad++;
    } else {
      // ✅ CORRECCIÓN 2: Se determina el precio correcto según el tipo.
      const precioDelItem = tipo === 'servicio' ? item.precio : item.precio_venta;

      this.itemsVenta.push({
        id: item.id,
        tipo,
        nombre: item.nombre,
        precio: precioDelItem, // Se usa el precio correcto
        cantidad: 1
      });
    }

    this.calcularTotal();
  }

  incrementarCantidad(item: ItemVenta): void {
    item.cantidad++;
    this.calcularTotal();
  }

  decrementarCantidad(item: ItemVenta): void {
    item.cantidad--;
    if (item.cantidad <= 0) {
      this.removerItem(item);
    } else {
      this.calcularTotal();
    }
  }

  removerItem(itemARemover: ItemVenta): void {
    this.itemsVenta = this.itemsVenta.filter(item => item !== itemARemover);
    this.calcularTotal();
  }

  /**
   * Este es el "motor" de cálculo. Se llama cada vez que el ticket cambia.
   */
  calcularTotal(): void {
    this.subtotal = this.itemsVenta.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    this.impuestos = this.subtotal * 0.12; // Ejemplo de IVA 12%
    this.total = this.subtotal + this.impuestos;
  }

  seleccionarMetodoPago(id: number): void {
    this.id_metodo_pago_principal = id;
  }

  /**
   * Simula el envío a la API y limpia el ticket para la siguiente venta.
   */
  finalizarVenta(): void {
  // ✅ Aquí está la corrección
  if (this.procesandoCobro || !this.id_metodo_pago_principal || this.itemsVenta.length === 0) return;

  this.procesandoCobro = true;

  const payload = {
    // ... (la construcción de tu payload)
  };

  console.log("--- ENVIANDO A LA API ---", payload);

  setTimeout(() => {
    alert(`Venta por ${this.total.toFixed(2)} procesada exitosamente!`);

    this.itemsVenta = [];
    this.id_metodo_pago_principal = null;
    this.requiereFactura = false;
    this.procesandoCobro = false;
    this.calcularTotal();

  }, 1500);
  }

  async procesarVenta(): Promise<void> {
    // 1. Validaciones iniciales
    if (this.procesandoCobro || !this.id_metodo_pago_principal || this.itemsVenta.length === 0) {
      this.alertService.showError('Asegúrate de agregar ítems y seleccionar un método de pago.');
      return;
    }

    this.procesandoCobro = true;
    this.loadingService.show();

    // 2. "Traducir" el arreglo de items al formato del payload
    const itemsParaPayload: ItemVentaPayload[] = this.itemsVenta.map(item => {
      if (item.tipo === 'producto') {
        return {
          id_producto: item.id,
          cantidad: item.cantidad
        };
      } else { // Si es 'servicio'
        return {
          id_servicio: item.id,
          cantidad: item.cantidad
        };
      }
    });

    // 3. Construir el payload completo para el caso de uso
    const payload: CrearVentaPayload = {
      id_caja: 36,
      id_colaborador: 11,
      id_metodo_pago_principal: this.id_metodo_pago_principal,
      id_cliente: 6,
      requiere_factura_formal: this.requiereFactura,
      observaciones_venta: "venta de prueba desde angular",
      items: itemsParaPayload
    };

    console.log("--- ENVIANDO A LA API ---", payload);

    try {
      // 4. Llamar al caso de uso
      const respuesta = await this.procesarVentaUseCase.execute(payload);
      //console.log('Respuesta de la API:', JSON.stringify(respuesta));
      this.alertService.showSuccess(respuesta.mensaje || 'Venta procesada exitosamente!');

      if (respuesta.DocumentoVenta) {
            const nombreArchivo = `Venta-${respuesta.venta.id}.pdf`;
            this.descargarPdf(respuesta.DocumentoVenta, nombreArchivo);
      }
      //this.resetVenta();

    } catch (error) {
      console.error('Error al procesar la venta:', error);
      this.alertService.showError('Ocurrió un error al procesar la venta.');
    } finally {
      this.procesandoCobro = false;
      this.loadingService.hide();
    }
  }

  // ✅ MÉTODO AUXILIAR PARA LIMPIAR
  private resetVenta(): void {
    this.itemsVenta = [];
    this.id_metodo_pago_principal = null;
    this.requiereFactura = false;
    this.calcularTotal();
  }

  private descargarPdf(base64String: string, nombreArchivo: string): void {
  try {
    // 1. Decodifica el string Base64 a datos binarios.
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 2. Crea un "Blob" (un objeto tipo archivo) con los datos y el tipo correcto.
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // 3. Crea una URL temporal para el Blob.
    const url = window.URL.createObjectURL(blob);

    // 4. Crea un enlace <a> invisible en la página.
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;

    // 5. Simula un clic en el enlace para iniciar la descarga.
    link.click();

    window.URL.revokeObjectURL(url);
    link.remove(); // Limpia el elemento del DOM

  } catch (error) {
    console.error('Error al descargar el PDF:', error);
    this.alertService.showError('No se pudo generar el documento para descargar.');
  }
  }
}
