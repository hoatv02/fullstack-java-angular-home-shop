import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface Product {
    id: number;
    name: string;
    price: number | null;
    originalPrice?: number;
    discount?: number;
    sku: string;
    categories: string[];
    features: string[];
    images: string[];
    description: string;
    specifications: { key: string; value: string }[];
}

interface Category {
    id: number;
    name: string;
    count: number;
}

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ToastModule],
    providers: [MessageService],
    templateUrl: './product-detail.component.html',
    styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
    product: Product = {
        id: 3,
        name: 'Khóa cửa vân tay Samsung SHP-DP728BK/EN',
        price: 4000000,
        sku: 'I9S2SXKAN3',
        categories: ['Khóa thông minh', 'Hệ thống giám sát', 'Gia dụng thông minh'],
        features: [
            'Máy lọc không khí mini cho ô tô, bàn làm việc...',
            'Diện tích phù hợp: 3-5m²',
            '5 cấp lọc: Pre, Cacbon, HEPA, UV, Ion.',
            'Màn hình hiển thị thông minh: cảnh bảo thay màng, hiện thị chất lượng không khí.',
            'Tạo hương thơm dễ chịu (nhờ bộ phát tán tinh dầu).',
            '2 tốc độ gió. Đặc biệt có chế độ tự động điều chỉnh tốc độ theo chất lượng không khí.'
        ],
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuABdw1hvRaikmCYKTRL-QoDusckGl7lxHksFCIMttgF4kWtisBYsPDpq_79aIFpVc2Nf65gEqyNmtlNVqkfvEej2ekLzgha2CtuzN4OdiJrY2MNY0xy3znO41TMkU0XxFfF78RhcMVmU30k02Ebf1yMuwM_icbTxeSi2ihJMLrqTtw2yz_2qhhxL-83P_6sy8JvqvzyZZjkhTJnHzfn_hXiNkNpTEyX_dJPSUGr5lqARx5ew8gV3YCcPHr__XGow9EkX2EdjsT-viQ',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGNAeqenS_2flZDBidRkgvh4a81fAYXoOVksSMT9ul5yFntNO85a97aPmOaFvko7hbt1ePQG9Kb5ZqNuEN_tC23Edv3jN7D0df0CKEJh2bOGfAtaBn04wme6HKJLfccGMe6W1_wd7elbWmJtj0PuMMEYBKKgnCvQDMwPsYureO3yP1EDTNJGouCjcpEdtNMHV94bD9Or_VVGz6pD-u1fxFHDEPhnkquENxp062qdFKQ32TFJIY8gc6-0vQ2ssQkZ9CEi4hzDm25c'
        ],
        description: `
            <p><strong>"VUA CẤP LỌC" – 5 CẤP LỌC ƯU VIỆT TỐI ƯU KHẢ NĂNG LỌC VÀ KHỬ MÙI</strong></p>
            <ul>
                <li>Với 5 cấp lọc ưu việt, máy có khả năng loại bỏ bụi bẩn, nấm mốc, vi khuẩn, lọc những vật chất gây ô nhiễm trong không khí siêu nhỏ với kích thước lớn hơn 0.3 micromet, các phân tử bụi có trong không khí, các tác nhân có thể gây hen suyễn hay dị ứng hô hấp mà mắt thường không trông thấy được.</li>
                <li>Máy có tác dụng hấp thụ các mùi độc hại do chất hữu cơ bay ra (VOC) như mùi nội thất ô tô, mùi da, nhựa mới, mùi thuốc lá, mùi xăng xe...</li>
                <li>Đặc biệt, máy tích hợp thêm lớp xúc tác quang và đèn UV giúp tăng hiệu quả diệt khuẩn gấp nhiều lần và loại bỏ được những chất khí độc hại (formaldehyde) phát tán trong không khí.</li>
            </ul>
            <p><strong>THIẾT KẾ NHỎ GỌN – ĐA DỤNG</strong></p>
            <ul>
                <li>Với các góc bo cong tinh tế, mỏng nhẹ vừa đủ gọn, cộng thêm dây nguồn dài, khách hàng có thể sử dụng ở nhiều vị trí khác nhau trong ô tô, trên bàn làm việc hay cả cạnh giường ngủ.</li>
            </ul>
            <p><strong>MÀN HÌNH HIỂN THỊ THÔNG MINH</strong></p>
            <ul>
                <li>Tối ưu trải nghiệm với màn hình hiển thị thông minh: cảnh báo chất lượng không khí, cảnh báo thay màng lọc – giúp người dùng dễ dàng sử dụng và kiểm soát độ trong lành của không khí.</li>
            </ul>
        `,
        specifications: [
            { key: 'Mã sản phẩm', value: 'I9S2SXKAN3' },
            { key: 'Thương hiệu', value: 'Samsung' },
            { key: 'Xuất xứ', value: 'Hàn Quốc' }
        ]
    };

    relatedProducts: any[] = [
        {
            id: 2,
            name: 'Bóng đèn Philips Hue White Ambiance',
            price: 4000000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGNAeqenS_2flZDBidRkgvh4a81fAYXoOVksSMT9ul5yFntNO85a97aPmOaFvko7hbt1ePQG9Kb5ZqNuEN_tC23Edv3jN7D0df0CKEJh2bOGfAtaBn04wme6HKJLfccGMe6W1_wd7elbWmJtj0PuMMEYBKKgnCvQDMwPsYureO3yP1EDTNJGouCjcpEdtNMHV94bD9Or_VVGz6pD-u1fxFHDEPhnkquENxp062qdFKQ32TFJIY8gc6-0vQ2ssQkZ9CEi4hzDm25c'
        },
        {
            id: 4,
            name: 'Bộ điều nhiệt thông minh',
            price: null,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3zIH6eG9Rb7CalwXQ72S-zSOAmPnCJC934EAJgbbgv63Uf9Vg5rKCeNSQgcShTzx4-Ohvx8E8qK_5lFAfkrz-kSZ5yz2nIzjYJ2rRGNgfk20Z9rakfs2a1LCmERXaxJ5BGv8hw9PRT4R5l-1jsJxhLYYjF9y-JZB6MGfVuMW3ih8qNUo8FOTi9KdUPMFtEIrWxCgEPP8y3PtdszZ_G2HOGAJLa-K_WsJ0WgGY-DvcejKqW1CCFrP3Tshi4eqF_aNDJzzin5x4cUg'
        },
        {
            id: 5,
            name: 'Khóa cửa thông minh Kitos KT-G900',
            price: 3000000,
            originalPrice: 4000000,
            discount: 25,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGNAeqenS_2flZDBidRkgvh4a81fAYXoOVksSMT9ul5yFntNO85a97aPmOaFvko7hbt1ePQG9Kb5ZqNuEN_tC23Edv3jN7D0df0CKEJh2bOGfAtaBn04wme6HKJLfccGMe6W1_wd7elbWmJtj0PuMMEYBKKgnCvQDMwPsYureO3yP1EDTNJGouCjcpEdtNMHV94bD9Or_VVGz6pD-u1fxFHDEPhnkquENxp062qdFKQ32TFJIY8gc6-0vQ2ssQkZ9CEi4hzDm25c'
        },
        {
            id: 6,
            name: 'Camera IP thông minh Xiaomi Mi Home 360',
            price: 3000000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABdw1hvRaikmCYKTRL-QoDusckGl7lxHksFCIMttgF4kWtisBYsPDpq_79aIFpVc2Nf65gEqyNmtlNVqkfvEej2ekLzgha2CtuzN4OdiJrY2MNY0xy3znO41TMkU0XxFfF78RhcMVmU30k02Ebf1yMuwM_icbTxeSi2ihJMLrqTtw2yz_2qhhxL-83P_6sy8JvqvzyZZjkhTJnHzfn_hXiNkNpTEyX_dJPSUGr5lqARx5ew8gV3YCcPHr__XGow9EkX2EdjsT-viQ'
        }
    ];

    ratingStats = [
        { star: 5, percent: 0 },
        { star: 4, percent: 0 },
        { star: 3, percent: 0 },
        { star: 2, percent: 0 },
        { star: 1, percent: 0 }
    ];

    categoriesList: Category[] = [
        { id: 1, name: 'Phụ kiện', count: 7 },
        { id: 2, name: 'Khóa thông minh', count: 4 },
        { id: 3, name: 'Đèn thông minh', count: 2 },
        { id: 4, name: 'Hệ thống giám sát', count: 8 },
        { id: 5, name: 'Thiết bị nghe nhìn', count: 9 },
        { id: 6, name: 'Gia dụng thông minh', count: 23 },
        { id: 7, name: 'Điều hòa không khí', count: 4 },
    ];

    selectedCategory: number | null = null;
    selectedPriceRange: string | null = null;
    statusFilters = {
        isHot: false,
        isSale: false,
        inStock: false
    };

    selectedImageIndex = 0;
    quantity = 1;
    activeTab = 'info';
    isZoomed = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cartService: CartService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            // In a real app, fetch product by ID
            console.log('Product ID:', id);
        }
    }

    incrementQuantity() {
        this.quantity++;
    }

    decrementQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    setActiveTab(tab: string) {
        this.activeTab = tab;
    }

    formatPrice(price: number): string {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    toggleStatusFilter(key: 'isHot' | 'isSale' | 'inStock'): void {
        this.statusFilters[key] = !this.statusFilters[key];
    }

    clearCategory(): void {
        this.selectedCategory = null;
    }

    clearPrice(): void {
        this.selectedPriceRange = null;
    }

    resetFilters(): void {
        this.selectedCategory = null;
        this.selectedPriceRange = null;
        this.statusFilters = {
            isHot: false,
            isSale: false,
            inStock: false
        };
    }

    searchProducts(): void {
        const queryParams: any = {};

        if (this.selectedCategory) {
            queryParams.category = this.selectedCategory;
        }

        if (this.selectedPriceRange) {
            queryParams.priceRange = this.selectedPriceRange;
        }

        if (this.statusFilters.isHot) queryParams.isHot = true;
        if (this.statusFilters.isSale) queryParams.isSale = true;
        if (this.statusFilters.inStock) queryParams.inStock = true;

        this.router.navigate(['/products'], { queryParams });
    }

    toggleZoom(): void {
        this.isZoomed = !this.isZoomed;
    }

    addToCart() {
        this.cartService.addToCart(this.product, this.quantity);
        this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Sản phẩm đã được thêm vào giỏ hàng',
            life: 3000
        });
    }

    buyNow() {
        this.cartService.addToCart(this.product, this.quantity);
        this.router.navigate(['/cart']);
    }
}
