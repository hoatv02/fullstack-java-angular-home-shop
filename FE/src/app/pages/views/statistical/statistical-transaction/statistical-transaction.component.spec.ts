import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalTransactionComponent } from './statistical-transaction.component';

describe('StatisticalTransactionComponent', () => {
  let component: StatisticalTransactionComponent;
  let fixture: ComponentFixture<StatisticalTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
