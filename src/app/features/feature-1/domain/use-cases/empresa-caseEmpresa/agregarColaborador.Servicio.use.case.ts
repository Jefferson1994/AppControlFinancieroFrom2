import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { AgregarColaboradorDTO,AgregarColaboradorResponse } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class agregarColaboradorServicesUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(AgregarColaborador: AgregarColaboradorDTO): Promise<AgregarColaboradorResponse> {
    console.log("agregando colaborador ", JSON.stringify(AgregarColaborador) );

    try {
      const respuesta = await this.repository.AgregarColaborador(AgregarColaborador);
      console.log("respuesta agregar colaborador:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso agregar colaborado:', error);
      throw error; 
    }
  }
}
