import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalSmsOtpComponent } from './statistical-sms-otp.component';

describe('StatisticalSmsOtpComponent', () => {
  let component: StatisticalSmsOtpComponent;
  let fixture: ComponentFixture<StatisticalSmsOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalSmsOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalSmsOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
