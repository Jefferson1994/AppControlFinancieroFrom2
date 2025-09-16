import { Routes } from '@angular/router';
import { ProductListComponent } from './features/feature-1/ui/product-list/product-list.component';
import { LoginAppComponent } from './features/feature-1/ui/User/login-app/login-app.component';
import { DashboardAdminComponent } from './features/feature-1/ui/Admin/dashboard-admin/dashboard-admin.component';
import { VerEmpresasComponent } from './features/feature-1/ui/Admin/ver-empresas/ver-empresas.component';
import { CrearEmpresaComponent } from './features/feature-1/ui/Admin/crear-empresa/crear-empresa.component';
import { CrearProductoComponent } from './features/feature-1/ui/Admin/crear-producto/crear-producto.component';
import { AgregarColaboradorComponent } from './features/feature-1/ui/Admin/agregar-colaborador/agregar-colaborador.component';
import { ListarColaboradoresComponent } from './features/feature-1/ui/Admin/listar-colaboradores/listar-colaboradores.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerEmpresaDetalleComponent } from './features/feature-1/ui/Admin/ver-empresa-detalle/ver-empresa-detalle.component';
import { ListarProductosComponent } from './features/feature-1/ui/Admin/listar-productos/listar-productos.component';
import { ListarServiciosComponent } from './features/feature-1/ui/Admin/listar-servicios/listar-servicios.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    component: ProductListComponent
  },
  {
    path: 'login',
    component: LoginAppComponent
  },
  {
    path: 'login',
    component: LoginAppComponent
  },
  {
    path: 'admin-dashboard',
    component: DashboardAdminComponent,
    children: [
      { path: 'empresalist', component: VerEmpresasComponent },
      { path: 'crearEmpresa', component: CrearEmpresaComponent },
      { path: 'seleccionarEmpresaProducto', component: VerEmpresasComponent },
      { path: 'seleccionarEmpresaServicio', component: VerEmpresasComponent },
      { path: 'seleccionarEmpresaColaborador', component: VerEmpresasComponent },
      { path: 'listarColaboradorEmpresa', component: VerEmpresasComponent },
      { path: 'listarProductoEmpresa', component: VerEmpresasComponent },
      { path: 'listarServicioEmpresa', component: VerEmpresasComponent },
      { path: 'crearProducto/:id_empresa', component: CrearProductoComponent },
      { path: 'crearServicio/:id_empresa', component: CrearProductoComponent },
      { path: 'AgregarColaborador/:id_empresa', component: AgregarColaboradorComponent },
      { path: 'verDetalleEmpresa/:id_empresa', component: VerEmpresaDetalleComponent },
      { path: 'verTodasColaboradores/:id_empresa', component: ListarColaboradoresComponent },
      { path: 'verTodosProductos/:id_empresa', component: ListarProductosComponent },
      { path: 'verTodosServicios/:id_empresa', component: ListarServiciosComponent },
    ],
  }
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

