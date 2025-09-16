import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for directives like *ngFor and *ngIf
import { ObtenerEmpresasUseCase } from '../../../../feature-1/domain/use-cases/empresa-caseEmpresa/todasEmpresas.use.case';
import { EmpresasInterfas } from '../../../../../features/feature-1/domain/models/empresa.models';
import { AuthService } from '../../../services/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { CrearProductoComponent } from "../crear-producto/crear-producto.component";
import { CrearServicioComponent } from "../crear-servicio/crear-servicio.component";
import { AgregarColaboradorComponent } from "../agregar-colaborador/agregar-colaborador.component";

@Component({
  selector: 'app-ver-empresas',
  standalone: true,
  imports: [CommonModule, CrearProductoComponent, CrearServicioComponent, AgregarColaboradorComponent], // Add CommonModule here
  templateUrl: './ver-empresas.component.html',
  styleUrl: './ver-empresas.component.css'
})
export class VerEmpresasComponent implements OnInit {

  empresas: EmpresasInterfas[] = [];
  
  loading = true;
  modoSeleccionProducto = false;
  modoSeleccionServices = false;
  modoAgregarColaborador= false;
  modoDetalleEmpresa= false;
  crearEmpresa = true;
  showProductModal = false;
  showProductModalServicio = false;
  selectedEmpresaId: number | null = null;
  selectedEmpresaNombre: string | null = null;



  constructor(private obtenerEmpresasUseCase: ObtenerEmpresasUseCase , private authService: AuthService
    ,private router: Router,private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarEmpresas();
    this.activatedRoute.url.subscribe(url => {
      this.modoSeleccionProducto = url[0]?.path === 'seleccionarEmpresaProducto';
      this.modoSeleccionServices = url[0]?.path === 'seleccionarEmpresaServicio';
      this.modoAgregarColaborador = url[0]?.path === 'seleccionarEmpresaColaborador';
      if(this.modoSeleccionServices){
        this.crearEmpresa=false;
      }
      if(this.modoSeleccionProducto){
        this.crearEmpresa=false;
      }
      if(this.modoAgregarColaborador){
        this.crearEmpresa=false;
      }

    });

  }

  // En tu componente .ts

  async cargarEmpresas(): Promise<void> {
    try {
      console.log('cargando empresas');
      this.loading = true;

      // ✅ CORRECCIÓN: Llama al nuevo método público del servicio
      const userResponse = this.authService.getCurrentUser();

      // ❗ The logic to check if the user and ID exist remains the same
      if (userResponse && userResponse.user && userResponse.user.id) {
        const idAdministrador = userResponse.user.id;
        this.empresas = await this.obtenerEmpresasUseCase.execute(idAdministrador,userResponse.token);
      } else {
        console.error('User not logged in or ID not found.');
        // You should redirect the user to the login page here.
      }
    } catch (error) {
      console.error('Error al cargar las empresas:', error);
    } finally {
      this.loading = false;
    }
  }

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
