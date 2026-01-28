import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionLogDetailComponent } from './transaction-log-detail.component';

describe('TransactionLogDetailComponent', () => {
  let component: TransactionLogDetailComponent;
  let fixture: ComponentFixture<TransactionLogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionLogDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionLogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
