import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpOcraSmsDetailComponent } from './otp-ocra-sms-detail.component';

describe('OtpOcraSmsDetailComponent', () => {
  let component: OtpOcraSmsDetailComponent;
  let fixture: ComponentFixture<OtpOcraSmsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpOcraSmsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpOcraSmsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
