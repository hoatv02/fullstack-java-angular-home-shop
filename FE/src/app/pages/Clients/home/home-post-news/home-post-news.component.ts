import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-post-news',
  imports: [CommonModule],
  templateUrl: './home-post-news.component.html',
  styleUrl: './home-post-news.component.scss'
})
export class HomePostNewsComponent {
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
}
