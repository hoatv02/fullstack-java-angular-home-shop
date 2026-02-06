import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeBannerComponent } from './home-banner/home-banner.component';
import { HomeCategoryComponent } from './home-category/home-category.component';
import { HomeBestSellingProductComponent } from './home-best-selling-product/home-best-selling-product.component';
import { HomePromotionProductComponent } from './home-promotion-product/home-promotion-product.component';
import { HomePostNewsComponent } from './home-post-news/home-post-news.component';
import { HomeCustomerCommentComponent } from './home-customer-comment/home-customer-comment.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HomeCustomerCommentComponent, HomeBannerComponent, HomePostNewsComponent, HomeCategoryComponent, HomeBestSellingProductComponent, HomePromotionProductComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  currentSlide = 0;
  touchStartX = 0;

  // News Slider State
  currentNewsIndex = 0;


  slides = [
    {
      image: 'https://cdn3630.cdn-template-4s.com/media/banner/slider1.webp',
      subtitle: 'Công nghệ tương lai cho ngôi nhà bạn',
      title: 'BẢO VỆ NGÔI NHÀ <span class="text-primary">THÔNG MINH</span>',
      description: 'Trải nghiệm giải pháp an ninh toàn diện và tiện nghi vượt trội với hệ sinh thái Sam Sam Home.',
    },
    {
      image: 'https://cdn3630.cdn-template-4s.com/media/banner/silder2_1.webp', // Placeholder or use same if only one exists
      subtitle: 'Giải pháp an ninh toàn diện',
      title: 'HỆ THỐNG GIÁM SÁT <span class="text-primary">HIỆN ĐẠI</span>',
      description: 'An tâm mọi lúc mọi nơi với hệ thống camera AI và cảnh báo sớm thông minh.',
    }
  ];

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const diff = this.touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }
}
