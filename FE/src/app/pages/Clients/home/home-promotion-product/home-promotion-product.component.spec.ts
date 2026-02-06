import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePromotionProductComponent } from './home-promotion-product.component';

describe('HomePromotionProductComponent', () => {
  let component: HomePromotionProductComponent;
  let fixture: ComponentFixture<HomePromotionProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePromotionProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePromotionProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
