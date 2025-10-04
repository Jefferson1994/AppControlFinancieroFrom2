import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CrearEmpresaDTO,CrearEmpresaResponse, EmpresasInterfas
  ,CrearProductoDTO,CrearProductoResponse,CrearServicioDTO,CrearServicioResponse
  ,AgregarColaboradorDTO,AgregarColaboradorResponse,
  ActualizarrEmpresaDTO, RespuestaProductos,
  EstadisticasInventario,RespuestaServicios,
  TipoProducto,
  TipoServicio,
  TipoEmpresa,
  RespuestaColaboradores,
  RespuestaDesvincular
} from '../../domain/models/empresa.models'; // Asegúrate de que los paths sean correctos
import { empresaRepositorio } from '../../domain/repositories/empresaRepositories/empresa.repository'; // El contrato del repositorio

@Injectable({
  providedIn: 'root'
})
export class UserApiRepository implements empresaRepositorio {
  private readonly http = inject(HttpClient);
  //private readonly baseUrl = 'http://localhost:3000/';
  private baseUrl = environment.apiUrl;


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

  async CrearEmpresa(empresa: FormData): Promise<CrearEmpresaResponse> {
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
  async CrearProducto(producto: FormData): Promise<CrearProductoResponse> {
    const url = `${this.baseUrl}productos/crear`;
    //const body = { CrearEmpresaDTO };

    try {

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

  async CrearServicio(servicio: FormData): Promise<CrearServicioResponse> {
    const url = `${this.baseUrl}servicio/crear`;
    //const body = { CrearEmpresaDTO };

    try {

      const response = await lastValueFrom(
        //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
        this.http.post<{ servicio: CrearServicioResponse }>(url, servicio)
      );

     ;
      return response.servicio;
    } catch (error) {

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
      console.error(error)
      throw error;
    }
  }

  async todasEmpresasXID(idEmpresa: number): Promise<EmpresasInterfas> {
    const url = `${this.baseUrl}empresa/empresasXId`;
    console.log('en el api todas las empresa')
    const body = { idEmpresa: idEmpresa };

    try {
      // La API devuelve un objeto con la propiedad 'empresas', que es un array.
      // Tipamos la respuesta para acceder a ese array.
      const response = await lastValueFrom(
        //this.http.post<{ empresas: EmpresasInterfas[] }>(url, body)
        this.http.post<{ empresa: EmpresasInterfas }>(url, body)
      );

      return response.empresa;
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

  async actualizarEmpresa(empresaActualizar: ActualizarrEmpresaDTO, idEmpresa:number): Promise<CrearEmpresaResponse> {
    const url = `${this.baseUrl}empresa/${idEmpresa}`;
    console.log("la url para actualizar", url)
    //const body = { CrearEmpresaDTO };
    try {

      const response = await lastValueFrom(
        this.http.put<{ empresas: CrearEmpresaResponse }>(url, empresaActualizar)
      );
      return response.empresas;
    } catch (error) {
      // El repositorio solo relanza el error. La lógica de manejo
      // específica va en el caso de uso o el componente.
      throw error;
    }
  }

  async ListaProductosXEmpresa(idEmpresa: number): Promise<RespuestaProductos> {
    const url = `${this.baseUrl}productos/productoXEmpresa`;
    const body = { id_empresa: idEmpresa };

    try {
      // ✅ CAMBIO 1: El tipo de la respuesta es directamente RespuestaProductos
      const response = await lastValueFrom(
        this.http.post<RespuestaProductos>(url, body)
      );

      // ✅ CAMBIO 2: Devuelve el objeto de respuesta COMPLETO
      return response;

    } catch (error) {
      // Es una buena práctica manejar el error aquí también
      console.error('Error en la llamada API ListaProductosXEmpresa:', error);
      throw error;
    }
  }

  async ListaEstadisticasXEmpresa(idEmpresa: number): Promise<EstadisticasInventario> {
    const url = `${this.baseUrl}empresa/empresaEstadisticas`;
    const body = { idEmpresa: idEmpresa };

    try {

      const response = await lastValueFrom(
        this.http.post<EstadisticasInventario>(url, body)
      );


      return response;

    } catch (error) {
      console.error('Error en la llamada API ListaProductosXEmpresa:', error);
      throw error;
    }
  }

  async ListaServicioXEmpresa(idEmpresa: number): Promise<RespuestaServicios> {
    const url = `${this.baseUrl}servicio/servicioXEmpresa`;
    const body = { id_empresa: idEmpresa };

    try {
      const response = await lastValueFrom(
        this.http.post<RespuestaServicios>(url, body)
      );
      console.log("la respuesta del api de servicios",response)
      return response;

    } catch (error) {

      console.error('Error en la llamada API ListaServiciosXEmpresa:', error);
      throw error;
    }
  }

  async ListarTiposProductosXEmpresa(tipoEmpresa: number): Promise<TipoProducto[]> {
    const url = `${this.baseUrl}productos/tipo`;
    const body = { id_empresa: tipoEmpresa };

    try {
      const response = await lastValueFrom(
        this.http.post<TipoProducto[]>(url, body)
      );

      return response;

    } catch (error) {

      console.error('Error en la llamada API ListaServiciosXEmpresa:', error);
      throw error;
    }
  }
  async ListarTiposServiciosXEmpresa(tipoEmpresa: number): Promise<TipoServicio[]> {
    const url = `${this.baseUrl}servicio/tipo`;
    const body = { id_empresa: tipoEmpresa };

    try {
      const response = await lastValueFrom(
        this.http.post<TipoServicio[]>(url, body)
      );

      return response;

    } catch (error) {

      console.error('Error en la llamada API ListaServiciosXEmpresa:', error);
      throw error;
    }
  }

  async ListarTiposEmpresa(): Promise<TipoEmpresa[]> {
    const url = `${this.baseUrl}empresa/tiposempresa`;

    try {
      const response = await lastValueFrom(
        this.http.post<TipoEmpresa[]>(url, '')
      );

      return response;

    } catch (error) {

      console.error('Error en la llamada API listar todos los tipos de empresa:', error);
      throw error;
    }
  }


  async ListaTodosColaboradoresXEmpresa(idEmpresa: number): Promise<RespuestaColaboradores> {
    const url = `${this.baseUrl}empresa/listarColaboradorXEmpresa`;
    const body = { id_negocio: idEmpresa };

    try {
      const response = await lastValueFrom(
        this.http.post<RespuestaColaboradores>(url, body)
      );

      return response;

    } catch (error) {

      console.error('Error en la llamada API ListaServiciosXEmpresa:', error);
      throw error;
    }
  }

  async desvincularColaboradoresXEmpresa(idEmpresa: number,id_usuario: number): Promise<RespuestaDesvincular> {
    const url = `${this.baseUrl}empresa/desvincularColaborador`;
    const body = { id_negocio: idEmpresa,id_usuario:id_usuario };

    try {
      const response = await lastValueFrom(
        this.http.post<RespuestaDesvincular>(url, body)
      );

      return response;

    } catch (error) {

      console.error('Error en la llamada API ListaServiciosXEmpresa:', error);
      throw error;
    }
  }

  async vacacionesColaboradoresXEmpresa(idEmpresa: number,id_usuario: number): Promise<RespuestaDesvincular> {
    const url = `${this.baseUrl}empresa/vacacionesColaborador`;
    const body = { id_negocio: idEmpresa,id_usuario:id_usuario };

    try {
      const response = await lastValueFrom(
        this.http.post<RespuestaDesvincular>(url, body)
      );

      return response;

    } catch (error) {

      console.error('Error en la llamada API ListaServiciosXEmpresa:', error);
      throw error;
    }
  }

  async IntegrarvacacionesColaboradoresXEmpresa(idEmpresa: number,id_usuario: number): Promise<RespuestaDesvincular> {
    const url = `${this.baseUrl}empresa/IntegrarvacacionesColaborador`;
    const body = { id_negocio: idEmpresa,id_usuario:id_usuario };

    try {
      const response = await lastValueFrom(
        this.http.post<RespuestaDesvincular>(url, body)
      );

      return response;

    } catch (error) {

      console.error('Error en la llamada API ListaServiciosXEmpresa:', error);
      throw error;
    }
  }



}
