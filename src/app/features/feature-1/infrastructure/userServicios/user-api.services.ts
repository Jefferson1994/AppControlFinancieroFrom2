import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserCredentials, UserResponse,UserCredentialsBuscar,BuscarColaboradorResponse,
  CrearUsuarioDTO,CrearUsuarioResponse
 } from '../../domain/models/userModelos'; // Asegúrate de que los paths sean correctos
import { UserRepositorio } from '../../domain/repositories/userRepositories/user.repository'; // El contrato del repositorio

@Injectable({
  providedIn: 'root'
})
export class UserApiRepository implements UserRepositorio {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';


  async LoginUser(credentials: UserCredentials): Promise<UserResponse> {
    const url = `${this.baseUrl}/login`;

    try {
      // Usamos lastValueFrom para convertir el Observable en una promesa
      // y manejarlo con async/await
      return await lastValueFrom(this.http.post<UserResponse>(url, credentials));
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

  async BuscarUser(userBuscar: UserCredentialsBuscar): Promise<BuscarColaboradorResponse> {
      const url = `${this.baseUrl}/buscar-por-cedula`;
      //const body = { CrearEmpresaDTO };

      try {
        // La API devuelve un objeto con la propiedad 'empresas', que es un array.
        // Tipamos la respuesta para acceder a ese array.
        const response = await lastValueFrom(
          //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
          this.http.post<{ colaborador: BuscarColaboradorResponse }>(url, userBuscar)
        );
        console.log('en el api', JSON.stringify(response))
        return response.colaborador;
      } catch (error) {
        // El repositorio solo relanza el error. La lógica de manejo
        // específica va en el caso de uso o el componente.
        throw error;
      }
  }

  async CrearUsuario(crearUsario: CrearUsuarioDTO): Promise<CrearUsuarioResponse> {
    const url = `${this.baseUrl}/users`;

    try {
      // Usamos lastValueFrom para convertir el Observable en una promesa
      // y manejarlo con async/await
      return await lastValueFrom(this.http.post<CrearUsuarioResponse>(url, crearUsario));
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }
}
