import { Component, inject, OnInit } from '@angular/core';
import { EmpresasInterfas, RespuestaColaboradores, ColaboradorEmpresa } from '../../../domain/models/empresa.models';
import { ActivatedRoute } from '@angular/router';
import { listarColaboradorxEmpresaUseCase } from '../../../domain/use-cases/empresa-caseEmpresa/listarColaboradoresXEmpresa.use.case';
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { CommonModule } from '@angular/common';
import { desvincularColaboradorEmpresasUseCase } from '../../../domain/use-cases/empresa-caseEmpresa/desvincualarColaborador.use.case';
import { vacacacionesColaboradorEmpresasUseCase } from '../../../domain/use-cases/empresa-caseEmpresa/vacacionesColaborador.use.case';
import { ReintegrarvacacacionesColaboradorEmpresasUseCase } from '../../../domain/use-cases/empresa-caseEmpresa/reitegrarColaboradorvac.use.case';



@Component({
  selector: 'app-listar-colaboradores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-colaboradores.component.html',
  styleUrl: './listar-colaboradores.component.css'
})
export class ListarColaboradoresComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);


  loading = true;

  colaboradores: ColaboradorEmpresa[] = [];

  respuestaColaboradores: RespuestaColaboradores | null = null;
  idEmpresaActual : number| null = null;
  constructor(private ListarColaboradorxEmpresaUseCase: listarColaboradorxEmpresaUseCase,
    private desvincularUseCase:desvincularColaboradorEmpresasUseCase,
    private vacacionesColaborador :vacacacionesColaboradorEmpresasUseCase,
    private integrarvacacionesColaborador:ReintegrarvacacacionesColaboradorEmpresasUseCase

  ) { }

  ngOnInit(): void {
    const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
    if (idEmpresaStr) {
      const idEmpresa = Number(idEmpresaStr);
      this.idEmpresaActual=idEmpresa;
      this.cargarTodosColaboradoresEmpresa(idEmpresa);
    } else {
      console.error("No se encontró un ID de empresa en la URL.");
    }
  }

  async cargarTodosColaboradoresEmpresa(idEmpresa: number): Promise<void> {
    try {
      this.loading = true;      // <-- Inicia la carga del componente
      this.loadingService.show();
      const respuesta = await this.ListarColaboradorxEmpresaUseCase.execute(idEmpresa);

      this.respuestaColaboradores = respuesta;

      if (respuesta && respuesta.colaboradores) {
        this.colaboradores = respuesta.colaboradores;
      }

      console.log('Datos asignados a la variable del HTML:', this.colaboradores);

    } catch (error) {
      console.error("Error al cargar los colaboradores:", error);
      this.respuestaColaboradores = null;
      this.colaboradores = []; 
    }finally{
        this.loading = false;
         this.loadingService.hide();
    }
  }


  async onDesvincular(colaborador: ColaboradorEmpresa): Promise<void> {
    // Verificación de seguridad
    if (!this.idEmpresaActual) {
      this.alertService.showError("No se ha podido identificar la empresa actual.");
      return;
    }

    const confirmado = await this.alertService.showConfirm(
      '¿Estás seguro?', 
      `Esta acción desvinculará a ${colaborador.usuario.nombre} de la empresa.`
    );

    // La lógica siguiente es exactamente la misma
    if (!confirmado) return;

    try {
      this.loadingService.show();
      
      const respuesta = await this.desvincularUseCase.execute(this.idEmpresaActual, colaborador.id_usuario);
      this.alertService.showSuccess(respuesta.mensaje);
      this.cargarTodosColaboradoresEmpresa(this.idEmpresaActual);

    } catch (error) {
      this.alertService.showError((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  async onVacaciones(colaborador: ColaboradorEmpresa): Promise<void> {
    // Verificación de seguridad
    if (!this.idEmpresaActual) {
      this.alertService.showError("No se ha podido identificar la empresa actual.");
      return;
    }

    const confirmado = await this.alertService.showConfirm(
      '¿Estás seguro?', 
      `Esta acción dara vacaciones  a ${colaborador.usuario.nombre} en la empresa.`
    );

    // La lógica siguiente es exactamente la misma
    if (!confirmado) return;

    try {
      this.loadingService.show();
      
      const respuesta = await this.vacacionesColaborador.execute(this.idEmpresaActual, colaborador.id_usuario);
      this.alertService.showSuccess(respuesta.mensaje);
      this.cargarTodosColaboradoresEmpresa(this.idEmpresaActual);

    } catch (error) {
      this.alertService.showError((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  async integrarVacaciones(colaborador: ColaboradorEmpresa): Promise<void> {
    // Verificación de seguridad
    if (!this.idEmpresaActual) {
      this.alertService.showError("No se ha podido identificar la empresa actual.");
      return;
    }

    const confirmado = await this.alertService.showConfirm(
      '¿Estás seguro?', 
      `Esta acción reintegrara de vacaciones   a ${colaborador.usuario.nombre} en la empresa.`
    );

    // La lógica siguiente es exactamente la misma
    if (!confirmado) return;

    try {
      this.loadingService.show();
      
      const respuesta = await this.integrarvacacionesColaborador.execute(this.idEmpresaActual, colaborador.id_usuario);
      this.alertService.showSuccess(respuesta.mensaje);
      this.cargarTodosColaboradoresEmpresa(this.idEmpresaActual);

    } catch (error) {
      this.alertService.showError((error as Error).message);
    } finally {
      this.loadingService.hide();
    }
  }

  
}