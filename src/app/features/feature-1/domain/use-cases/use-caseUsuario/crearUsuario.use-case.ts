import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { CrearUsuarioDTO, CrearUsuarioResponse } from '../../models/userModelos';
import { Observable } from 'rxjs';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class crearUsuarioUseCase {

  constructor(private readonly repository: UserApiRepository) {}


  async execute(crearUsuario: CrearUsuarioDTO): Promise<CrearUsuarioResponse> {
    console.log("Creando usuario con datos:", JSON.stringify(crearUsuario));
    try {
      // ✅ La llamada al repositorio usando async/await
      const respuesta = await this.repository.CrearUsuario(crearUsuario);
      console.log("Respuesta del repositorio:", JSON.stringify(respuesta));
      return respuesta;
    } catch (error: any) {
      console.error('Error en el caso de uso:', error);

      // ✅ CORRECCIÓN: Accede al mensaje de error anidado
      let errorMessage = 'Ocurrió un error inesperado al registrar el usuario.';
      if (error && error.error && error.error.mensaje) {
        errorMessage = error.error.mensaje;
      }

      // ✅ Lanza un nuevo error con el mensaje de la API
      throw new Error(errorMessage);
    }
  }


}
