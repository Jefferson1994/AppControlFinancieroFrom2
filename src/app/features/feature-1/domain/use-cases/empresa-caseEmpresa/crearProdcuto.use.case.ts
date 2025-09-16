import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { CrearProductoDTO,CrearProductoResponse } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class crearProductoUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(producto: CrearProductoDTO): Promise<CrearProductoResponse> {
    console.log("la empresa en el caso de uso ", JSON.stringify(producto) );

    try {
      const respuesta = await this.repository.CrearProducto(producto);
      console.log("Empresas obtenidas:", JSON.stringify(producto));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw new Error('No se pudieron obtener las empresas. Inténtalo de nuevo más tarde.');
    }
  }
}
