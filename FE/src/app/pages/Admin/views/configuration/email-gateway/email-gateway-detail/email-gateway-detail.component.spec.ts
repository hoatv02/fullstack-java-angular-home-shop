import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGatewayDetailComponent } from './email-gateway-detail.component';

describe('EmailGatewayDetailComponent', () => {
  let component: EmailGatewayDetailComponent;
  let fixture: ComponentFixture<EmailGatewayDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailGatewayDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailGatewayDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
