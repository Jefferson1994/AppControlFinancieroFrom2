import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { EmpresasInterfas } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class ObtenerEmpresasUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(idAdministrador: number, token: string): Promise<EmpresasInterfas[]> {
    console.log("Ejecutando caso de uso para obtener empresas para el administrador:", idAdministrador);
    console.log("El token en que caso de uso :", token);
    try {
      const empresas = await this.repository.todasEmpresasXAdmin(idAdministrador,token);
      console.log("Empresas obtenidas:", JSON.stringify(empresas));
      return empresas;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw new Error('No se pudieron obtener las empresas. Inténtalo de nuevo más tarde.');
    }
  }
}
