import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaResultadosBusquedaComponent } from './mapa-resultados-busqueda.component';

describe('MapaResultadosBusquedaComponent', () => {
  let component: MapaResultadosBusquedaComponent;
  let fixture: ComponentFixture<MapaResultadosBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaResultadosBusquedaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapaResultadosBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
