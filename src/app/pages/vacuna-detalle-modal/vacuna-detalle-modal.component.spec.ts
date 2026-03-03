import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VacunaDetalleModalComponent } from './vacuna-detalle-modal.component';

describe('VacunaDetalleModalComponent', () => {
  let component: VacunaDetalleModalComponent;
  let fixture: ComponentFixture<VacunaDetalleModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VacunaDetalleModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VacunaDetalleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
