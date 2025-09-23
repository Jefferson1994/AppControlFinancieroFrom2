import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentMapaRegistroComponent } from './component-mapa-registro.component';

describe('ComponentMapaRegistroComponent', () => {
  let component: ComponentMapaRegistroComponent;
  let fixture: ComponentFixture<ComponentMapaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentMapaRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentMapaRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
