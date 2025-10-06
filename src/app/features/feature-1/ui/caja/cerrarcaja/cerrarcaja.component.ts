import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NegocioVinculado, RespuestaNegociosVinculados, UserResponse } from '../../../domain/models/userModelos';
import { UserEmpresasVinculadasUseCase } from '../../../domain/use-cases/use-caseUsuario/userEmpresasVinculadas-case';
import { CajaCerradaResponse,CierreCajaPayload } from '../../../domain/models/caja.models';
import { cerrarCajarEmpresasUseCase } from '../../../domain/use-cases/caja-casaEmpresa/cerrarCaja.use.case';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-cerrarcaja',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cerrarcaja.component.html',
  styleUrl: './cerrarcaja.component.css'
})
export class CerrarcajaComponent {

    id_caja?: number ;
    id_negocio?: number;
    total_final_efectivo?: number;
    observaciones?: string;
    observacionesCierre?: string;
    negocios: NegocioVinculado[] = [];

    private alertService = inject(AlertService);
    private loadingService = inject(LoadingService);

  constructor(private cerarCajaUseCase :cerrarCajarEmpresasUseCase,
        private userEmpresasUseCase :UserEmpresasVinculadasUseCase,
    ){

  }
  ngOnInit(): void {
    /*const user = this.authService.getCurrentUser();
    if (user && user.user && user.user.nombre) {
      this.adminName.set(user.user.nombre);
      //this.rol.set(user.user.id_rol.toString());
    }*/
    this.cargarNegociosVinculados();
  }

  private async cargarNegociosVinculados(): Promise<void> {
    try {
      this.loadingService.show();
      const respuesta: RespuestaNegociosVinculados = await this.userEmpresasUseCase.execute();
      if (respuesta && respuesta.negocios && respuesta.negocios.length > 0) {
        this.negocios = respuesta.negocios;
        console.log("Lista de negocios obtenida:", JSON.stringify(this.negocios));

        // Selecciona automáticamente si solo hay uno
        if (this.negocios.length === 1) {
          //this.empresaSeleccionada  = this.negocios[0];
          //console.log("Negocio seleccionado automáticamente:", this.empresaSeleccionada );
          //this.nombreEmpresaIndividual=this.empresaSeleccionada .nombre;
          //this.idEmpresa=this.empresaSeleccionada .id!;
        }
      } else {
        console.log("No se encontraron negocios vinculados.");
      }
    } catch (error) {
      console.error("Error al cargar los negocios:", error);
    } finally {
      this.loadingService.hide();
      console.log("Carga de negocios finalizada.");
    }
  }


  async onCerrarCaja(): Promise<void> {
      console.log("Cerrando caja...");
      const payload: CierreCajaPayload = {
        id_caja:37,
        id_negocio: 14,
        total_final_efectivo: this.total_final_efectivo!,
        observaciones: this.observacionesCierre
      };
      console.log("Payload para abrir caja:", JSON.stringify(payload));

      try {

        this.loadingService.show();
        const respuesta = await this.cerarCajaUseCase.execute(payload);
        console.log("Caja abierta:", JSON.stringify(respuesta));
        this.alertService.showSuccess('Caja abierta exitosamente.');
        console.log("Respuesta al abrir caja:", JSON.stringify(respuesta));
        //console.log('¡Caja abierta exitosamente!', this.cajaAbierta);
        // Aquí podrías mostrar una alerta de éxito o navegar a otra página

      } catch (error) {
        console.error("Error al cargar los productosss:", error);
        if (error instanceof HttpErrorResponse && error.status === 400) {

            const mensajeDelBackend = error.error.mensaje;
            this.alertService.showError(mensajeDelBackend);

          } else {
              this.alertService.showError('Ocurrió un error inesperado. Inténtelo de nuevo.');
              console.error('Error no controlado:', error);
          }

      } finally {

        this.loadingService.hide();


      }
  }


}
