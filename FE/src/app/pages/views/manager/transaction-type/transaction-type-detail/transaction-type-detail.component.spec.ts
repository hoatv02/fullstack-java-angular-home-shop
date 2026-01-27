import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTypeDetailComponent } from './transaction-type-detail.component';

describe('TransactionTypeDetailComponent', () => {
  let component: TransactionTypeDetailComponent;
  let fixture: ComponentFixture<TransactionTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionTypeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
