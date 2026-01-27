import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpOcraSmsComponent } from './otp-ocra-sms.component';

describe('OtpOcraSmsComponent', () => {
  let component: OtpOcraSmsComponent;
  let fixture: ComponentFixture<OtpOcraSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtpOcraSmsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpOcraSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
