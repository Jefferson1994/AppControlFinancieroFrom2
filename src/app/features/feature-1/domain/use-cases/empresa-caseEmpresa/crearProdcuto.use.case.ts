import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { CrearProductoDTO,CrearProductoResponse } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class crearProductoUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(empresa: FormData): Promise<CrearProductoResponse> {
    console.log("la empresa en el caso de uso ", JSON.stringify(empresa) );

    try {
      const respuesta = await this.repository.CrearProducto(empresa);
      console.log("Empresas obtenidas:", JSON.stringify(empresa));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw error; 
    }
  }
}
