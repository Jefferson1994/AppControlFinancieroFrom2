import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FotherClienteComponent } from './fother-cliente.component';

describe('FotherClienteComponent', () => {
  let component: FotherClienteComponent;
  let fixture: ComponentFixture<FotherClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FotherClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FotherClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
