import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VacunaAddModalComponent } from './vacuna-add-modal.component';

describe('VacunaAddModalComponent', () => {
  let component: VacunaAddModalComponent;
  let fixture: ComponentFixture<VacunaAddModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VacunaAddModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VacunaAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
