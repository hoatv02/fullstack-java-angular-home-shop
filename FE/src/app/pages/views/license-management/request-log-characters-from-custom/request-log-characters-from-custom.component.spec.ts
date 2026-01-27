import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLogCharactersFromCustomComponent } from './request-log-characters-from-custom.component';

describe('RequestLogCharactersFromCustomComponent', () => {
  let component: RequestLogCharactersFromCustomComponent;
  let fixture: ComponentFixture<RequestLogCharactersFromCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestLogCharactersFromCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestLogCharactersFromCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
