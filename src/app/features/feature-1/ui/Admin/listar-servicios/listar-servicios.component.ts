import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import{listarServiciosxEmpresaUseCase} from '../../../domain/use-cases/empresa-caseEmpresa/listarServiciosXempresa.use.case'
import {  Servicios } from '../../../domain/models/empresa.models';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from "../../../../../pipes/safe-url.pipe";
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-listar-servicios',
  standalone: true,
  imports: [CommonModule,FormsModule, SafeUrlPipe],
  templateUrl: './listar-servicios.component.html',
  styleUrl: './listar-servicios.component.css'
})
export class ListarServiciosComponent implements OnInit {



  private route = inject(ActivatedRoute);
  selectedEmpresaId: number | null = null;
  selectedEmpresaNombre: string | null = null;
  servicios: Servicios[] = [];
  serviciosFiltrados: Servicios[] = [];
  terminoBusqueda: string = '';
  categoriaSeleccionada: string = '';
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  loading = true;

  constructor(private ListarServiciosxEmpresaUseCase:listarServiciosxEmpresaUseCase){

  }


  async ngOnInit(): Promise<void> {
    const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
    if (idEmpresaStr) {
      this.selectedEmpresaId = Number(idEmpresaStr);
      await this.cargarServicios(this.selectedEmpresaId);

    }
  }

  async cargarServicios(idEmpresa: number): Promise<void> {
    try {
      this.loading = true;      // <-- Inicia la carga del componente
      this.loadingService.show();
      // 1. Se obtienen los datos del servidor
      const respuesta = await this.ListarServiciosxEmpresaUseCase.execute(idEmpresa);
      this.servicios = respuesta.servicios;

      // 2. (ESTA ES LA LÍNEA CLAVE)
      // Se inicializa la lista que se muestra en pantalla con todos los servicios.
      this.serviciosFiltrados = this.servicios;

      console.log('Servicios cargados y listos para mostrar: ', this.serviciosFiltrados);

    } catch (error) {
      console.error("Error al cargar los servicios:", error);
      this.alertService.showError('No se pudieron cargar los servicios. Intente nuevamente más tarde.');
      this.servicios = [];
      this.serviciosFiltrados = []; // También se limpia aquí en caso de error
    } finally {
      this.loadingService.hide();

    }
  }

  aplicarFiltros(): void {
    // Normalizamos el término de búsqueda a minúsculas una sola vez.
    const terminoBusquedaLower = this.terminoBusqueda.toLowerCase();

    let tempServicios = [...this.servicios];

    if (this.categoriaSeleccionada) {
      tempServicios = tempServicios.filter(servicio =>
        servicio.tipoServicio.nombre === this.categoriaSeleccionada
      );
    }

    if (this.terminoBusqueda) {
      tempServicios = tempServicios.filter(servicio => {
        const estadoTexto = servicio.activo === 1 ? 'activo' : 'inactivo';
        return (
          servicio.nombre.toLowerCase().includes(terminoBusquedaLower) ||
          (servicio.descripcion ?? '').toLowerCase().includes(terminoBusquedaLower) ||
          servicio.tipoServicio.nombre.toLowerCase().includes(terminoBusquedaLower) ||
          servicio.precio.toString().includes(terminoBusquedaLower) ||
          estadoTexto.includes(terminoBusquedaLower)
        );
      });
    }

    this.serviciosFiltrados = tempServicios;
  }

}
