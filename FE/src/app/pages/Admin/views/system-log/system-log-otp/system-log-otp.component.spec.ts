import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLogOtpComponent } from './system-log-otp.component';

describe('SystemLogOtpComponent', () => {
  let component: SystemLogOtpComponent;
  let fixture: ComponentFixture<SystemLogOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemLogOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemLogOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
