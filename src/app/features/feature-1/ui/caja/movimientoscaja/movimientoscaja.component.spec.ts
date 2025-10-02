import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimientoscajaComponent } from './movimientoscaja.component';

describe('MovimientoscajaComponent', () => {
  let component: MovimientoscajaComponent;
  let fixture: ComponentFixture<MovimientoscajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoscajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientoscajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
