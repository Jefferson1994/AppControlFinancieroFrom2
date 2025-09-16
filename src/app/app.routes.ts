import { Routes } from '@angular/router';
import { ProductListComponent } from './features/feature-1/ui/product-list/product-list.component';
import { LoginAppComponent } from './features/feature-1/ui/User/login-app/login-app.component';
import { DashboardAdminComponent } from './features/feature-1/ui/Admin/dashboard-admin/dashboard-admin.component';
import { VerEmpresasComponent } from './features/feature-1/ui/Admin/ver-empresas/ver-empresas.component';
import { CrearEmpresaComponent } from './features/feature-1/ui/Admin/crear-empresa/crear-empresa.component';
import { CrearProductoComponent } from './features/feature-1/ui/Admin/crear-producto/crear-producto.component';
import { AgregarColaboradorComponent } from './features/feature-1/ui/Admin/agregar-colaborador/agregar-colaborador.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerEmpresaDetalleComponent } from './features/feature-1/ui/Admin/ver-empresa-detalle/ver-empresa-detalle.component';

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
      { path: 'crearProducto/:id_empresa', component: CrearProductoComponent },
      { path: 'crearServicio/:id_empresa', component: CrearProductoComponent },
      { path: 'AgregarColaborador/:id_empresa', component: AgregarColaboradorComponent },
      { path: 'verDetalleEmpresa/:id_empresa', component: VerEmpresaDetalleComponent },
    ],
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

