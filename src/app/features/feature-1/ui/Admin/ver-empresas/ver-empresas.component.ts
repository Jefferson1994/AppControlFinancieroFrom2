import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for directives like *ngFor and *ngIf
import { ObtenerEmpresasUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/todasEmpresas.use.case';
import { EmpresasInterfas } from '../../../../../features/feature-1/domain/models/empresa.models';
import { AuthService } from '../../../services/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { CrearProductoComponent } from "../crear-producto/crear-producto.component";
import { CrearServicioComponent } from "../crear-servicio/crear-servicio.component";
import { AgregarColaboradorComponent } from "../agregar-colaborador/agregar-colaborador.component";
import { LoadingService } from '../../../services/loading.service';
import { AlertService } from '../../../services/alert.service';
import { SafeUrlPipe } from "../../../../../pipes/safe-url.pipe";

@Component({
  selector: 'app-ver-empresas',
  standalone: true,
  imports: [CommonModule, CrearProductoComponent, CrearServicioComponent, AgregarColaboradorComponent, SafeUrlPipe], // Add CommonModule here
  templateUrl: './ver-empresas.component.html',
  styleUrl: './ver-empresas.component.css'
})
export class VerEmpresasComponent implements OnInit {

  empresas: EmpresasInterfas[] = [];
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  loading = true;
  modoSeleccionProducto = false;
  modoSeleccionServices = false;
  modoAgregarColaborador= false;
  modoVerColaboradores= false;
  modoDetalleEmpresa= false;
  modoListaProductosEmpresa= false;
  modoListaServiciosEmpresa= false;
  crearEmpresa = true;
  showProductModal = false;
  showProductModalServicio = false;
  selectedEmpresaId: number | null = null;
  selectedEmpresaNombre: string | null = null;



  constructor(private obtenerEmpresasUseCase: ObtenerEmpresasUseCase , private authService: AuthService
    ,private router: Router,private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
  try {


    await this.cargarEmpresas(); // espera a que termine

    this.activatedRoute.url.subscribe({
      next: url => {
        this.modoSeleccionProducto = url[0]?.path === 'seleccionarEmpresaProducto';
        this.modoSeleccionServices = url[0]?.path === 'seleccionarEmpresaServicio';
        this.modoAgregarColaborador = url[0]?.path === 'seleccionarEmpresaColaborador';
        this.modoVerColaboradores= url[0]?.path === 'listarColaboradorEmpresa';
        this.modoListaProductosEmpresa = url[0]?.path === 'listarProductoEmpresa';
        this.modoListaServiciosEmpresa= url[0]?.path === 'listarServicioEmpresa';


        if (this.modoSeleccionServices || this.modoSeleccionProducto
          || this.modoAgregarColaborador|| this.modoVerColaboradores||
          this.modoListaProductosEmpresa || this.modoListaServiciosEmpresa) {
          this.crearEmpresa = false;
        }
      },
      error: err => {
        console.error('Error en la suscripción de la URL:', err);
        this.alertService.showError('Error al leer la URL.');
      }
    });

  } catch (error) {
    console.error('Error en ngOnInit:', error);
    this.alertService.showError('Ocurrió un error al inicializar la pantalla.');
  } finally {
    this.loadingService.hide();
  }
}



  // En tu componente .ts

  // en ver-empresas.component.ts

async cargarEmpresas(): Promise<void> {
  try {
    this.loading = true;      // <-- Inicia la carga del componente
    this.loadingService.show(); // <-- Inicia la carga global

    const userResponse = this.authService.getCurrentUser();
    console.log('DEBUG userResponse:', JSON.stringify(userResponse));

    if (userResponse && userResponse.user && userResponse.user.id) {
      const idAdministrador = userResponse.user.id;
      // Espera a que los datos lleguen antes de continuar
      const empresasData = await this.obtenerEmpresasUseCase.execute(idAdministrador, userResponse.token);
      this.empresas = empresasData;
    } else {
      console.error('User not logged in or ID not found.');
      this.alertService.showError('No se pudo verificar la sesión del usuario.');
      // Aquí deberías redirigir al login
      // this.router.navigate(['/login']);
    }
  } catch (error) {
    console.error('Error al cargar las empresas:', error);
    this.alertService.showError('No se pudieron cargar las empresas.');
  } finally {
    this.loading = false;     // <-- Detiene la carga del componente
    this.loadingService.hide(); // <-- Detiene la carga global
  }
}
  ACTUALIZAR(){}

  navegarACrearEmpresa(): void {
    console.log("a pantalla crear empresang serve")
    this.router.navigate(['/admin-dashboard/crearEmpresa']);

  }

  navegarACrearProducto(idEmpresa: number): void {
    this.router.navigate(['/admin-dashboard/crearProducto', idEmpresa]);
  }

  openProductModal(empresa: EmpresasInterfas): void {
    this.selectedEmpresaId = empresa.id;
    this.selectedEmpresaNombre = empresa.nombre;
    this.showProductModal = true;
  }



  openDetalleEmpresa(empresa: EmpresasInterfas): void {
    // Usamos el Router para navegar a la ruta y pasar el ID como parámetro
    this.router.navigate(['/admin-dashboard/verDetalleEmpresa', empresa.id]);
  }

  openListarColaboradores(empresa: EmpresasInterfas): void {
    // Usamos el Router para navegar a la ruta y pasar el ID como parámetro
    this.router.navigate(['/admin-dashboard/verTodasColaboradores', empresa.id]);
  }

  openListarProductos(empresa: EmpresasInterfas): void {
    // Usamos el Router para navegar a la ruta y pasar el ID como parámetro
    this.router.navigate(['/admin-dashboard/verTodosProductos', empresa.id]);
  }
  openListarServicios(empresa: EmpresasInterfas): void {
    // Usamos el Router para navegar a la ruta y pasar el ID como parámetro
    this.router.navigate(['/admin-dashboard/verTodosServicios', empresa.id]);
  }

  // ✅ New method to close the modal
  async onModalClosed(): Promise<void> {
    this.showProductModal = false;
    this.selectedEmpresaId = null;

    // ✅ Usa 'await' para esperar a que la lista de empresas se recargue
    await this.cargarEmpresas();
  }

  async onModalClosedDetalleEmpresa(): Promise<void> {
    this.modoDetalleEmpresa = false;
    this.selectedEmpresaId = null;

    // ✅ Usa 'await' para esperar a que la lista de empresas se recargue
    await this.cargarEmpresas();
  }

  // servicios
  openServiciosModal(empresa: EmpresasInterfas): void {
    console.log("en el modal servicios")
    this.selectedEmpresaId = empresa.id;
    this.selectedEmpresaNombre = empresa.nombre;
    this.showProductModalServicio = true;
  }

  openAgregarColaboradorModal(empresa: EmpresasInterfas): void {
    console.log("en el modal del colaborador")
    this.selectedEmpresaId = empresa.id;
    this.selectedEmpresaNombre = empresa.nombre;
    this.modoAgregarColaborador = true;
  }

  // ✅ New method to close the modal
  async onModalClosedServicios(): Promise<void> {
    this.showProductModalServicio = false;
    this.selectedEmpresaId = null;

    // ✅ Usa 'await' para esperar a que la lista de empresas se recargue
    await this.cargarEmpresas();
  }
}
