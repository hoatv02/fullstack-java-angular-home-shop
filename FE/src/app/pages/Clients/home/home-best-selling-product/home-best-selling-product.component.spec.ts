import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBestSellingProductComponent } from './home-best-selling-product.component';

describe('HomeBestSellingProductComponent', () => {
  let component: HomeBestSellingProductComponent;
  let fixture: ComponentFixture<HomeBestSellingProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBestSellingProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBestSellingProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
