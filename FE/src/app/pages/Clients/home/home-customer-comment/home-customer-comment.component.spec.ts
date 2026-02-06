import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCustomerCommentComponent } from './home-customer-comment.component';

describe('HomeCustomerCommentComponent', () => {
  let component: HomeCustomerCommentComponent;
  let fixture: ComponentFixture<HomeCustomerCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCustomerCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCustomerCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
