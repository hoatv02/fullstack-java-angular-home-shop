import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsGatewayDetailComponent } from './sms-gateway-detail.component';

describe('SmsGatewayDetailComponent', () => {
  let component: SmsGatewayDetailComponent;
  let fixture: ComponentFixture<SmsGatewayDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmsGatewayDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmsGatewayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
