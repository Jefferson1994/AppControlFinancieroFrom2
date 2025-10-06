import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmpresasInterfas } from '../domain/models/empresa.models';

@Injectable({
  providedIn: 'root'
})
export class ResultadosBusquedaService {

  constructor() { }

    private negociosSource = new BehaviorSubject<EmpresasInterfas[]>([]);
    public negocios$ = this.negociosSource.asObservable();

    actualizarNegocios(nuevosNegocios: EmpresasInterfas[]): void {
      this.negociosSource.next(nuevosNegocios);
    }

}
