import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLogSAMComponent } from './system-log-sam.component';

describe('SystemLogSamComponent', () => {
  let component: SystemLogSAMComponent;
  let fixture: ComponentFixture<SystemLogSAMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemLogSAMComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SystemLogSAMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
