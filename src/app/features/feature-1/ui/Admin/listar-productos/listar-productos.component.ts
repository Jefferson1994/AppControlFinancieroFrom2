import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import{listarProductoxEmpresaUseCase} from '../../../domain/use-cases/empresa-caseEmpresa/listarProductosXempresa.use.case'
import{listarEstadisticasxEmpresaUseCase} from '../../../domain/use-cases/empresa-caseEmpresa/listarEstadisticasXempresa.use.case'
import { EmpresasInterfas, EstadisticasInventario, Producto, RespuestaProductos } from '../../../domain/models/empresa.models';
import { SafeUrlPipe } from "../../../../../pipes/safe-url.pipe";
import { AlertService } from '../../../services/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { CrearProductoComponent } from "../crear-producto/crear-producto.component";
import { AuthService } from '../../../services/auth.service'
import { EmpresasXIdUseCase } from '../../../domain/use-cases/empresa-caseEmpresa/empreXId.use.case';



@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule,SafeUrlPipe,CrearProductoComponent],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})


export class ListarProductosComponent implements OnInit {

  selectedEmpresaId: number | null = null;
  selectedEmpresaNombre: string | null = null;
  idTipoEmpresa: number | null = null;
  selectedEmpresaNombre1: string | null = null;



  empresas: EmpresasInterfas[] = [];
  empresa: EmpresasInterfas | null = null;
  empresa2: [EmpresasInterfas] | null = null;
  //selectedEmpresaNombre: string | undefined = undefined;
  //selectedEmpresaId: number | undefined = undefined;
  showProductModal = false;
  private route = inject(ActivatedRoute);
  productosLista: RespuestaProductos[]| null = null;
  //public productos: RespuestaProductos[] = [];
  productos: Producto[] = [];
  estadisticas: EstadisticasInventario[] = [];
  valorTotalInventario: number | null = null;
  totalProductos: number | null = null;
  productosPocostok: number | null = null;
  ganaciaPotencial: number | null = null;
  private alertService = inject(AlertService);
  private loadingService = inject(LoadingService);

  loading = true;

  constructor(private ListarProductoxEmpresaUseCase :listarProductoxEmpresaUseCase,
    private ListarEstadisticasxEmpresaUseCase : listarEstadisticasxEmpresaUseCase,
    private authService: AuthService,private obtenerEmpresasUseCase:EmpresasXIdUseCase){

  }

async ngOnInit(): Promise<void> {
    const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
    if (idEmpresaStr) {
      try{
        this.loading = true;      // <-- Inicia la carga del componente
        this.loadingService.show(); // <-- Inicia la carga global
        this.selectedEmpresaId = Number(idEmpresaStr);
        console.log('el id de la empresa el listar productos', this.selectedEmpresaId)
        await this.cargarProductos(this.selectedEmpresaId);
        await this.cargarEstadisticas(this.selectedEmpresaId);
        await this.cargarDatosEmpresa(this.selectedEmpresaId);
        

      }catch(error){
        console.error("Error al cargar los productosss:", error);
        this.productos = [];
        this.alertService.showError('Error al cargar los productos.');
      }finally{
        this.loading = false;
         this.loadingService.hide();
      }

    }
  }

  async cargarProductos(idEmpresa: number): Promise<void> {
    try {
      const respuesta = await this.ListarProductoxEmpresaUseCase.execute(idEmpresa);
      this.productos = respuesta.productos; // respuesta ya es Producto[]

      console.log('productos en el ts ',this.productos)
    } catch (error) {
      console.error("Error al cargar los productosss:", error);
      this.productos = [];
    }
  }


  async cargarEstadisticas(idEmpresa: number): Promise<void> {
    try {
      const respuesta = await this.ListarEstadisticasxEmpresaUseCase.execute(idEmpresa);
      this.valorTotalInventario = respuesta.valorTotalInventario;
      this.totalProductos= respuesta.totalProductos;
      this.productosPocostok= respuesta.productosConPocoStock;
      this.ganaciaPotencial=respuesta.gananciaPotencial;
      console.log("el total del inventrio ",this.valorTotalInventario )

      console.log('productos en el ts ',this.productos)
    } catch (error) {
      console.error("Error al cargar los productosss:", error);
      this.productos = [];
    }
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
        
        this.empresa = response
        
        console.log('Empresa cargada y asignada:', JSON.stringify(this.empresa));
        this.selectedEmpresaNombre1 = this.empresa?.nombre || '';

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

  openProductModal(empresa: EmpresasInterfas): void {
    console.log('la empresa en crear ',empresa)
    this.selectedEmpresaId = empresa.id;
    this.selectedEmpresaNombre = empresa.nombre;
    this.idTipoEmpresa=empresa.tipoEmpresa.id
    this.showProductModal = true;
  }

  async onModalClosed(): Promise<void> {
    this.showProductModal = false;
    this.selectedEmpresaId = null;
    this.cargarComponente();
  }

  async cargarComponente(): Promise<void> {
  const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
  if (!idEmpresaStr) return;

  try {
    this.loading = true;
    this.loadingService.show();
    this.selectedEmpresaId = Number(idEmpresaStr);

    await this.cargarProductos(this.selectedEmpresaId);
    await this.cargarEstadisticas(this.selectedEmpresaId);

  } catch (error) {
    console.error("Error al cargar los productos:", error);
    this.productos = [];
    this.alertService.showError('Error al cargar los productos.');
  } finally {
    this.loading = false;
    this.loadingService.hide();
  }
  }










}
