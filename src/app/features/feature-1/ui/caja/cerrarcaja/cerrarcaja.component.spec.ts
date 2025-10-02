import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarcajaComponent } from './cerrarcaja.component';

describe('CerrarcajaComponent', () => {
  let component: CerrarcajaComponent;
  let fixture: ComponentFixture<CerrarcajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CerrarcajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CerrarcajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
