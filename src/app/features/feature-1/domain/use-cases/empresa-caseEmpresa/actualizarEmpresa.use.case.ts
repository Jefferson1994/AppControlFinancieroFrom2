import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { ActualizarrEmpresaDTO, CrearEmpresaDTO,CrearEmpresaResponse } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class actualizarEmpresasUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(empresaActualizar: ActualizarrEmpresaDTO,idEmpresa:number ): Promise<CrearEmpresaResponse> {
    console.log("la empresa en el caso de uso ", JSON.stringify(empresaActualizar) );

    try {
      const empresas = await this.repository.actualizarEmpresa(empresaActualizar,idEmpresa);
      console.log("Empresas obtenidas:", JSON.stringify(empresas));
      return empresas;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw error; 
    }
  }
}
