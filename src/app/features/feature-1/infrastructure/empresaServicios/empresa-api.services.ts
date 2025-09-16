import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { CrearEmpresaDTO,CrearEmpresaResponse, EmpresasInterfas
  ,CrearProductoDTO,CrearProductoResponse,CrearServicioDTO,CrearServicioResponse
  ,AgregarColaboradorDTO,AgregarColaboradorResponse
} from '../../domain/models/empresa.models'; // Asegúrate de que los paths sean correctos
import { empresaRepositorio } from '../../domain/repositories/empresaRepositories/empresa.repository'; // El contrato del repositorio

@Injectable({
  providedIn: 'root'
})
export class UserApiRepository implements empresaRepositorio {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/';

  async todasEmpresasXAdmin(idAdministrador: number, token: string): Promise<EmpresasInterfas[]> {
    const url = `${this.baseUrl}empresa/todasEmpresasXAdmin`;
    console.log('en el api todas las empresa')
    const body = { id_administrador: idAdministrador };

    try {
      // La API devuelve un objeto con la propiedad 'empresas', que es un array.
      // Tipamos la respuesta para acceder a ese array.
      const response = await lastValueFrom(
        //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
        this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
      );

      return response.empresas;
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

  async CrearEmpresa(empresa: CrearEmpresaDTO): Promise<CrearEmpresaResponse> {
    const url = `${this.baseUrl}empresa/crearEmpresa`;
    //const body = { CrearEmpresaDTO };

    try {
      // La API devuelve un objeto con la propiedad 'empresas', que es un array.
      // Tipamos la respuesta para acceder a ese array.
      const response = await lastValueFrom(
        //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
        this.http.post<{ empresas: CrearEmpresaResponse }>(url, empresa)
      );

      return response.empresas;
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }
  async CrearProducto(producto: CrearProductoDTO): Promise<CrearProductoResponse> {
    const url = `${this.baseUrl}productos/crear`;
    //const body = { CrearEmpresaDTO };

    try {
      // La API devuelve un objeto con la propiedad 'empresas', que es un array.
      // Tipamos la respuesta para acceder a ese array.
      const response = await lastValueFrom(
        //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
        this.http.post<{ producto: CrearProductoResponse }>(url, producto)
      );

      return response.producto;
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

  async CrearServicio(servicio: CrearServicioDTO): Promise<CrearServicioResponse> {
    const url = `${this.baseUrl}servicio/crear`;
    //const body = { CrearEmpresaDTO };

    try {
      // La API devuelve un objeto con la propiedad 'empresas', que es un array.
      // Tipamos la respuesta para acceder a ese array.
      const response = await lastValueFrom(
        //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
        this.http.post<{ servicio: CrearServicioResponse }>(url, servicio)
      );

      return response.servicio;
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

  async AgregarColaborador(AgregarColaborador: AgregarColaboradorDTO): Promise<AgregarColaboradorResponse> {
    const url = `${this.baseUrl}empresa/agregarColaborador`;
    //const body = { CrearEmpresaDTO };

    try {

      const response = await lastValueFrom(
        //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
        this.http.post<{ empleado: AgregarColaboradorResponse }>(url, AgregarColaborador)
      );

      return response.empleado;
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

  async todasEmpresasXID(idEmpresa: number): Promise<EmpresasInterfas> {
    const url = `${this.baseUrl}empresa/todasEmpresasXAdmin`;
    console.log('en el api todas las empresa')
    const body = { idEmpresa: idEmpresa };

    try {
      // La API devuelve un objeto con la propiedad 'empresas', que es un array.
      // Tipamos la respuesta para acceder a ese array.
      const response = await lastValueFrom(
        //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
        this.http.post<{ empresas: EmpresasInterfas }>(url, body)
      );

      return response.empresas;
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

  async CrearEmpresa2(empresa: CrearEmpresaDTO): Promise<CrearEmpresaResponse> {
    const url = `${this.baseUrl}empresa/crearEmpresa`;
    //const body = { CrearEmpresaDTO };

    try {
      // La API devuelve un objeto con la propiedad 'empresas', que es un array.
      // Tipamos la respuesta para acceder a ese array.
      const response = await lastValueFrom(
        //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
        this.http.put<{ empresas: CrearEmpresaResponse }>(url, empresa)
      );

      return response.empresas;
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

}
