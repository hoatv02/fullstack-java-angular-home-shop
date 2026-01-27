import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsConfigEmailGatewayComponent } from './settings-config-email-gateway.component';

describe('SettingsConfigEmailGatewayComponent', () => {
  let component: SettingsConfigEmailGatewayComponent;
  let fixture: ComponentFixture<SettingsConfigEmailGatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsConfigEmailGatewayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsConfigEmailGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
