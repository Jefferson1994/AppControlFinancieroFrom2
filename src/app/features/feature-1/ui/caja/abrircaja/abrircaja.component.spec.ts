import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbrircajaComponent } from './abrircaja.component';

describe('AbrircajaComponent', () => {
  let component: AbrircajaComponent;
  let fixture: ComponentFixture<AbrircajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbrircajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbrircajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
