import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import {  RespuestaServicios } from '../../../domain/models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class listarServiciosxEmpresaUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(idEmpresa: number): Promise<RespuestaServicios> {


    try {
      const respuesta = await this.repository.ListaServicioXEmpresa(idEmpresa);
      console.log("los productos obtenidos:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw new Error('No se pudieron obtener las empresas. Inténtalo de nuevo más tarde.');
    }
  }
}
