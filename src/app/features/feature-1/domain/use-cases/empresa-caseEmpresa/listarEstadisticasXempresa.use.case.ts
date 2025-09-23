import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { EstadisticasInventario } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class listarEstadisticasxEmpresaUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(idEmpresa: number): Promise<EstadisticasInventario> {


    try {
      const respuesta = await this.repository.ListaEstadisticasXEmpresa(idEmpresa);
      console.log("las estadisticas optenidas:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener  estadisticas empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw new Error('No se pudieron obtener las estadisticas de la empresa');
    }
  }
}
