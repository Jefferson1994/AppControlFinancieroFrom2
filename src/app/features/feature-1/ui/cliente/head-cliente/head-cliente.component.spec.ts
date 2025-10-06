import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadClienteComponent } from './head-cliente.component';

describe('HeadClienteComponent', () => {
  let component: HeadClienteComponent;
  let fixture: ComponentFixture<HeadClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
