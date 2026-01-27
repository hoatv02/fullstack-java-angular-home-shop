import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticalDeviceComponent } from './statistical-device.component';

describe('StatisticalDeviceComponent', () => {
  let component: StatisticalDeviceComponent;
  let fixture: ComponentFixture<StatisticalDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticalDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticalDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
