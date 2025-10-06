import { AperturaCajaPayload,Caja,AperturaCajaResponse,
  CrearVentaPayload, RespuestaVentaProcesada,
  CierreCajaPayload,
  CierreCajaAPIResponse} from '../../models/caja.models';

export interface cajaRepositorio {
  AbrirCajaEmpresa(cajaEmpresa: AperturaCajaPayload ): Promise<AperturaCajaResponse>
  ProcesarventaCaja(cajaEmpresa: CrearVentaPayload): Promise<RespuestaVentaProcesada>
  CerrarCajaEmpresa(cajaEmpresa: CierreCajaPayload ): Promise<CierreCajaAPIResponse>

}

