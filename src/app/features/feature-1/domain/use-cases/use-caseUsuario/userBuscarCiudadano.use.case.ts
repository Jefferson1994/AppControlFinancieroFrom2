import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { ValidacionRequest,ValidacionResponse} from '../../models/userModelos';

@Injectable({
  providedIn: 'root'
})
export class buscarUserCiudadanoUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(userBuscar: ValidacionRequest): Promise<ValidacionResponse> {
    console.log("la empresa en el caso de uso ", JSON.stringify(userBuscar) );

    try {
      const respuesta = await this.repository.BuscarCiudadano(userBuscar);
      console.log("usuario obteido", JSON.stringify(respuesta));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener user :', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw new Error('No se pudieron obtener las empresas. Inténtalo de nuevo más tarde.');
    }
  }
}
