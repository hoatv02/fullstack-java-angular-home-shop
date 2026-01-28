import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule],
    template: `
        <div class="text-white bg-[#002b44] text-xs py-2 shadow-sm">
            <div class="px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex justify-between items-center gap-2">
                <div class="flex items-center gap-2 opacity-90 shrink-0">
                    <i class="fa-solid fa-phone text-[14px]"></i>
                    <span class="leading-none hidden sm:inline">Bạn cần giúp đỡ? Gọi cho chúng tôi <span class="font-bold">1900 6680</span></span>
                    <span class="leading-none sm:hidden font-bold">1900 6680</span>
                </div>
                <div class="font-medium text-center hidden md:block truncate px-4">Khuyến mãi mùa hè giảm giá 50%! <a class="font-bold underline ml-1" href="#">Mua ngay</a></div>
                <div class="flex items-center gap-2 cursor-pointer group shrink-0">
                    <img
                        alt="Vietnam Flag"
                        class="rounded-sm"
                        src="https://flagcdn.com/w20/vn.png"
                        width="20"
                    />
                    <span class="opacity-90 leading-none">Tiếng Việt</span>
                    <i class="fa-solid fa-chevron-down text-[10px] opacity-70"></i>
                </div>
            </div>
        </div>
        <header class="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <div class="py-4 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between gap-4">
                <a class="flex items-center gap-2 shrink-0" href="#">
                    <div class="text-primary">
                        <svg fill="none" height="32" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" width="32">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <span class="text-navy-dark font-extrabold text-2xl tracking-tighter uppercase whitespace-nowrap">Home Shop</span>
                </a>
                <nav class="hidden lg:flex items-center gap-8 xl:gap-10">
                    <a class="text-navy-dark hover:text-primary font-bold text-sm tracking-wide transition-colors" href="#">TRANG CHỦ</a>
                    <a class="text-navy-dark hover:text-primary font-bold text-sm tracking-wide transition-colors" href="#">GIỚI THIỆU</a>
                    <div class="relative group cursor-pointer h-full flex items-center">
                        <div class="flex items-center gap-1.5 text-primary font-bold text-sm tracking-wide transition-colors">
                            SẢN PHẨM
                            <i class="fa-solid fa-chevron-down text-[10px]"></i>
                        </div>
                        
                        <!-- Desktop Dropdown -->
                        <div class="absolute top-full left-0 w-64 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <ul class="list-none p-0 m-0 bg-white shadow-xl border border-gray-100 rounded-b-lg py-2">
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Phụ kiện</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Khóa thông minh</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Đèn thông minh</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Hệ thống giám sát</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Thiết bị nghe nhìn</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Gia dụng thông minh</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Điều hòa không khí</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Robot hút bụi</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Cảm biến thông minh</a></li>
                                <li class="last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Cổng tự động</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="relative group cursor-pointer h-full flex items-center">
                        <div class="flex items-center gap-1.5 text-navy-dark hover:text-primary font-bold text-sm tracking-wide transition-colors">
                            KIẾN THỨC
                            <i class="fa-solid fa-chevron-down text-[10px]"></i>
                        </div>
                        <!-- KIẾN THỨC Dropdown -->
                        <div class="absolute top-full left-0 w-60 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <ul class="list-none p-0 m-0 bg-white shadow-xl border border-gray-100 rounded-b-lg py-2">
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Giải pháp nhà thông minh</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Hướng dẫn lắp đặt</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Review sản phẩm</a></li>
                                <li class="last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Câu hỏi thường gặp</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="relative group cursor-pointer h-full flex items-center">
                        <div class="flex items-center gap-1.5 text-navy-dark hover:text-primary font-bold text-sm tracking-wide transition-colors">
                            TIN TỨC
                            <i class="fa-solid fa-chevron-down text-[10px]"></i>
                        </div>
                        <!-- TIN TỨC Dropdown -->
                        <div class="absolute top-full left-0 w-60 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <ul class="list-none p-0 m-0 bg-white shadow-xl border border-gray-100 rounded-b-lg py-2">
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Tin khuyến mại</a></li>
                                <li class="border-b border-gray-50 last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Tin công nghệ</a></li>
                                <li class="last:border-0"><a (click)="isMenuVisible = false" class="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" href="#">Sự kiện Sam Sam Home</a></li>
                            </ul>
                        </div>
                    </div>
                    <a class="text-navy-dark hover:text-primary font-bold text-sm tracking-wide transition-colors" href="#">KHUYẾN MẠI</a>
                    <a class="text-navy-dark hover:text-primary font-bold text-sm tracking-wide transition-colors" href="#">LIÊN HỆ</a>
                </nav>
                <div class="flex items-center gap-2">
                    <div class="flex items-center gap-4 xl:gap-6">
                        <a class="flex items-center gap-2 text-navy-dark hover:text-primary transition-colors" href="#">
                             <i class="fa-solid fa-user text-lg"></i>
                            <span class="hidden xl:inline text-sm font-semibold mt-0.5">Tài khoản</span>
                        </a>
                        <button aria-label="Tìm kiếm" class="text-navy-dark hover:text-primary transition-colors">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                        <button aria-label="Giỏ hàng" class="flex items-center gap-1 text-navy-dark hover:text-primary transition-colors relative">
                            <i class="fa-solid fa-bag-shopping"></i>
                            <span class="text-sm font-bold">(0)</span>
                        </button>
                    </div>
                    <button (click)="isMenuVisible = !isMenuVisible" aria-label="Menu" class="lg:hidden p-2 -mr-2 text-navy-dark">
                        <span class="material-symbols-outlined text-3xl"><i class="fa-solid fa-bars"></i></span>
                    </button>
                </div>
            </div>
        </header>
        
        <!-- Mobile Menu Overlay -->
        <div class="fixed inset-0 z-[60] lg:hidden transition-all duration-300"
             [class.invisible]="!isMenuVisible"
             [class.pointer-events-none]="!isMenuVisible">
            <!-- Backdrop -->
            <div (click)="isMenuVisible = false" 
                 class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                 [class.opacity-100]="isMenuVisible"
                 [class.opacity-0]="!isMenuVisible"></div>
            
            <!-- Menu Content -->
            <div class="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
                 [class.translate-x-0]="isMenuVisible"
                 [class.-translate-x-full]="!isMenuVisible">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                    <span class="text-navy-dark font-extrabold text-xl uppercase tracking-tighter">Menu</span>
                    <button (click)="isMenuVisible = false" class="p-2 text-gray-400 hover:text-navy-dark transition-colors">
                        <i class="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>
                <nav class="flex-1 overflow-y-auto">
                    <ul class="list-none p-0 m-0">
                        <li class="border-b border-gray-100">
                            <a (click)="isMenuVisible = false" class="flex items-center px-6 py-4 text-navy-dark font-bold text-sm tracking-wide hover:bg-gray-50 transition-all" href="#">TRANG CHỦ</a>
                        </li>
                        <li class="border-b border-gray-100">
                            <a (click)="isMenuVisible = false" class="flex items-center px-6 py-4 text-navy-dark font-bold text-sm tracking-wide hover:bg-gray-50 transition-all" href="#">GIỚI THIỆU</a>
                        </li>
                        <li class="border-b border-gray-100">
                            <div class="flex items-center justify-between">
                                <a (click)="isMenuVisible = false" class="flex-1 px-6 py-4 text-primary font-bold text-sm tracking-wide hover:bg-gray-50 transition-all" href="#">SẢN PHẨM</a>
                                <button (click)="productsExpanded = !productsExpanded" class="px-6 py-4 border-l border-gray-100 text-gray-900 hover:bg-gray-50 transition-all">
                                    <i class="fa-solid" [ngClass]="productsExpanded ? 'fa-minus' : 'fa-plus'"></i>
                                </button>
                            </div>
                            <!-- Submenu -->
                            <div class="bg-white overflow-hidden transition-all duration-300" [style.max-height]="productsExpanded ? '500px' : '0'">
                                <ul class="list-none p-0 m-0 border-t border-gray-100">
                                    <li class="border-b border-gray-100"><a (click)='isMenuVisible = false' class='flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all' href='#'>Phụ kiện</a></li>
                                    <li class="border-b border-gray-100"><a (click)='isMenuVisible = false' class='flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all' href='#'>Khóa thông minh</a></li>
                                    <li class="border-b border-gray-100"><a (click)='isMenuVisible = false' class='flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all' href='#'>Đèn thông minh</a></li>
                                    <li class="border-b border-gray-100"><a (click)='isMenuVisible = false' class='flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all' href='#'>Hệ thống giám sát</a></li>
                                    <li class="border-b border-gray-100"><a (click)='isMenuVisible = false' class='flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all' href='#'>Thiết bị nghe nhìn</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Gia dụng thông minh</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Điều hòa không khí</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Robot hút bụi</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Cảm biến thông minh</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Cổng tự động</a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="border-b border-gray-100">
                            <div class="flex items-center justify-between">
                                <a (click)="isMenuVisible = false" class="flex-1 px-6 py-4 text-navy-dark font-bold text-sm tracking-wide hover:bg-gray-50 transition-all" href="#">KIẾN THỨC</a>
                                <button (click)="knowledgeExpanded = !knowledgeExpanded" class="px-6 py-4 border-l border-gray-100 text-gray-900 hover:bg-gray-50 transition-all">
                                    <i class="fa-solid" [ngClass]="knowledgeExpanded ? 'fa-minus' : 'fa-plus'"></i>
                                </button>
                            </div>
                            <div class="bg-white overflow-hidden transition-all duration-300" [style.max-height]="knowledgeExpanded ? '300px' : '0'">
                                <ul class="list-none p-0 m-0 border-t border-gray-100">
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Giải pháp nhà thông minh</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Hướng dẫn lắp đặt</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Review sản phẩm</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Câu hỏi thường gặp</a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="border-b border-gray-100">
                            <div class="flex items-center justify-between">
                                <a (click)="isMenuVisible = false" class="flex-1 px-6 py-4 text-navy-dark font-bold text-sm tracking-wide hover:bg-gray-50 transition-all" href="#">TIN TỨC</a>
                                <button (click)="newsExpanded = !newsExpanded" class="px-6 py-4 border-l border-gray-100 text-gray-900 hover:bg-gray-50 transition-all">
                                    <i class="fa-solid" [ngClass]="newsExpanded ? 'fa-minus' : 'fa-plus'"></i>
                                </button>
                            </div>
                            <div class="bg-white overflow-hidden transition-all duration-300" [style.max-height]="newsExpanded ? '300px' : '0'">
                                <ul class="list-none p-0 m-0 border-t border-gray-100">
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Tin khuyến mại</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Tin công nghệ</a></li>
                                    <li class="border-b border-gray-100"><a (click)="isMenuVisible = false" class="flex items-center px-10 py-3.5 text-gray-600 text-sm hover:bg-gray-50 transition-all" href="#">Sự kiện Sam Sam Home</a></li>
                                </ul>
                            </div>
                        </li>
                        <li class="border-b border-gray-100">
                            <a (click)="isMenuVisible = false" class="flex items-center px-6 py-4 text-navy-dark font-bold text-sm tracking-wide hover:bg-gray-50 transition-all" href="#">KHUYẾN MẠI</a>
                        </li>
                        <li class="border-b border-gray-100">
                            <a (click)="isMenuVisible = false" class="flex items-center px-6 py-4 text-navy-dark font-bold text-sm tracking-wide hover:bg-gray-50 transition-all" href="#">LIÊN HỆ</a>
                        </li>
                    </ul>
                </nav>
                <div class="p-6 bg-gray-50 mt-auto border-t border-gray-100">
                    <div class="flex items-center gap-3 text-navy-dark">
                        <i class="fa-solid fa-phone text-primary"></i>
                        <span class="font-bold">1900 6680</span>
                    </div>
                </div>
            </div>
        </div> `
})
export class AppTopbar {
    isMenuVisible = false;
    productsExpanded = true;
    knowledgeExpanded = false;
    newsExpanded = false;
    constructor(public router: Router) { }
}
