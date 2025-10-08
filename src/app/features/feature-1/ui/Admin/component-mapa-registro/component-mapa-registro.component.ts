import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit,EventEmitter,Output, Input, SimpleChanges } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-component-mapa-registro',
  standalone: true,
  imports: [GoogleMap,CommonModule],
  templateUrl: './component-mapa-registro.component.html',
  styleUrl: './component-mapa-registro.component.scss'
})
export class ComponentMapaRegistroComponent implements OnInit {

    // --- NUEVOS INPUTS para recivir data ---
    @Input() initialLocation: { lat: number, lng: number } | null = null;
    @Input() isDraggable: boolean = false; // Por defecto, no es arrastrable



    @Output() locationSelected = new EventEmitter<{
    lat: number;
    lng: number;
    canton: string;
    province: string;
    address: string;
    country: string;
    direccionFisica: string;
    addressURl: string;
  }>();

  center: google.maps.LatLngLiteral = { lat: -2.90055, lng: -79.00453 };
  zoom = 12;
  markerPosition?: google.maps.LatLngLiteral;
  map: google.maps.Map | undefined;
  marker: google.maps.Marker | undefined;
  cantonName: string = '';
  provinceName: string = '';
  address: string = '';
  countryName: string = '';
  mapUrl: string = '';
  streetAddress: string = '';

  private apiKey = 'AIzaSyAqPFpSHGA8FFV8wii7r4Ivo2M0igtfNoo';
  private geocodingUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    /*this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: this.center,
      zoom: this.zoom
    });*/
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    center: this.initialLocation || this.center,
    zoom: this.initialLocation ? 16 : 12
  });

  // 2. Lógica para el marcador INICIAL. ESTA ES LA PARTE IMPORTANTE.
  if (this.initialLocation) {
    // Si al crear el mapa YA tenemos una ubicación, dibujamos el marcador.
    console.log('initMap: Ubicación inicial encontrada. Dibujando marcador.');
    this.placeMarker(this.initialLocation.lat, this.initialLocation.lng);


  }else{
      this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              this.markerPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              };

              console.log('Marker Position:', this.markerPosition);

              if (this.marker) {
                this.marker.setMap(null); // Elimina el marcador anterior si existe
              }

              this.marker = new google.maps.Marker({
                position: this.markerPosition,
                map: this.map,
                draggable: false // Asegura que el marcador no se pueda arrastrar
              });

              // Obtiene el nombre del cantón y la provincia
              this.getCantonAndProvinceName(this.markerPosition.lat, this.markerPosition.lng);
            }
          });
    }


  }

  /*getCantonAndProvinceName(lat: number, lng: number) {
    const url = `${this.geocodingUrl}?latlng=${lat},${lng}&key=${this.apiKey}`;

    this.http.get<any>(url).subscribe(response => {
      if (response.results && response.results.length > 0) {
        this.address = response.results[0].formatted_address;
        let cantonFound = false;
        let provinceFound = false;

        for (const result of response.results) {
          for (const component of result.address_components) {
            if (!cantonFound && component.types.includes('administrative_area_level_2')) {
              this.cantonName = component.long_name;
              cantonFound = true;
            }

            if (!provinceFound && component.types.includes('administrative_area_level_1')) {
              this.provinceName = component.long_name;
              provinceFound = true;
            }

            if (cantonFound && provinceFound) {
              break;
            }
          }

          if (cantonFound && provinceFound) {
            break;
          }
        }

        if (!cantonFound) {
          this.cantonName = 'Unknown Canton';
        }

        if (!provinceFound) {
          this.provinceName = 'Unknown Province';
        }

        // Generar URL de Google Maps
        const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

        // Incluir la dirección y la URL en el mismo campo `address`
        this.address = `${googleMapsUrl}`;

        // Emitir el evento con los datos
        this.locationSelected.emit({
          lat: this.markerPosition!.lat,
          lng: this.markerPosition!.lng,
          canton: this.cantonName,
          province: this.provinceName,
          country: this.countryName,              // La variable que guarda el país
          direccionFisica: this.streetAddress,    // La variable para la dirección legible
          addressURl: this.mapUrl,
          address: this.address,
        });

        console.log('Canton Name:', this.cantonName);
        console.log('Province Name:', this.provinceName);
        console.log('Address with Google Maps URL:', this.address);
      } else {
        this.cantonName = 'Canton not found';
        this.provinceName = 'Province not found';
        this.address = 'Address not found';
        console.log('Canton Name:', this.cantonName);
        console.log('Province Name:', this.provinceName);
        console.log('Address:', this.address);
      }
    }, error => {
      console.error('Error fetching canton, province and address:', error);
    });
  }*/

  getCantonAndProvinceName(lat: number, lng: number) {
    const url = `${this.geocodingUrl}?latlng=${lat},${lng}&key=${this.apiKey}`;

    this.http.get<any>(url).subscribe({
      next: response => {
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          const addressComponents = result.address_components;

          // Extraemos todos los datos que necesitamos
          this.streetAddress = result.formatted_address || 'Dirección no encontrada';
          this.cantonName = this.findAddressComponent(addressComponents, 'administrative_area_level_2');
          this.provinceName = this.findAddressComponent(addressComponents, 'administrative_area_level_1');
          this.countryName = this.findAddressComponent(addressComponents, 'country');
          this.mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
          this.address = this.streetAddress; // Mantenemos 'address' con la dirección física

          console.log(`País: ${this.countryName}, Provincia: ${this.provinceName}, Cantón: ${this.cantonName}`);

          // Emitimos el objeto completo con la estructura correcta
          this.locationSelected.emit({
            lat: lat,
            lng: lng,
            canton: this.cantonName,
            province: this.provinceName,
            country: this.countryName,
            direccionFisica: this.address,
            addressURl: this.mapUrl,
            address: this.address,
          });

        } else {
          console.log('No se encontraron resultados para la ubicación.');
          // Puedes emitir valores por defecto si lo deseas
        }
      },
      error: error => {
        console.error('Error al obtener datos de geolocalización:', error);
      }
    });
  }

   private findAddressComponent(components: any[], type: string): string {
      const component = components.find(c => c.types.includes(type));
      return component ? component.long_name : 'N/A';
    }

    // para recivir mapa
  // En component-mapa-registro.component.ts

