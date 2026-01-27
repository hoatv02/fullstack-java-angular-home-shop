import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferServiceTypeDetailComponent } from './transfer-service-type-detail.component';

describe('TransferServiceTypeDetailComponent', () => {
  let component: TransferServiceTypeDetailComponent;
  let fixture: ComponentFixture<TransferServiceTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferServiceTypeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferServiceTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
