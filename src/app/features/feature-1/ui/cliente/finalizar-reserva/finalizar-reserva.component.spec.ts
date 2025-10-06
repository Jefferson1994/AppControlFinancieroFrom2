import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalizarReservaComponent } from './finalizar-reserva.component';

describe('FinalizarReservaComponent', () => {
  let component: FinalizarReservaComponent;
  let fixture: ComponentFixture<FinalizarReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalizarReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalizarReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
