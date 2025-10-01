import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { CrearServicioDTO,CrearServicioResponse } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class crearServicesUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(servicio: FormData): Promise<CrearServicioResponse> {
    console.log("la empresa en el caso de uso ", JSON.stringify(servicio) );

    try {
      const respuesta = await this.repository.CrearServicio(servicio);
      console.log("Empresas obtenidas:", JSON.stringify(servicio));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw error; 
    }
  }
}
