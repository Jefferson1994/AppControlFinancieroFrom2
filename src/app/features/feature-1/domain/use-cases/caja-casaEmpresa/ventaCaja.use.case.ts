import { Injectable, inject } from '@angular/core';
import { UserCajaRepository } from '../../../infrastructure/cajaServicios/caja-api.services';
import { AperturaCajaPayload,CrearVentaPayload,RespuestaVentaProcesada } from '../../models/caja.models';

@Injectable({
  providedIn: 'root'
})
export class procesarVentaUseCase {

  constructor(private readonly repository: UserCajaRepository) {}

  async execute(cajaEmpresa: CrearVentaPayload): Promise<RespuestaVentaProcesada> {
    console.log("la empresa en el caso de uso ", JSON.stringify(cajaEmpresa) );

    try {
      const respuesta = await this.repository.ProcesarventaCaja(cajaEmpresa);
      console.log("Empresas obtenidas:", JSON.stringify(cajaEmpresa));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      throw error;
    }
  }
}
