import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import {  RespuestaServicios, TipoProducto, TipoServicio } from '../../../domain/models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class listarTiposServiciosxEmpresaUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(idEmpresa: number): Promise<TipoServicio []> {


    try {
      const respuesta = await this.repository.ListarTiposServiciosXEmpresa(idEmpresa);
      console.log("los productos obtenidos:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw new Error('No se pudieron obtener las empresas. Inténtalo de nuevo más tarde.');
    }
  }
}
