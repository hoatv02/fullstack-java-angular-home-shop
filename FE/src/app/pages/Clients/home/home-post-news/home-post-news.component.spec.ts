import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePostNewsComponent } from './home-post-news.component';

describe('HomePostNewsComponent', () => {
  let component: HomePostNewsComponent;
  let fixture: ComponentFixture<HomePostNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePostNewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePostNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
