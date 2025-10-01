import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/empresaServicios/empresa-api.services';
import { RespuestaDesvincular } from '../../models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class vacacacionesColaboradorEmpresasUseCase {

  constructor(private readonly repository: UserApiRepository) {}

  async execute(idEmpresa: number, id_usuario: number ): Promise<RespuestaDesvincular> {
    console.log("Ejecutando caso de uso para obtener empresas para el administrador:", idEmpresa);
    try {
      const delay = new Promise(resolve => setTimeout(resolve, 1000));
      const repuesta = await this.repository.vacacionesColaboradoresXEmpresa(idEmpresa,id_usuario);
      console.log("las vacaciones:", JSON.stringify(repuesta));
      return repuesta;
    } catch (error) {
      console.error('Error en el caso de uso al obtener empresas:', error);
      // Lanza un error más descriptivo que pueda ser manejado por el componente.
      throw error; 
    }
  }
}
