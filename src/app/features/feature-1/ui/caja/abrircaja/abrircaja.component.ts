import { Component, inject, OnInit, signal } from '@angular/core';
import { AperturaCajaPayload,Caja,AperturaCajaResponse } from '../../../domain/models/caja.models';
import { abrirCajarEmpresasUseCase } from '../../../domain/use-cases/caja-casaEmpresa/abrirCaja.use.case';
import { LoadingService } from '../../../services/loading.service';
import { AlertService } from '../../../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NegocioVinculado, RespuestaNegociosVinculados, UserResponse } from '../../../domain/models/userModelos';
import { UserEmpresasVinculadasUseCase } from '../../../domain/use-cases/use-caseUsuario/userEmpresasVinculadas-case';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-abrircaja',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './abrircaja.component.html',
  styleUrl: './abrircaja.component.css'
})
export class AbrircajaComponent implements OnInit{

  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  cargando = false;
  loading = true;

  montoInicial: number | null = null;
  observaciones: string = '';
  negocios: NegocioVinculado[] = [];            // Lista de todos los negocios
  empresas: { id: number; nombre: string }[] = [];
  empresaSeleccionada: { id: number; nombre: string } | null = null;
  adminName = signal('Admin');
  rol = signal('Admin');
  private userSource = new BehaviorSubject<UserResponse | null>(null);
  user$: Observable<UserResponse | null> = this.userSource.asObservable();
  nombreEmpresaIndividual=''
  idEmpresa: number=0
  
  

  constructor(private abrirCajaUseCase :abrirCajarEmpresasUseCase,
    private userEmpresasUseCase :UserEmpresasVinculadasUseCase,
    private authService :AuthService
  ){

  }
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user && user.user && user.user.nombre) {
      this.adminName.set(user.user.nombre);
      //this.rol.set(user.user.id_rol.toString());
    }
    this.cargarNegociosVinculados();
  }

  getCurrentUser(): UserResponse | null {
      return this.userSource.getValue();
  }



  async onAbrirCaja(): Promise<void> {
    console.log("Abriendo caja...");
    const payload: AperturaCajaPayload = {
      id_negocio: this.idEmpresa,
      total_inicial_efectivo: this.montoInicial!,
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

  private async cargarNegociosVinculados(): Promise<void> {
    try {
      this.loadingService.show();
      const respuesta: RespuestaNegociosVinculados = await this.userEmpresasUseCase.execute();
      if (respuesta && respuesta.negocios && respuesta.negocios.length > 0) {
        this.negocios = respuesta.negocios;
        console.log("Lista de negocios obtenida:", JSON.stringify(this.negocios));

        // Selecciona automáticamente si solo hay uno
        if (this.negocios.length === 1) {
          this.empresaSeleccionada  = this.negocios[0];
          console.log("Negocio seleccionado automáticamente:", this.empresaSeleccionada );
          this.nombreEmpresaIndividual=this.empresaSeleccionada .nombre;
          this.idEmpresa=this.empresaSeleccionada .id!;
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

  onEmpresaChangeId(event: Event) {
    const select = event.target as HTMLSelectElement;
    const empresaId = Number(select.value);
    this.empresaSeleccionada = this.empresas.find(e => e.id === empresaId) || null;
    this.idEmpresa=empresaId;
    console.log('Empresa seleccionada por id:', this.empresaSeleccionada);
  }




  

}
