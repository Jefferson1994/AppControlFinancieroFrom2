import { Injectable, inject } from '@angular/core';
import { UserApiRepository } from '../../../infrastructure/userServicios/user-api.services';
import { UserCredentials, UserResponse } from '../../models/userModelos';
import { Observable } from 'rxjs';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {

  constructor(private readonly repository: UserApiRepository) {}


   execute(credentials: UserCredentials): Promise<UserResponse> {
    console.log("Executing en el caso de uso :", credentials.email);

    return this.repository.LoginUser(credentials).then(UserResponse=>{
      return UserResponse
    }).catch(error=>{
      console.error('Error en el caso de uso :', error);
      throw new Error('No se pudo logear');

    })
  }


}
