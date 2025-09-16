import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEmpresaDetalleComponent } from './ver-empresa-detalle.component';

describe('VerEmpresaDetalleComponent', () => {
  let component: VerEmpresaDetalleComponent;
  let fixture: ComponentFixture<VerEmpresaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerEmpresaDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerEmpresaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
