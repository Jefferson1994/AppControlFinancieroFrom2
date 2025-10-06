import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeadClienteComponent } from '../head-cliente/head-cliente.component';
import { FotherClienteComponent } from '../fother-cliente/fother-cliente.component';
import { ListaResultadosComponent } from "../lista-resultados/lista-resultados.component";
import { FiltrosBusquedaClienteComponent } from "../filtros-busqueda-cliente/filtros-busqueda-cliente.component";
import { EmpresaDetalleComponent } from "../empresa-detalle/empresa-detalle.component"
import { LocationService, Coordenadas } from '../../../services/location.service'; // 1. Importa el servicio
import { MapaResultadosBusquedaComponent, LocationData } from '../mapa-resultados-busqueda/mapa-resultados-busqueda.component'
import { filter, firstValueFrom, Subscription } from 'rxjs';
import { buscarempresaPorUbicacionDTO, EmpresasInterfas } from '../../../domain/models/empresa.models';
import { EmpresasXUbicacionUseCase } from '../../../domain/use-cases/empresa-caseEmpresa/buscarEmpresaCercana.use.case';
import { ResultadosBusquedaService } from '../../../services/resultados-busqueda.service';
@Component({
  selector: 'app-dashboard-cliente',
  standalone: true,
  imports: [HeadClienteComponent, FotherClienteComponent, RouterOutlet,
     FiltrosBusquedaClienteComponent,
     MapaResultadosBusquedaComponent,EmpresaDetalleComponent],
  templateUrl: './dashboard-cliente.component.html',
  styleUrl: './dashboard-cliente.component.css'
})
export class DashboardClienteComponent {


  public negocios: EmpresasInterfas[] = [];
  public locationsParaMapa: LocationData[] = [];
  public esVistaDeDetalle = false;
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router, private empresasUseCase:EmpresasXUbicacionUseCase,
    private resultadosService: ResultadosBusquedaService,
    private locationService: LocationService
  ) {
    this.esVistaDeDetalle = this.router.url.includes('/empresaDetalle')||
    this.router.url.includes('/finalizar-reserva');
  }


 ngOnInit(): void {

    this.iniciarBusqueda();
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Esta línea actualiza la variable que controla todo
      this.esVistaDeDetalle = event.urlAfterRedirects.includes('/empresaDetalle')|| event.urlAfterRedirects.includes('/finalizar-reserva');
    });

  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }



  async iniciarBusqueda(): Promise<void> {
    try {
      // Primero, obtiene las coordenadas
      const coords = await this.obtenerCoordenadas();
      // Luego, con esas coordenadas, busca las empresas
      await this.buscarYActualizarEmpresas(coords);
    } catch (error) {
      console.error("Error en el flujo de búsqueda principal:", error);
      // Aquí puedes mostrar un mensaje de error general al usuario
    }
  }

  private async obtenerCoordenadas(): Promise<Coordenadas> {
    try {
      console.log('Solicitando ubicación del usuario...');
      const coords = await firstValueFrom(this.locationService.getUserLocation());
      console.log('Ubicación precisa obtenida:', coords);
      return coords;
    } catch (error) {
      console.warn('No se pudo obtener la ubicación. Usando búsqueda por defecto.', error);
      // Devuelve las coordenadas por defecto como plan B
      return { lat: -2.170998, lng: -79.922359 };
    }
  }

  private async buscarYActualizarEmpresas(coords: Coordenadas): Promise<void> {
    const busquedaDTO: buscarempresaPorUbicacionDTO = {
      lat: coords.lat,
      lng: coords.lng,
      radio: coords.lat === -2.170998 ? 200 : 150 // Radio amplio si es por defecto, corto si es preciso
    };

    console.log('Ejecutando búsqueda con DTO:', busquedaDTO);
    const resultado = await this.empresasUseCase.execute(busquedaDTO);

    // Actualiza todas las propiedades de estado
    this.negocios = resultado;
    this.locationsParaMapa = this.negocios.map(negocio => ({
      lat: negocio.datosContactoEmpresa.latitud,
      lng: negocio.datosContactoEmpresa.longitud,
      title: negocio.nombre
    }));
    this.resultadosService.actualizarNegocios(this.negocios);

    console.log('Estado de la aplicación actualizado con', this.negocios.length, 'empresas.');
  }

}
