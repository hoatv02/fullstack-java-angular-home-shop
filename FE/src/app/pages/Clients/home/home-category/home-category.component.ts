import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-category',
  imports: [CommonModule],
  templateUrl: './home-category.component.html',
  styleUrl: './home-category.component.scss'
})
export class HomeCategoryComponent {
  array = [
    {
      "id": 2,
      "name": "Thiết bị nhà bếp",
      "slug": "thiet-bi-nha-bep",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "1",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-1_thumb_350.webp"
    },
    {
      "id": 3,
      "name": "Thiết bị điện gia đình",
      "slug": "thiet-bi-dien-gia-dinh",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "2",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-3_thumb_350.webp"
    },
    {
      "id": 4,
      "name": "Đồ dùng sinh hoạt",
      "slug": "do-dung-sinh-hoat",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "3",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-3_thumb_350.webp"
    },
    {
      "id": 5,
      "name": "Dụng cụ vệ sinh",
      "slug": "dung-cu-ve-sinh",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "4",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-5_thumb_350.webp"
    },
    {
      "id": 6,
      "name": "Thiết bị chăm sóc cá nhân",
      "slug": "thiet-bi-cham-soc-ca-nhan",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "5",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-6_thumb_350.webp"
    },
    {
      "id": 7,
      "name": "Đồ dùng phòng ngủ",
      "slug": "do-dung-phong-ngu",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "6",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-7_thumb_350.webp"
    },
    {
      "id": 8,
      "name": "Đồ dùng phòng tắm",
      "slug": "do-dung-phong-tam",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "7",
      "imageUrl": "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
    },
    {
      "id": 9,
      "name": "Thiết bị tiết kiệm điện",
      "slug": "thiet-bi-tiet-kiem-dien",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "8",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-7_thumb_350.webp"
    },
    {
      "id": 10,
      "name": "Đồ dùng thông minh",
      "slug": "do-dung-thong-minh",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "9",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-7_thumb_350.webp"
    },
    {
      "id": 11,
      "name": "Đồ gia dụng mini",
      "slug": "do-gia-dung-mini",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "10",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-7_thumb_350.webp"
    },

    {
      "id": 13,
      "name": "Phụ kiện đồ gia dụng",
      "slug": "phu-kien-do-gia-dung",
      "parentId": "1",
      "level": "1",
      "status": "ACTIVE",
      "sortOrder": "12",
      "imageUrl": "https://cdn3630.cdn-template-4s.com/thumbs/san-pham/category-7_thumb_350.webp"
    }
  ]
}
