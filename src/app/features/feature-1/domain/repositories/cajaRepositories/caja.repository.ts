import { AperturaCajaPayload,Caja,AperturaCajaResponse} from '../../models/caja.models';

export interface cajaRepositorio {
  AbrirCajaEmpresa(cajaEmpresa: AperturaCajaPayload ): Promise<AperturaCajaResponse>

}

