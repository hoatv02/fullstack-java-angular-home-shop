import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsConfigPinComponent } from './settings-config-pin.component';

describe('SettingsConfigPinComponent', () => {
  let component: SettingsConfigPinComponent;
  let fixture: ComponentFixture<SettingsConfigPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsConfigPinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsConfigPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
