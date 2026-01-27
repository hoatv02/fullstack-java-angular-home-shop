import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceManagerDetailComponent } from './device-manager-detail.component';

describe('DeviceManagerDetailComponent', () => {
  let component: DeviceManagerDetailComponent;
  let fixture: ComponentFixture<DeviceManagerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceManagerDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceManagerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
