import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import{listarServiciosxEmpresaUseCase} from '../../../domain/use-cases/empresa-caseEmpresa/listarServiciosXempresa.use.case'
import {  EmpresasInterfas, Servicios } from '../../../domain/models/empresa.models';
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from "../../../../../pipes/safe-url.pipe";
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { AuthService } from '../../../services/auth.service'
import { EmpresasXIdUseCase } from '../../../domain/use-cases/empresa-caseEmpresa/empreXId.use.case';
import { CrearServicioComponent } from "../crear-servicio/crear-servicio.component";

@Component({
  selector: 'app-listar-servicios',
  standalone: true,
  imports: [CommonModule,FormsModule, SafeUrlPipe,CrearServicioComponent],
  templateUrl: './listar-servicios.component.html',
  styleUrl: './listar-servicios.component.css'
})
export class ListarServiciosComponent implements OnInit {



  private route = inject(ActivatedRoute);
  selectedEmpresaId: number | null = null;
  selectedEmpresaNombre: string | null = null;
  idTipoEmpresa: number | null = null;
  servicios: Servicios[] = [];
  serviciosFiltrados: Servicios[] = [];
  terminoBusqueda: string = '';
  categoriaSeleccionada: string = '';
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);
  loading = true;
  empresas: EmpresasInterfas[] = [];
  empresa: EmpresasInterfas | null = null;
  empresa2: [EmpresasInterfas] | null = null;
  showProductModalServicio = false;
  showProductModal = false;


  constructor(private ListarServiciosxEmpresaUseCase:listarServiciosxEmpresaUseCase,
    private authService: AuthService,private obtenerEmpresasUseCase:EmpresasXIdUseCase
  ){

  }


  async ngOnInit(): Promise<void> {
    const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
    if (!idEmpresaStr) return;

    try {
      this.loading = true;
      this.loadingService.show();
      this.selectedEmpresaId = Number(idEmpresaStr);
      await this.cargarServicios(this.selectedEmpresaId);
      await this.cargarDatosEmpresa(this.selectedEmpresaId);

    } catch (error) {
      console.error("Error al cargar los productos:", error);
      this.servicios = [];
      this.alertService.showError('Error al cargar los productos.');
    } finally {
      this.loading = false;
      this.loadingService.hide();
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

  async cargarDatosEmpresa(idEmpresa : number): Promise<void> {
    try {
      this.loadingService.show();
      console.log('cargando empresas');


      // ✅ CORRECCIÓN: Llama al nuevo método público del servicio
      const userResponse = this.authService.getCurrentUser();

      // ❗ The logic to check if the user and ID exist remains the same
      if (userResponse && userResponse.user && userResponse.user.id) {
        const idAdministrador = userResponse.user.id;

        const response = await this.obtenerEmpresasUseCase.execute(idEmpresa);
        if (Array.isArray(response)) {
          this.empresa = response[0]
        } else {
          this.empresa = response;
        }
        console.log('Empresa cargada y asignada:', JSON.stringify(this.empresa));


      } else {
        console.error('User not logged in or ID not found.');
        // You should redirect the user to the login page here.
      }
    } catch (error) {
      console.error('Error al cargar las empresas:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  openServiciosModal(empresa: EmpresasInterfas): void {
    console.log("en el modal servicios",empresa)
    this.selectedEmpresaId = empresa.id;
    this.selectedEmpresaNombre = empresa.nombre;
    this.idTipoEmpresa=empresa.tipoEmpresa.id
    this.showProductModalServicio = true;
  }

  async onModalClosed(): Promise<void> {
    this.showProductModal = false;
    this.selectedEmpresaId = null;
    this.showProductModalServicio = false;
    this.cargarComponente();

  }

  async cargarComponente(): Promise<void> {
    const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
    if (!idEmpresaStr) return;

    try {
      this.loading = true;
      this.loadingService.show();
      this.selectedEmpresaId = Number(idEmpresaStr);
      await this.cargarServicios(this.selectedEmpresaId);
      await this.cargarDatosEmpresa(this.selectedEmpresaId);

    } catch (error) {
      console.error("Error al cargar los productos:", error);
      this.servicios = [];
      this.alertService.showError('Error al cargar los productos.');
    } finally {
      this.loading = false;
      this.loadingService.hide();
    }


  }


}
