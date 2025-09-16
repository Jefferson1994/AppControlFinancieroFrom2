import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { CrearEmpresaDTO,CrearEmpresaResponse } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class crearEmpresasUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(empresa: CrearEmpresaDTO): Promise<CrearEmpresaResponse> {
    console.log("la empresa en el caso de uso ", JSON.stringify(empresa) );

    try {
      const empresas = await this.repository.CrearEmpresa(empresa);
      console.log("Empresas obtenidas:", JSON.stringify(empresas));
      return empresas;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw new Error('No se pudieron obtener las empresas. Inténtalo de nuevo más tarde.');
    }
  }
}
