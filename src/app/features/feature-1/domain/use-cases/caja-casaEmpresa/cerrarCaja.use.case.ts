import { Injectable, inject } from '@angular/core';
import { UserCajaRepository } from '../../../infrastructure/cajaServicios/caja-api.services';
import { CierreCajaAPIResponse, CierreCajaPayload } from '../../models/caja.models';

@Injectable({
  providedIn: 'root'
})
export class cerrarCajarEmpresasUseCase {

  constructor(private readonly repository: UserCajaRepository) {}

  async execute(cajaEmpresa: CierreCajaPayload): Promise<CierreCajaAPIResponse> {
    console.log("la empresa en el caso de uso ", JSON.stringify(cajaEmpresa) );

    try {
      const caja = await this.repository.CerrarCajaEmpresa(cajaEmpresa);
      console.log("cajas abierta:", JSON.stringify(caja));
      return caja;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw error;
    }
  }
}
