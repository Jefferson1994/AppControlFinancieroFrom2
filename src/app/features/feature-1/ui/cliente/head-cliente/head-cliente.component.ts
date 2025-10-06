import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from 'express';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {FiltrosBusquedaClienteComponent} from '../filtros-busqueda-cliente/filtros-busqueda-cliente.component'
@Component({
  selector: 'app-head-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule,FiltrosBusquedaClienteComponent],
  templateUrl: './head-cliente.component.html',
  styleUrl: './head-cliente.component.css'
})
export class HeadClienteComponent  {

  searchName: string = '';
  selectedTipo: string = '';
  selectedPrecio: string = '';

  onSearch() {
    console.log('Buscando...', {
      nombre: this.searchName,
      tipo: this.selectedTipo,
      precio: this.selectedPrecio
    });
    // Aquí puedes emitir un evento o llamar un servicio
  }


}
