import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosBusquedaClienteComponent } from './filtros-busqueda-cliente.component';

describe('FiltrosBusquedaClienteComponent', () => {
  let component: FiltrosBusquedaClienteComponent;
  let fixture: ComponentFixture<FiltrosBusquedaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosBusquedaClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosBusquedaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
