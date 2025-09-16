import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarColaboradoresComponent } from './listar-colaboradores.component';

describe('ListarColaboradoresComponent', () => {
  let component: ListarColaboradoresComponent;
  let fixture: ComponentFixture<ListarColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarColaboradoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
