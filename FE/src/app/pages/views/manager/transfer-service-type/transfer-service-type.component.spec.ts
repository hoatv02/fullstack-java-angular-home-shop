import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferServiceTypeComponent } from './transfer-service-type.component';

describe('TransferServiceTypeComponent', () => {
  let component: TransferServiceTypeComponent;
  let fixture: ComponentFixture<TransferServiceTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferServiceTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
