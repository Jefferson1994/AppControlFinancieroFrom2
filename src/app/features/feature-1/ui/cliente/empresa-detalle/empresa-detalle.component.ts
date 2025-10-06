import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Interfaces para estructurar nuestros datos
export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  duracion: number; // en minutos
  precio: number;
}

export interface Negocio {
  nombre: string;
  tipo: string;
  rating: number;
  direccion: string;
  fotos: string[];
  servicios: Servicio[];
}

@Component({
  selector: 'app-empresa-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empresa-detalle.component.html',
  styleUrls: ['./empresa-detalle.component.css']
})
export class EmpresaDetalleComponent implements OnInit {

  // --- DATOS QUEMADOS ---
  negocio: Negocio = {
    nombre: 'Barbería The Classic Cut',
    tipo: 'Barbería',
    rating: 4.9,
    direccion: 'Av. 9 de Octubre y Boyacá, Guayaquil',
    fotos: [
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
    ],
    servicios: [
      { id: 1, nombre: 'Corte de Cabello Clásico', descripcion: 'Corte a tijera y máquina, con perfilado de navaja.', duracion: 45, precio: 15.00 },
      { id: 2, nombre: 'Afeitado de Barba Premium', descripcion: 'Afeitado con toallas calientes, aceites y masaje facial.', duracion: 30, precio: 12.00 },
      { id: 3, nombre: 'Corte y Barba', descripcion: 'El paquete completo para un look impecable.', duracion: 75, precio: 25.00 },
      { id: 4, nombre: 'Tinte de Cabello', descripcion: 'Coloración profesional para un cambio de estilo.', duracion: 90, precio: 30.00 }
    ]
  };

  // Lógica para el widget de reserva
  horariosDisponibles = ['09:00', '09:45', '10:30', '11:15', '14:00', '14:45', '15:30'];
  reserva = {
    servicio: null as Servicio | null,
    fecha: '' as string,
    hora: '' as string
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Establecemos la fecha de hoy por defecto en el formato YYYY-MM-DD
    this.reserva.fecha = new Date().toISOString().split('T')[0];
  }

  seleccionarServicio(servicio: Servicio): void {
    this.reserva.servicio = servicio;
    console.log('Servicio seleccionado:', this.reserva.servicio);
  }

  seleccionarHora(hora: string): void {
    this.reserva.hora = hora;
    console.log('Hora seleccionada:', this.reserva.hora);
  }

  // Para obtener el precio total de la reserva
  get precioTotal(): number {
    return this.reserva.servicio ? this.reserva.servicio.precio : 0;
  }

   irACheckout(): void {
    if (this.reserva.servicio && this.reserva.fecha && this.reserva.hora) {
      // Creamos el objeto completo para enviar
      const datosParaCheckout = {
        servicio: this.reserva.servicio,
        fecha: this.reserva.fecha,
        hora: this.reserva.hora,
        negocio: {
          nombre: this.negocio.nombre,
          direccion: this.negocio.direccion
        }
      };

      // Navegamos a la nueva ruta pasando los datos en el 'state'
      this.router.navigate(['/Cliente-dashboard/finalizar-reserva'], {
        state: { reservaData: datosParaCheckout }
      });
    }
  }
}
