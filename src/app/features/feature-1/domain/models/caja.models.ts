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

/**
 * Representa la respuesta completa del API al abrir una caja.
 */
export interface AperturaCajaResponse {
  mensaje: string;
  caja: Caja;
}
