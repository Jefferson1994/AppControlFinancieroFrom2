// dashboard-admin.component.ts
import { Component,ViewEncapsulation , ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router'; // Importa el servicio Router

import { HeadAdminComponent } from '../head-admin/head-admin.component';
import { MenuAdminComponent } from '../menu-admin/menu-admin.component';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, HeadAdminComponent, MenuAdminComponent, RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DashboardAdminComponent {
  adminName = signal('Jefferson Vega Sarango');
  sidebarOpen = signal(true);
  currentView = signal('dashboard'); // Mantén esta variable para el despliegue del menú

  constructor(private router: Router) {} // Inyecta el servicio Router

navItems = [
  // 1. Dashboard (no tiene sub-opciones)
  {
    name: 'Dashboard',
    view: 'dashboard',
    svgPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z', // Ícono de casa
    subItems: []
  },

  // 2. Empresas
  {
    name: 'Empresas',
    view: 'empresas',
    svgPath: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z', // Ícono de edificio
    subItems: [
        { name: 'Ver Empresas', view: 'empresalist', path: 'admin-dashboard/empresalist' },
        { name: 'Crear Empresa', view: 'crearEmpresa' }
      ]
  },

  // 3. Colaboradores
  {
    name: 'Colaboradores',
    view: 'colaboradores',
    svgPath: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', // Ícono de grupo de personas
    subItems: [
        { name: 'Listar Colaboradores', view: 'listarColaboradorEmpresa' },
        { name: 'Añadir Colaborador', view: 'seleccionarEmpresaColaborador' }
      ]
  },

  // 4. Productos
  {
    name: 'Productos',
    view: 'productos',
    svgPath: 'M18 17H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2zM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20z', // Ícono de etiqueta
    subItems: [
        { name: 'Inventario de Productos', view: 'listarProductoEmpresa' },
        { name: 'Registrar Producto', view: 'seleccionarEmpresaProducto' }
      ]
  },

  // 5. Servicios
  {
    name: 'Servicios',
    view: 'servicios',
    svgPath: 'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z', // Ícono de engranaje
    subItems: [
        { name: 'Catálogo de Servicios', view: 'listarServicioEmpresa' },
        { name: 'Agendar Servicio', view: 'agendar_servicio' },
        { name: 'Crear Servicio', view: 'seleccionarEmpresaServicio' }
      ]
  },


  // 6. Reportes
  {
    name: 'Reportes',
    view: 'reportes',
    svgPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z', // Ícono de gráfico de barras
    subItems: [
        { name: 'Reporte de Ventas', view: 'reporte_ventas' },
        { name: 'Reporte de Clientes', view: 'reporte_clientes' }
      ]
  },

  // 7. Facturas
  {
    name: 'Facturas',
    view: 'facturas',
    svgPath: 'M19 8H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm-2 6H7v-2h10v2zm-4-3H7V9h6v2z', // Ícono de recibo
    subItems: [
        { name: 'Historial de Facturas', view: 'historial_facturas' },
        { name: 'Emitir Factura', view: 'emitir_factura' }
      ]
  },

  // 8. Proformas
  {
    name: 'Proformas',
    view: 'proformas',
    svgPath: 'M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3s-3 1.34-3 3c0 .35.07.69.18 1H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 17H4V8h16v12z', // Ícono de portapapeles
    subItems: [
        { name: 'Ver Proformas', view: 'ver_proformas' },
        { name: 'Generar Proforma', view: 'generar_proforma' }
      ]
  }
];

 handleToggleSidebar() {
    this.sidebarOpen.update(value => !value);
  }

  handleViewChange(viewName: string) {
    // 1. Busca el ítem del menú completo
    const selectedItem = this.navItems.find(item => item.view === viewName);

    if (selectedItem && selectedItem.subItems.length > 0) {
      // 2. Si el ítem tiene sub-opciones, solo abre/cierra el submenú
      if (this.currentView() === viewName) {
        this.currentView.set(''); // Cierra el submenú
      } else {
        this.currentView.set(viewName); // Abre el submenú
      }
    } else {
      // 3. Si no tiene sub-opciones, navega directamente a la ruta
      this.currentView.set(viewName);
      this.router.navigate(['/admin-dashboard', viewName]);
    }

    console.log('Cambiando a la vista:', this.currentView());
  }



}
