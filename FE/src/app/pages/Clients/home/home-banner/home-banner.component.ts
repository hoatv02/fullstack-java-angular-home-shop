import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-banner',
  imports: [CommonModule],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.scss'
})
export class HomeBannerComponent {
  currentSlide = 0;
  touchStartX = 0;
  // News Slider State
  currentNewsIndex = 0;
  newsItems = [
    {
      date: '10 tháng 10, 2024',
      title: 'Loại Camera an ninh nào tốt nhất hiện nay',
      image: 'https://cdn3630.cdn-template-4s.com/thumbs/bai-viet/news-10_thumb_720.webp'
    },
    {
      date: '10 tháng 10, 2024',
      title: 'Có nên mua máy lọc không khí mini không',
      image: 'https://cdn3630.cdn-template-4s.com/thumbs/bai-viet/news-8_thumb_720.webp'
    },
    {
      date: '10 tháng 10, 2024',
      title: 'Top 5 loại camera thông minh hot nhất hiện nay',
      image: 'https://cdn3630.cdn-template-4s.com/thumbs/bai-viet/news-7_thumb_720.webp'
    },
    {
      date: '10 tháng 10, 2024',
      title: 'Có nên mua khóa thẻ từ Adel hay không?',
      image: 'https://cdn3630.cdn-template-4s.com/thumbs/bai-viet/news-5_thumb_720.webp'
    },
    {
      date: '12 tháng 10, 2024',
      title: 'Giải pháp nhà thông minh toàn diện 2024',
      image: 'https://cdn3630.cdn-template-4s.com/thumbs/bai-viet/news-10_thumb_720.webp'
    },
    {
      date: '15 tháng 10, 2024',
      title: 'Hệ thống an ninh cho căn hộ chung cư',
      image: 'https://cdn3630.cdn-template-4s.com/thumbs/bai-viet/news-8_thumb_720.webp'
    }
  ];

  nextNews() {
    const maxIndex = Math.max(0, this.newsItems.length - 4);
    if (this.currentNewsIndex < maxIndex) {
      this.currentNewsIndex++;
    } else {
      this.currentNewsIndex = 0; // Loop back
    }
  }

  prevNews() {
    if (this.currentNewsIndex > 0) {
      this.currentNewsIndex--;
    } else {
      this.currentNewsIndex = Math.max(0, this.newsItems.length - 4); // Loop to end
    }
  }
  // Policy Data
  policyItems = [
    {
      icon: 'fa-solid fa-truck-fast',
      title: 'Giao hàng miễn phí',
      description: 'Giá vận chuyển cho mọi hình thức giao hàng và chi phí đơn hàng là không đổi - 30k. Miễn phí vận chuyển cho các đơn hàng trên 500k.'
    },
    {
      icon: 'fa-solid fa-headset',
      title: 'Hỗ trợ trực tuyến 24/7',
      description: 'Chúng tôi cung cấp chế độ bảo hành 5 năm, đảm bảo hoàn tiền trong vòng 60 ngày và hỗ trợ kỹ thuật trọn đời.'
    },
    {
      icon: 'fa-regular fa-credit-card',
      title: 'Trả hàng và hoàn tiền',
      description: 'Bất kỳ hàng hóa nào được mua tại cửa hàng trực tuyến của chúng tôi đều có thể được trả lại nếu bị lỗi trong vòng 30 ngày kể từ ngày mua.'
    }
  ];

  // Testimonial Data & Logic
  currentTestimonialIndex = 0;
  testimonials = [
    {
      stars: 5,
      text: 'Sản phẩm hoạt động tốt, máy chạy êm, giá cả hợp lí, nhân viên tư vấn nhiệt tình chu đáo, dịch vụ chăm sóc khách hàng tốt. Tôi sẽ giới thiệu cho người thân và bạn bè sử dụng',
      author: 'Nguyễn Hoàng Tuyến',
      role: 'Khách hàng'
    },
    {
      stars: 5,
      text: 'Chất lượng camera tuyệt vời, hình ảnh sắc nét cả ngày lẫn đêm. Cài đặt dễ dàng và ứng dụng trên điện thoại rất mượt mà. Rất hài lòng với trải nghiệm mua sắm tại đây.',
      author: 'Trần Minh Đức',
      role: 'Kỹ sư phần mềm'
    },
    {
      stars: 4,
      text: 'Dịch vụ giao hàng nhanh chóng, đóng gói cẩn thận. Sản phẩm đúng như mô tả, hoạt động ổn định. Sẽ ủng hộ shop dài dài.',
      author: 'Lê Thị Mai',
      role: 'Nhân viên văn phòng'
    }
  ];

  nextTestimonial() {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.currentTestimonialIndex = (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

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
