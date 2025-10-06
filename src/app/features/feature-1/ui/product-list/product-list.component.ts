import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FotherClienteComponent } from "../cliente/fother-cliente/fother-cliente.component";
import { LocationData, MapaResultadosBusquedaComponent } from "../cliente/mapa-resultados-busqueda/mapa-resultados-busqueda.component";
import { ListaResultadosComponent } from "../cliente/lista-resultados/lista-resultados.component";



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FotherClienteComponent, MapaResultadosBusquedaComponent, ListaResultadosComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: []

})
export class ProductListComponent implements OnInit {

  private readonly router = inject(Router);

  datosQuemados: LocationData[] = [
      { lat: -2.1894, lng: -79.8895, title: 'Malecón 2000' },
      { lat: -2.1932, lng: -79.8835, title: 'Parque de las Iguanas' },
      { lat: -2.1607, lng: -79.8955, title: 'Cerro Santa Ana' }
  ];

  ngOnInit(): void {

  }

  redirigirALogin() {
    console.log("click en login")
    this.router.navigate(['/login']); // Navega a la ruta '/login'
  }



}
