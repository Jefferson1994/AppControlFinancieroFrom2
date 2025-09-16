import { Component, inject, OnInit } from '@angular/core';
import { EmpresasInterfas } from '../../../domain/models/empresa.models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-colaboradores',
  standalone: true,
  imports: [],
  templateUrl: './listar-colaboradores.component.html',
  styleUrl: './listar-colaboradores.component.css'
})
export class ListarColaboradoresComponent implements OnInit {

   private route = inject(ActivatedRoute);
  
  
    empresa: EmpresasInterfas | null = null;
    empresa2: [EmpresasInterfas] | null = null;

    colaboradores = [
    {
      nombre: 'Carlos Rodriguez',
      rol: 'Barbero Principal',
      email: 'carlos.r@example.com',
      status: 'Activo',
      statusClass: 'status-activo' // Clase CSS para el estilo del estado
    },
    {
      nombre: 'Ana Martinez',
      rol: 'Estilista',
      email: 'ana.m@example.com',
      status: 'Vacaciones',
      statusClass: 'status-vacaciones'
    },
    {
      nombre: 'Jorge Vera',
      rol: 'Recepcionista',
      email: 'jorge.v@example.com',
      status: 'Activo',
      statusClass: 'status-activo'
    },
    {
      nombre: 'Lucia Gomez',
      rol: 'Barbero Junior',
      email: 'lucia.g@example.com',
      status: 'Inactivo',
      statusClass: 'status-inactivo'
    }
  ];
  
  
    ngOnInit(): void {
      const idEmpresaStr = this.route.snapshot.paramMap.get('id_empresa');
      console.log("empresa ver colaboradores ", idEmpresaStr);
  
      if (idEmpresaStr) {
        const idEmpresa = Number(idEmpresaStr);
        console.log("id de la empresa", idEmpresa);
        // ✅ Simplemente llamamos al método. Este se encargará del spinner.
        //this.cargarDatosEmpresa(idEmpresa);
      } else {
        console.error("No se encontró un ID de empresa en la URL.");
        // ✅ Nos aseguramos de ocultar el spinner si no hay ID.
        //this.loadingService.hide();
      }
    }

}
