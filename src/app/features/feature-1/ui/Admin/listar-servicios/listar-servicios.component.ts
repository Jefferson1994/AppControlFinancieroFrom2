import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
export interface Servicio {
  nombre: string;
  precio: number;
  categoria: string;
  duracion: string;
  descripcion: string;
  imageUrl: string;
  status: 'Activo' | 'Inactivo';
  statusClass: string;
}

@Component({
  selector: 'app-listar-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-servicios.component.html',
  styleUrl: './listar-servicios.component.css'
})
export class ListarServiciosComponent {

  servicios: Servicio[] = [
    {
      nombre: 'Corte de Caballero Clásico',
      precio: 10.00,
      categoria: 'Cortes de Cabello',
      duracion: '45 min',
      descripcion: 'Un corte de precisión con tijera y máquina, finalizado con lavado y peinado.',
      imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2657329231/display_1500/stock-vector-a-clear-image-displaying-silhouettes-of-five-people-two-women-and-three-men-they-stand-side-by-2657329231.jpg',
      status: 'Activo',
      statusClass: 'status-activo'
    },
    {
      nombre: 'Arreglo de Barba Premium',
      precio: 8.00,
      categoria: 'Cuidado de Barba',
      duracion: '30 min',
      descripcion: 'Diseño y perfilado de barba con toallas calientes, navaja y aceites esenciales.',
      imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2657329231/display_1500/stock-vector-a-clear-image-displaying-silhouettes-of-five-people-two-women-and-three-men-they-stand-side-by-2657329231.jpg',
      status: 'Activo',
      statusClass: 'status-activo'
    },
    {
      nombre: 'Tratamiento Facial',
      precio: 25.00,
      categoria: 'Tratamientos',
      duracion: '60 min',
      descripcion: 'Limpieza facial profunda con exfoliación e hidratación para revitalizar la piel.',
      imageUrl: 'https://www.shutterstock.com/shutterstock/photos/2657329231/display_1500/stock-vector-a-clear-image-displaying-silhouettes-of-five-people-two-women-and-three-men-they-stand-side-by-2657329231.jpg',
      status: 'Inactivo',
      statusClass: 'status-inactivo'
    }
  ];

}
