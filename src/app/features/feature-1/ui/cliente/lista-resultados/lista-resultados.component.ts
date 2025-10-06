import { Component, Input, Output, EventEmitter, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { buscarempresaPorUbicacionDTO,EmpresasInterfas } from '../../../domain/models/empresa.models';
import { EmpresasXUbicacionUseCase } from '../../../domain/use-cases/empresa-caseEmpresa/buscarEmpresaCercana.use.case';
import { Negocio } from '../empresa-detalle/empresa-detalle.component';
import { SafeUrlPipe } from "../../../../../pipes/safe-url.pipe";
import { Subscription } from 'rxjs';
import { ResultadosBusquedaService } from '../../../services/resultados-busqueda.service';



@Component({
  selector: 'app-lista-resultados',
  standalone: true,
  imports: [CommonModule, HttpClientModule, SafeUrlPipe],
  templateUrl: './lista-resultados.component.html',
  styleUrls: ['./lista-resultados.component.scss']
})
export class ListaResultadosComponent implements OnInit {

  // EN LUGAR DE UN @Input, INICIALIZAMOS EL ARREGLO CON DATOS QUEMADOS
  public negocios: EmpresasInterfas[] = [];
  private subscripcion!: Subscription;
  empresa2: [EmpresasInterfas] | null = null;

  @Output() negocioSeleccionado = new EventEmitter<any>();

  constructor(private router: Router, private resultadosService: ResultadosBusquedaService) { }

   ngOnInit(): void {
    // Le decimos: "Mensajero, avísame cada vez que tengas una nueva lista de negocios"
    this.subscripcion = this.resultadosService.negocios$.subscribe(lista => {
      this.negocios = lista;
    });
  }

  ngOnDestroy(): void {
    // Dejamos de escuchar al mensajero cuando el componente se destruye
    this.subscripcion.unsubscribe();
  }

  seleccionarNegocio(negocio: any): void {
    if (negocio && negocio.id) {
      console.log(`Navegando al negocio con ID: ${negocio.id}`);

      // Esta línea es la que hace la magia de la navegación
      this.router.navigate(['/Cliente-dashboard/empresaDetalle', negocio.id]);
    } else {
      console.error('El negocio no tiene un ID para navegar.');
    }
  }



}
