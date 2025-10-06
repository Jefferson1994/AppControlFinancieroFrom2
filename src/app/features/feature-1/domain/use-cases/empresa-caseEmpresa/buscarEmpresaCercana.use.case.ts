import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { buscarempresaPorUbicacionDTO, EmpresasInterfas } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class EmpresasXUbicacionUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(buscarEmpresa: buscarempresaPorUbicacionDTO): Promise<EmpresasInterfas[]> {
    console.log("Ejecutando caso de uso para obtener empresas para el administrador:", buscarEmpresa);
    try {
      const delay = new Promise(resolve => setTimeout(resolve, 1000));
      const empresa = await this.repository.obtenerEmpresasCercanas(buscarEmpresa);
      console.log("Empresas obtenidas:", JSON.stringify(empresa));
      return empresa;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw error;
    }
  }
}
