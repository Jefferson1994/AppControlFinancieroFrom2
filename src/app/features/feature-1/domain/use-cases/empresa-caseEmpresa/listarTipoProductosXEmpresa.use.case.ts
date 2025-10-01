import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import {  RespuestaServicios, TipoProducto } from '../../../domain/models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class listarTiposProductosxEmpresaUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(idEmpresa: number): Promise<TipoProducto []> {


    try {
      const respuesta = await this.repository.ListarTiposProductosXEmpresa(idEmpresa);
      console.log("los productos obtenidos:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw error; 
    }
  }
}
