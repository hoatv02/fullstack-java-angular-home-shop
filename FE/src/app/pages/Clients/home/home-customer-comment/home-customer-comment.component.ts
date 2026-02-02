import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-customer-comment',
  imports: [CommonModule],
  templateUrl: './home-customer-comment.component.html',
  styleUrl: './home-customer-comment.component.scss'
})
export class HomeCustomerCommentComponent {
  // Policy Data
  currentTestimonialIndex = 0;
  // Testimonial Data & Logic
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

  nextTestimonial() {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  prevTestimonial() {
    this.currentTestimonialIndex = (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }
}
