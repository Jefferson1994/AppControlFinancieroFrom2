import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AperturaCajaPayload,AperturaCajaResponse,Caja, CierreCajaAPIResponse, CierreCajaPayload, CrearVentaPayload, RespuestaVentaProcesada} from '../../domain/models/caja.models';
import { cajaRepositorio } from '../../domain/repositories/cajaRepositories/caja.repository';

@Injectable({
  providedIn: 'root'
})
export class UserCajaRepository implements cajaRepositorio {
  private readonly http = inject(HttpClient);
  //private readonly baseUrl = 'http://localhost:3000/';
  private baseUrl = environment.apiUrl;

  async AbrirCajaEmpresa(cajaEmpresa: AperturaCajaPayload ): Promise<AperturaCajaResponse> {
      const url = `${this.baseUrl}caja/abrirCaja`;
      try {
        const response = await lastValueFrom(

        this.http.post<{ caja: AperturaCajaResponse }>(url, cajaEmpresa)
        );

        return response.caja;
      } catch (error) {
        throw error;
      }
  }

  async ProcesarventaCaja(cajaEmpresa: CrearVentaPayload): Promise<RespuestaVentaProcesada> {
      const url = `${this.baseUrl}caja/procesarVenta`;
      try {
          const response = await lastValueFrom(
              this.http.post<RespuestaVentaProcesada>(url, cajaEmpresa)
          );
          return response;

      } catch (error) {
          throw error;
      }
  }


  async CerrarCajaEmpresa(cajaEmpresa: CierreCajaPayload ): Promise<CierreCajaAPIResponse> {
      const url = `${this.baseUrl}caja/cerrarCaja`;
      try {
        const response = await lastValueFrom(

        this.http.post<{ caja: CierreCajaAPIResponse }>(url, cajaEmpresa)
        );

        return response.caja;
      } catch (error) {
        throw error;
      }
  }


}
