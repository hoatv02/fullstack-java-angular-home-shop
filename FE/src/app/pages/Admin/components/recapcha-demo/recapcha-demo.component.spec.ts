import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecapchaDemoComponent } from './recapcha-demo.component';

describe('RecapchaDemoComponent', () => {
  let component: RecapchaDemoComponent;
  let fixture: ComponentFixture<RecapchaDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecapchaDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecapchaDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
