import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalCustomerComponent } from './statistical-customer.component';

describe('StatisticalCustomerComponent', () => {
  let component: StatisticalCustomerComponent;
  let fixture: ComponentFixture<StatisticalCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
