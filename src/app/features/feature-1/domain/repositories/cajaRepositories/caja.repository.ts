import { AperturaCajaPayload,Caja,AperturaCajaResponse,
  CrearVentaPayload, RespuestaVentaProcesada} from '../../models/caja.models';

export interface cajaRepositorio {
  AbrirCajaEmpresa(cajaEmpresa: AperturaCajaPayload ): Promise<AperturaCajaResponse>
  ProcesarventaCaja(cajaEmpresa: CrearVentaPayload): Promise<RespuestaVentaProcesada>

}

