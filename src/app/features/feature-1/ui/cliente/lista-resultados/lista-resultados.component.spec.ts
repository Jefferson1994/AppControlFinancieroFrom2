import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaResultadosComponent } from './lista-resultados.component';

describe('ListaResultadosComponent', () => {
  let component: ListaResultadosComponent;
  let fixture: ComponentFixture<ListaResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaResultadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
