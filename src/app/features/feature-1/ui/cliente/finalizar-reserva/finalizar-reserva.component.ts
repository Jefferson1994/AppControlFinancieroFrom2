import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Definimos una interfaz para los datos que esperamos recibir
interface ReservaData {
  servicio: {
    id: number;
    nombre: string;
    duracion: number;
    precio: number;
  };
  fecha: string;
  hora: string;
  negocio: { // También pasamos info del negocio
    nombre: string;
    direccion: string;
  };
}

@Component({
  selector: 'app-finalizar-reserva',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finalizar-reserva.component.html',
  styleUrls: ['./finalizar-reserva.component.css']
})
export class FinalizarReservaComponent implements OnInit {

  public reserva: ReservaData | undefined;

  constructor(private router: Router) {
    // Obtenemos los datos pasados durante la navegación
    const navigation = this.router.getCurrentNavigation();
    this.reserva = navigation?.extras?.state?.['reservaData'];
  }

  ngOnInit(): void {
    // Si no hay datos de reserva (ej. el usuario recargó la página),
    // lo redirigimos para que no vea una página vacía.
    if (!this.reserva) {
      console.log('No hay datos de reserva, redirigiendo...');
      this.router.navigate(['/']); // Redirige a la página principal o a la de búsqueda
    }
  }

  procesarPago(): void {
    // Aquí iría la lógica para enviar los datos al backend y procesar el pago.
    console.log('Procesando pago para:', this.reserva);
    alert('¡Pago procesado con éxito! (Simulación)');
    // Navegar a la página de confirmación
    //this.router.navigate(['/reserva-confirmada']);
  }
}
