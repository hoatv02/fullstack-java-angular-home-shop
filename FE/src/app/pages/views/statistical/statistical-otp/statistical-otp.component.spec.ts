import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalOtpComponent } from './statistical-otp.component';

describe('StatisticalOtpComponent', () => {
  let component: StatisticalOtpComponent;
  let fixture: ComponentFixture<StatisticalOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
