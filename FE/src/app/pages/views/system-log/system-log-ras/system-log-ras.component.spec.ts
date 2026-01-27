import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemLogRasComponent } from './system-log-ras.component';

describe('SystemLogRasComponent', () => {
  let component: SystemLogRasComponent;
  let fixture: ComponentFixture<SystemLogRasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemLogRasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemLogRasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
