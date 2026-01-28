import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalSmartOtpComponent } from './statistical-smart-otp.component';

describe('StatisticalSmartOtpComponent', () => {
  let component: StatisticalSmartOtpComponent;
  let fixture: ComponentFixture<StatisticalSmartOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalSmartOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalSmartOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
