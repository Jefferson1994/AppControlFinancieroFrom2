import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { AgregarColaboradorDTO,AgregarColaboradorResponse } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class agregarColaboradorServicesUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(AgregarColaborador: AgregarColaboradorDTO): Promise<AgregarColaboradorResponse> {
    console.log("la empresa en el caso de uso ", JSON.stringify(AgregarColaborador) );

    try {
      const respuesta = await this.repository.AgregarColaborador(AgregarColaborador);
      console.log("Empresas obtenidas:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw new Error('No se pudieron obtener las empresas. Inténtalo de nuevo más tarde.');
    }
  }
}