private placeMarker(lat: number, lng: number): void {
  this.markerPosition = { lat, lng };

  if (this.marker) {
    this.marker.setMap(null);
  }

  this.marker = new google.maps.Marker({
    position: this.markerPosition,
    map: this.map,
    draggable: this.isDraggable // El estado inicial de 'draggable' se establece aquí
  });

  // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
  // Adjuntamos el listener SIEMPRE, sin importar si 'isDraggable' es true o false al inicio.
  // El evento 'dragend' solo se disparará si el marcador tiene 'draggable: true'.
  this.marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      console.log('Nueva posición (arrastrada):', { newLat, newLng });

      // Llamamos a la función que obtiene los datos y emite el evento
      this.getCantonAndProvinceName(newLat, newLng);
    }
  });

  // Obtenemos la dirección de la ubicación actual y la emitimos
  this.getCantonAndProvinceName(lat, lng);
}

  ngOnChanges(changes: SimpleChanges): void {
  // Si el mapa ya existe y el valor de 'initialLocation' ha cambiado
  console.log('MAPA HIJO: ngOnChanges detectó cambios!', JSON.stringify(changes));
    if (this.map && changes['initialLocation'] && !changes['initialLocation'].firstChange) {
      if (this.initialLocation) {
         console.log('entro')
          this.placeMarker(this.initialLocation.lat, this.initialLocation.lng);
          this.map.setCenter(this.initialLocation);
      }
    }

    if (this.marker && changes['isDraggable']) {
    const isNowDraggable = changes['isDraggable'].currentValue;
    console.log(`MAPA HIJO: Cambiando estado 'draggable' a: ${isNowDraggable}`);

    // Usamos el método setDraggable() del marcador para actualizarlo en tiempo real
    this.marker.setDraggable(isNowDraggable);
  }
  }



}

