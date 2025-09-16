import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { RolUsuario } from '../../models/userModelos';
import { Observable } from 'rxjs';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class UserRolUseCase {

  constructor(private readonly repository: UserApiRepository) {}


   execute(): Promise<RolUsuario[]> {
    

    return this.repository.RolesActivos().then(UserRol=>{
      
      console.error('los roles son :', UserRol);
      return UserRol
    }).catch(error=>{
      console.error('Error en el caso de uso :', error);
      throw new Error('No se pudo logear');

    })
  }


}
