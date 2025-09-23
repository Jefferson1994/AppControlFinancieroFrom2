import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import{listarProductoxEmpresaUseCase} from '../../../domain/use-cases/empresa-caseEmpresa/listarProductosXempresa.use.case'
import{listarEstadisticasxEmpresaUseCase} from '../../../domain/use-cases/empresa-caseEmpresa/listarEstadisticasXempresa.use.case'
import { EstadisticasInventario, Producto, RespuestaProductos } from '../../../domain/models/empresa.models';


@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})


export class ListarProductosComponent implements OnInit {

  selectedEmpresaId: number | null = null;
  selectedEmpresaNombre: string | null = null;
  showProductModal = false;
  private route = inject(ActivatedRoute);
  productosLista: RespuestaProductos[]| null = null;
  //public productos: RespuestaProductos[] = [];
  productos: Producto[] = [];
  estadisticas: EstadisticasInventario[] = [];
  valorTotalInventario: number | null = null;
  totalProductos: number | null = null;
  productosPocostok: number | null = null;
  ganaciaPotencial: number | null = null;

  constructor(private ListarProductoxEmpresaUseCase :listarProductoxEmpresaUseCase, private ListarEstadisticasxEmpresaUseCase : listarEstadisticasxEmpresaUseCase){

  }

async ngOnInit(): Promise<void> {
    const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
    if (idEmpresaStr) {
      this.selectedEmpresaId = Number(idEmpresaStr);
      await this.cargarProductos(this.selectedEmpresaId);
      await this.cargarEstadisticas(this.selectedEmpresaId);
    }
  }

  async cargarProductos(idEmpresa: number): Promise<void> {
    try {
      const respuesta = await this.ListarProductoxEmpresaUseCase.execute(idEmpresa);
      this.productos = respuesta.productos; // respuesta ya es Producto[]

      console.log('productos en el ts ',this.productos)
    } catch (error) {
      console.error("Error al cargar los productosss:", error);
      this.productos = [];
    }
  }


  async cargarEstadisticas(idEmpresa: number): Promise<void> {
    try {
      const respuesta = await this.ListarEstadisticasxEmpresaUseCase.execute(idEmpresa);
      this.valorTotalInventario = respuesta.valorTotalInventario;
      this.totalProductos= respuesta.totalProductos;
      this.productosPocostok= respuesta.productosConPocoStock;
      this.ganaciaPotencial=respuesta.gananciaPotencial;
      console.log("el total del inventrio ",this.valorTotalInventario )

      console.log('productos en el ts ',this.productos)
    } catch (error) {
      console.error("Error al cargar los productosss:", error);
      this.productos = [];
    }
  }





}
