import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

interface Product {
    id: number;
    name: string;
    price: number | null; // null for 'Liên hệ'
    originalPrice?: number;
    discount?: number;
    image: string;
    isHot?: boolean;
}

interface Category {
    id: number;
    name: string;
    count: number;
}

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent {
    categories: Category[] = [
        { id: 1, name: 'Phụ kiện', count: 7 },
        { id: 2, name: 'Khóa thông minh', count: 4 },
        { id: 3, name: 'Đèn thông minh', count: 2 },
        { id: 4, name: 'Hệ thống giám sát', count: 8 },
        { id: 5, name: 'Thiết bị nghe nhìn', count: 9 },
        { id: 6, name: 'Gia dụng thông minh', count: 23 },
        { id: 7, name: 'Điều hòa không khí', count: 4 },
    ];

    products: Product[] = [
        {
            id: 1,
            name: 'Máy lọc không khí nhỏ gọn',
            price: 3500000,
            originalPrice: 4000000,
            discount: 12,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3zIH6eG9Rb7CalwXQ72S-zSOAmPnCJC934EAJgbbgv63Uf9Vg5rKCeNSQgcShTzx4-Ohvx8E8qK_5lFAfkrz-kSZ5yz2nIzjYJ2rRGNgfk20Z9rakfs2a1LCmERXaxJ5BGv8hw9PRT4R5l-1jsJxhLYYjF9y-JZB6MGfVuMW3ih8qNUo8FOTi9KdUPMFtEIrWxCgEPP8y3PtdszZ_G2HOGAJLa-K_WsJ0WgGY-DvcejKqW1CCFrP3Tshi4eqF_aNDJzzin5x4cUg'
        },
        {
            id: 2,
            name: 'Bóng đèn Philips Hue White Ambiance',
            price: 4000000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGNAeqenS_2flZDBidRkgvh4a81fAYXoOVksSMT9ul5yFntNO85a97aPmOaFvko7hbt1ePQG9Kb5ZqNuEN_tC23Edv3jN7D0df0CKEJh2bOGfAtaBn04wme6HKJLfccGMe6W1_wd7elbWmJtj0PuMMEYBKKgnCvQDMwPsYureO3yP1EDTNJGouCjcpEdtNMHV94bD9Or_VVGz6pD-u1fxFHDEPhnkquENxp062qdFKQ32TFJIY8gc6-0vQ2ssQkZ9CEi4hzDm25c'
        },
        {
            id: 3,
            name: 'Khóa cửa vân tay Samsung SHP-DP609',
            price: 4000000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABdw1hvRaikmCYKTRL-QoDusckGl7lxHksFCIMttgF4kWtisBYsPDpq_79aIFpVc2Nf65gEqyNmtlNVqkfvEej2ekLzgha2CtuzN4OdiJrY2MNY0xy3znO41TMkU0XxFfF78RhcMVmU30k02Ebf1yMuwM_icbTxeSi2ihJMLrqTtw2yz_2qhhxL-83P_6sy8JvqvzyZZjkhTJnHzfn_hXiNkNpTEyX_dJPSUGr5lqARx5ew8gV3YCcPHr__XGow9EkX2EdjsT-viQ'
        },
        {
            id: 4,
            name: 'Bộ điều nhiệt thông minh',
            price: null,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3zIH6eG9Rb7CalwXQ72S-zSOAmPnCJC934EAJgbbgv63Uf9Vg5rKCeNSQgcShTzx4-Ohvx8E8qK_5lFAfkrz-kSZ5yz2nIzjYJ2rRGNgfk20Z9rakfs2a1LCmERXaxJ5BGv8hw9PRT4R5l-1jsJxhLYYjF9y-JZB6MGfVuMW3ih8qNUo8FOTi9KdUPMFtEIrWxCgEPP8y3PtdszZ_G2HOGAJLa-K_WsJ0WgGY-DvcejKqW1CCFrP3Tshi4eqF_aNDJzzin5x4cUg' // Reuse image for now
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
        },
        {
            id: 7,
            name: 'Máy lọc không khí Xiaomi Mi Air Purifier 3H',
            price: 3000000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3zIH6eG9Rb7CalwXQ72S-zSOAmPnCJC934EAJgbbgv63Uf9Vg5rKCeNSQgcShTzx4-Ohvx8E8qK_5lFAfkrz-kSZ5yz2nIzjYJ2rRGNgfk20Z9rakfs2a1LCmERXaxJ5BGv8hw9PRT4R5l-1jsJxhLYYjF9y-JZB6MGfVuMW3ih8qNUo8FOTi9KdUPMFtEIrWxCgEPP8y3PtdszZ_G2HOGAJLa-K_WsJ0WgGY-DvcejKqW1CCFrP3Tshi4eqF_aNDJzzin5x4cUg'
        },
        {
            id: 8,
            name: 'Thiết Bị Báo Cháy Cảm Biến Khói',
            price: 3000000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGNAeqenS_2flZDBidRkgvh4a81fAYXoOVksSMT9ul5yFntNO85a97aPmOaFvko7hbt1ePQG9Kb5ZqNuEN_tC23Edv3jN7D0df0CKEJh2bOGfAtaBn04wme6HKJLfccGMe6W1_wd7elbWmJtj0PuMMEYBKKgnCvQDMwPsYureO3yP1EDTNJGouCjcpEdtNMHV94bD9Or_VVGz6pD-u1fxFHDEPhnkquENxp062qdFKQ32TFJIY8gc6-0vQ2ssQkZ9CEi4hzDm25c'
        },
        // Row 3 (just duplicate some for grid demo)
        {
            id: 9,
            name: 'Máy chiếu Samsung The Freestyle',
            price: 3000000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABdw1hvRaikmCYKTRL-QoDusckGl7lxHksFCIMttgF4kWtisBYsPDpq_79aIFpVc2Nf65gEqyNmtlNVqkfvEej2ekLzgha2CtuzN4OdiJrY2MNY0xy3znO41TMkU0XxFfF78RhcMVmU30k02Ebf1yMuwM_icbTxeSi2ihJMLrqTtw2yz_2qhhxL-83P_6sy8JvqvzyZZjkhTJnHzfn_hXiNkNpTEyX_dJPSUGr5lqARx5ew8gV3YCcPHr__XGow9EkX2EdjsT-viQ'
        },
        {
            id: 10,
            name: 'Máy Lọc Không Khí ARIZE Lifestyle',
            price: 3000000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3zIH6eG9Rb7CalwXQ72S-zSOAmPnCJC934EAJgbbgv63Uf9Vg5rKCeNSQgcShTzx4-Ohvx8E8qK_5lFAfkrz-kSZ5yz2nIzjYJ2rRGNgfk20Z9rakfs2a1LCmERXaxJ5BGv8hw9PRT4R5l-1jsJxhLYYjF9y-JZB6MGfVuMW3ih8qNUo8FOTi9KdUPMFtEIrWxCgEPP8y3PtdszZ_G2HOGAJLa-K_WsJ0WgGY-DvcejKqW1CCFrP3Tshi4eqF_aNDJzzin5x4cUg'
        },
        {
            id: 11,
            name: 'Lọc không khí ô tô',
            price: 3000000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmGNAeqenS_2flZDBidRkgvh4a81fAYXoOVksSMT9ul5yFntNO85a97aPmOaFvko7hbt1ePQG9Kb5ZqNuEN_tC23Edv3jN7D0df0CKEJh2bOGfAtaBn04wme6HKJLfccGMe6W1_wd7elbWmJtj0PuMMEYBKKgnCvQDMwPsYureO3yP1EDTNJGouCjcpEdtNMHV94bD9Or_VVGz6pD-u1fxFHDEPhnkquENxp062qdFKQ32TFJIY8gc6-0vQ2ssQkZ9CEi4hzDm25c'
        },
        {
            id: 12,
            name: 'Khoá Cửa Thông Minh Aqara A100',
            price: 600000,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABdw1hvRaikmCYKTRL-QoDusckGl7lxHksFCIMttgF4kWtisBYsPDpq_79aIFpVc2Nf65gEqyNmtlNVqkfvEej2ekLzgha2CtuzN4OdiJrY2MNY0xy3znO41TMkU0XxFfF78RhcMVmU30k02Ebf1yMuwM_icbTxeSi2ihJMLrqTtw2yz_2qhhxL-83P_6sy8JvqvzyZZjkhTJnHzfn_hXiNkNpTEyX_dJPSUGr5lqARx5ew8gV3YCcPHr__XGow9EkX2EdjsT-viQ'
        }
    ];

    selectedCategory: number | null = null;
    selectedPriceRange: string | null = null;
    itemsPerPage: number = 12;

    // Sort Dropdown State
    isSortDropdownOpen: boolean = false;
    currentSort: string = 'Sắp xếp';
    sortOptions: string[] = ['Sắp xếp theo tên', 'Giá từ thấp đến cao', 'Giá từ cao đến thấp'];

    // Status Filter State
    statusFilters = {
        isHot: false,
        isSale: false,
        inStock: false
    };

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            if (params['category']) {
                this.selectedCategory = Number(params['category']);
            }
            if (params['priceRange']) {
                this.selectedPriceRange = params['priceRange'];
            }
            if (params['isHot']) {
                this.statusFilters.isHot = params['isHot'] === 'true' || params['isHot'] === true;
            }
            if (params['isSale']) {
                this.statusFilters.isSale = params['isSale'] === 'true' || params['isSale'] === true;
            }
            if (params['inStock']) {
                this.statusFilters.inStock = params['inStock'] === 'true' || params['inStock'] === true;
            }
        });
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

    clearStatus(): void {
        this.statusFilters = {
            isHot: false,
            isSale: false,
            inStock: false
        };
    }

    toggleSortDropdown(event: Event): void {
        event.stopPropagation();
        this.isSortDropdownOpen = !this.isSortDropdownOpen;
    }

    selectSort(option: string): void {
        this.currentSort = option;
        this.isSortDropdownOpen = false;
    }

    formatPrice(price: number): string {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }


}
