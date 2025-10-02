import { Component, inject } from '@angular/core';
import { AperturaCajaPayload,Caja,AperturaCajaResponse } from '../../../domain/models/caja.models';
import { abrirCajarEmpresasUseCase } from '../../../domain/use-cases/caja-casaEmpresa/abrirCaja.use.case';
import { LoadingService } from '../../../services/loading.service';
import { AlertService } from '../../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-abrircaja',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './abrircaja.component.html',
  styleUrl: './abrircaja.component.css'
})
export class AbrircajaComponent {

    private alertService = inject(AlertService);
    private loadingService = inject(LoadingService);
    cargando = false;
    loading = true;

    montoInicial: number = 0;
    observaciones: string = '';

    constructor(private abrirCajaUseCase :abrirCajarEmpresasUseCase){

    }


  async onAbrirCaja(): Promise<void> {
    console.log("Abriendo caja...");
    const payload: AperturaCajaPayload = {
      id_negocio: 14,
      total_inicial_efectivo: this.montoInicial,
      observaciones: this.observaciones
    };
    console.log("Payload para abrir caja:", JSON.stringify(payload));
    this.cargando = true;
    try {
       this.loading = true;      // <-- Inicia la carga del componente
      this.loadingService.show();
      const respuesta = await this.abrirCajaUseCase.execute(payload);
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
      this.loading = false;
      this.loadingService.hide();
      this.cargando = false;

    }
  }
}
