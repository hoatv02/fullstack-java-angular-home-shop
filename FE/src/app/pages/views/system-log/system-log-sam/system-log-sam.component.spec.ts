import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLogSamComponent } from './system-log-sam.component';

describe('SystemLogSamComponent', () => {
  let component: SystemLogSamComponent;
  let fixture: ComponentFixture<SystemLogSamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemLogSamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemLogSamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
