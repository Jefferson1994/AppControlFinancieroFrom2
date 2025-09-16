import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface Producto {
  nombre: string;
  sku: string;
  imageUrl: string;
  categoria: string;
  precioVenta: number;
  costo: number;
  stock: number;
  status: string;
  statusClass: string;
}

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})


export class ListarProductosComponent {

  productos: Producto[] = [
    {
      nombre: 'Cera Moldeadora Fuerte',
      sku: 'SKU: 1001',
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_677822-MLU78456287432_082024-O.webp',
      categoria: 'Gel',
      precioVenta: 15.00,
      costo: 8.50,
      stock: 32,
      status: 'En Stock',
      statusClass: 'status-instock'
    },
    {
      nombre: 'Shampoo Anti-caída',
      sku: 'SKU: 1002',
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_677822-MLU78456287432_082024-O.webp',
      categoria: 'Shampoo',
      precioVenta: 12.50,
      costo: 6.00,
      stock: 4,
      status: 'Poco Stock',
      statusClass: 'status-lowstock'
    },
    {
      nombre: 'Aceite para Barba',
      sku: 'SKU: 1003',
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_677822-MLU78456287432_082024-O.webp',
      categoria: 'Aceites',
      precioVenta: 18.00,
      costo: 9.50,
      stock: 0,
      status: 'Agotado',
      statusClass: 'status-outofstock'
    }
  ];

}
