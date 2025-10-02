import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import {  NegocioVinculado, RespuestaNegociosVinculados } from '../../../domain/models/userModelos';

@Injectable({
  providedIn: 'root'
})
export class UserEmpresasVinculadasUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(): Promise<RespuestaNegociosVinculados> {


    try {
      const respuesta = await this.repository.usuarioEmpresasVinculadas();
      console.log("los productos obtenidos:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      throw error; 
    }
  }
}
