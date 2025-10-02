//objeto abrir caja
export interface AperturaCajaPayload {
    id_negocio: number;
    total_inicial_efectivo: number;
    observaciones: string;

}


export interface Caja {
  id: number;
  id_Colaborador: number;
  id_negocio: number;
  fecha_apertura: string; // O puedes usar el tipo Date si lo prefieres
  monto_inicial: number;
  total_esperado: number;
  total_real: number;
  observaciones: string;
  estado: number; // 1 para 'abierta', 0 para 'cerrada'
  fecha_cierre: string | null;
  total_calculado: number;
  sobrante: number;
  faltante: number;
  total_comisiones_generadas: number;
}


export interface AperturaCajaResponse {
  mensaje: string;
  caja: Caja;
}


export interface ItemVentaPayload {
  id_producto?: number;
  id_servicio?: number;
  cantidad: number;
  descripcion_adicional?: string;
}


export interface CrearVentaPayload {
  id_caja: number;
  id_colaborador: number;
  id_metodo_pago_principal: number;
  id_cliente: number | null;
  requiere_factura_formal: boolean;
  observaciones_venta?: string;
  items: ItemVentaPayload[];
}


/**
 * Describe un único ítem (producto o servicio) dentro del detalle de la venta.
 */
export interface VentaDetalle {
  id: number;
  id_producto: number | null;
  id_servicio: number | null;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  id_venta: number;
}


export interface Venta {
  id: number;
  id_negocio: number;
  id_colaborador: number;
  id_cliente: number;
  id_metodo_pago_principal: number;
  tipo_comprobante: string;
  numero_comprobante: string;
  fecha_venta: string; // O Date si se transforma
  subtotal: number;
  iva: number;
  total: number;
  observaciones: string;
  estado: string;
  detalles: VentaDetalle[]; // Un array de los ítems de la venta
}


export interface MovimientoCajaRegistrado {
  id: number;
  id_caja: number;
  monto: number;
  id_tipo_movimiento_caja: number;
  id_metodo_pago: number;
  id_venta: number;
  detalle: string;
  id_factura: number | null;
  creado_en: string; // O Date si se transforma
}


export interface RespuestaVentaProcesada {
  mensaje: string;
  venta: Venta;
  movimientoCaja: MovimientoCajaRegistrado;
  DocumentoVenta: string;
}

