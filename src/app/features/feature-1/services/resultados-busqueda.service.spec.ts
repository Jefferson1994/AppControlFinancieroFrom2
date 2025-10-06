import { TestBed } from '@angular/core/testing';

import { ResultadosBusquedaService } from './resultados-busqueda.service';

describe('ResultadosBusquedaService', () => {
  let service: ResultadosBusquedaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadosBusquedaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
