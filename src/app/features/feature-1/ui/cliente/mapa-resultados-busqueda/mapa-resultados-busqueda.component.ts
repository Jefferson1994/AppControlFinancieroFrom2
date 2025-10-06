import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, input, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';

export interface LocationData {
  lat: number;
  lng: number;
  title?: string; // Título opcional para el marcador
}


@Component({
  selector: 'app-mapa-resultados-busqueda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-resultados-busqueda.component.html',
  styleUrl: './mapa-resultados-busqueda.component.css'
})
export class MapaResultadosBusquedaComponent implements OnChanges, AfterViewInit  {

  @Input() locations: LocationData[] = [];

  // Con @ViewChild, obtenemos una referencia directa al <div> del HTML
  @ViewChild('map') mapElement!: ElementRef;

  // Propiedades para manejar el mapa y los marcadores directamente
  private map: google.maps.Map | undefined;
  private markers: google.maps.Marker[] = [];

  constructor() { }

  // ngAfterViewInit se ejecuta después de que la vista (el HTML) se ha cargado.
  // Es el momento perfecto para inicializar el mapa.
  ngAfterViewInit(): void {
    this.initMap();
  }

  // ngOnChanges se ejecuta cada vez que el @Input() 'locations' cambia.
  ngOnChanges(changes: SimpleChanges): void {
    // Solo actuamos si el mapa ya fue inicializado y las ubicaciones cambiaron
    if (this.map && changes['locations']) {
        console.log("Nuevas ubicaciones recibidas, redibujando marcadores:", this.locations);
        this.updateMarkers();
    }
  }

  private initMap(): void {
    const mapProperties = {
      center: new google.maps.LatLng(-2.19616, -79.88621), // Centro inicial
      zoom: 12,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);

    // Si los datos ya estaban disponibles al iniciar, los dibujamos
    if(this.locations.length > 0) {
        this.updateMarkers();
    }
  }

  private updateMarkers(): void {
    // 1. Borramos todos los marcadores anteriores
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = []; // Limpiamos el array

    // Si no hay nuevas ubicaciones, no hacemos nada más
    if (!this.locations || this.locations.length === 0) {
        return;
    }

    const bounds = new google.maps.LatLngBounds();

    // 2. Creamos los nuevos marcadores
    this.locations.forEach(location => {
      const position = new google.maps.LatLng(location.lat, location.lng);

      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: location.title ?? ''
      });

      this.markers.push(marker);
      bounds.extend(position); // Extendemos los límites para incluir este marcador
    });

    // 3. Ajustamos el mapa para que todos los marcadores sean visibles
    if (this.locations.length > 1) {
        this.map?.fitBounds(bounds);
    } else if (this.locations.length === 1) {
        this.map?.setCenter(bounds.getCenter());
        this.map?.setZoom(15); // Un zoom razonable para un solo punto
    }
  }

}
