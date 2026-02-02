import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { LoginModalComponent } from './login-modal/login-modal.component';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule, LoginModalComponent, FormsModule],
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
                    <a class="text-navy-dark hover:text-primary font-bold text-sm tracking-wide transition-colors" href="/introduce">GIỚI THIỆU</a>
                    <div class="relative group cursor-pointer h-full flex items-center">
                        <div class="flex items-center gap-1.5 text-primary font-bold text-sm tracking-wide transition-colors"  >
                            <a href="/products">
                                SẢN PHẨM
                            <i class="fa-solid fa-chevron-down text-[10px]"></i>
                            </a>
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
                    <a class="text-navy-dark hover:text-primary font-bold text-sm tracking-wide transition-colors" href="#">LIÊN HỆ</a>
                </nav>
                <div class="flex items-center gap-2">
                    <div class="flex items-center gap-4 xl:gap-6">
                        <a class="flex items-center gap-2 text-navy-dark hover:text-primary transition-colors cursor-pointer" (click)="isLoginModalVisible = true">
                             <i class="fa-solid fa-user text-lg"></i>
                            <span class="hidden xl:inline text-sm font-semibold mt-0.5">Tài khoản</span>
                        </a>
                        <div class="flex items-center gap-2 relative z-[100]">
                            <div [class.w-64]="isSearchExpanded" class="w-0 overflow-hidden transition-all duration-300 ease-out">
                                <input 
                                    #searchInput
                                    type="text" 
                                    [(ngModel)]="searchValue"
                                    placeholder="Tìm kiếm sản phẩm..."  
                                    class="w-full pl-3 pr-2 py-1.5 text-sm border border-slate-200 rounded-full focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none placeholder:text-slate-400 text-slate-600"
                                >
                            </div>
                            <div *ngIf="searchValue" (click)="$event.stopPropagation()" class="absolute top-full left-0 w-80 bg-white shadow-xl border border-gray-100 rounded-lg mt-2 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 origin-top">
                                <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                    <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Sản phẩm gợi ý</span>
                                    <i class="fa-solid fa-lightbulb text-yellow-400 text-xs"></i>
                                </div>
                                
                                <div (click)="$event.stopPropagation()" class="flex gap-4 p-4 hover:bg-blue-50/50 transition-colors group/item border-b border-gray-50 last:border-0 cursor-pointer">
                                    <div class="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                                        <img src="https://images.unsplash.com/photo-1558002038-10917738179d?w=100&q=80" alt="Product" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500">
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h4 class="text-sm font-medium text-navy-dark group-hover/item:text-primary transition-colors truncate mb-1">Robot hút bụi thông minh Xiaomi</h4>
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-2">
                                                <span class="text-xs font-bold text-red-500">5.990.000₫</span>
                                                <span class="text-[10px] text-gray-400 line-through">7.500.000₫</span>
                                            </div>
                                            <button (click)="addToCart($event, {id: 101, name: 'Robot hút bụi thông minh Xiaomi', price: 5990000, image: 'https://images.unsplash.com/photo-1558002038-10917738179d?w=100&q=80'})" class="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center">
                                                <i class="fa-solid fa-plus text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div (click)="$event.stopPropagation()" class="flex gap-4 p-4 hover:bg-blue-50/50 transition-all group/item border-b border-gray-50 last:border-0 cursor-pointer">
                                    <div class="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden relative">
                                        <img src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=100&q=80" alt="Product" class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500">
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h4 class="text-sm font-medium text-navy-dark group-hover/item:text-primary transition-colors truncate mb-1">Khóa cửa vân tay Samsung</h4>
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-2">
                                                <span class="text-xs font-bold text-red-500">3.450.000₫</span>
                                            </div>
                                            <button (click)="addToCart($event, {id: 102, name: 'Khóa cửa vân tay Samsung', price: 3450000, image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=100&q=80'})" class="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center">
                                                <i class="fa-solid fa-plus text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button (click)="isSearchExpanded = false; searchValue = ''; $event.stopPropagation()" class="w-full p-3 text-center text-xs font-bold text-primary hover:bg-blue-50 transition-colors uppercase tracking-wide border-0 bg-transparent cursor-pointer">
                                    Xem tất cả kết quả cho "{{searchValue}}"
                                </button>
                            </div>

                            <button (click)="toggleSearch()" aria-label="Tìm kiếm" class="text-navy-dark hover:text-primary transition-colors cursor-pointer p-1">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                        <button (click)="router.navigate(['/cart'])" aria-label="Giỏ hàng" class="flex items-center gap-1 text-navy-dark hover:text-primary transition-colors relative">
                            <i class="fa-solid fa-bag-shopping text-lg"></i>
                            <span class="text-sm font-bold">({{ (cartService.cartItems$ | async)?.length || 0 }})</span>
                        </button>
                    </div>
                    <button (click)="isMenuVisible = !isMenuVisible" aria-label="Menu" class="lg:hidden p-2 -mr-2 text-navy-dark">
                        <span class="material-symbols-outlined text-3xl"><i class="fa-solid fa-bars"></i></span>
                    </button>
                </div>
            </div>
        </header>
        
        <app-login-modal [(visible)]="isLoginModalVisible"></app-login-modal>

        <div *ngIf="isSearchExpanded" class="fixed inset-0 z-[40]" (click)="isSearchExpanded = false; searchValue = ''"></div>

        <!-- Cart Sidebar Overlay -->
        <div class="fixed inset-0 z-[110] transition-all duration-300"
             [class.invisible]="!isCartVisible"
             [class.pointer-events-none]="!isCartVisible">
            <!-- Backdrop -->
            <div (click)="isCartVisible = false" 
                 class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                 [class.opacity-100]="isCartVisible"
                 [class.opacity-0]="!isCartVisible"></div>
            
            <!-- Cart Content -->
            <div class="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
                 [class.translate-x-0]="isCartVisible"
                 [class.translate-x-full]="!isCartVisible">
                <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <i class="fa-solid fa-bag-shopping text-primary text-xl"></i>
                        <span class="text-navy-dark font-extrabold text-xl uppercase tracking-tighter">Giỏ hàng (0)</span>
                    </div>
                    <button (click)="isCartVisible = false" class="p-2 text-gray-400 hover:text-navy-dark transition-colors">
                        <i class="fa-solid fa-xmark text-2xl"></i>
                    </button>
                </div>
                
                <div class="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                    <div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <i class="fa-solid fa-cart-shopping text-gray-200 text-4xl"></i>
                    </div>
                    <h3 class="text-navy-dark font-bold text-lg mb-2">Giỏ hàng của bạn đang trống</h3>
                    <p class="text-gray-500 text-sm mb-8">Hãy thêm những sản phẩm tuyệt vời vào giỏ hàng ngay nhé!</p>
                    <button (click)="isCartVisible = false" class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        TIẾP TỤC MUA SẮM
                        <i class="fa-solid fa-arrow-right text-sm"></i>
                    </button>
                </div>

                <!-- Footer mock (if items existed) -->
                <div class="p-6 border-t border-gray-100 bg-white">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-gray-500 font-medium">Tổng tiền:</span>
                        <span class="text-xl font-extrabold text-red-500">0₫</span>
                    </div>
                </div>
            </div>
        </div>

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
                            <a (click)="isMenuVisible = false" class="flex items-center px-6 py-4 text-navy-dark font-bold text-sm tracking-wide hover:bg-gray-50 transition-all" href="/introduce">GIỚI THIỆU</a>
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
    @ViewChild('searchInput') searchInput!: ElementRef;
    isMenuVisible = false;
    isCartVisible = false;
    isSearchExpanded = false;
    isLoginModalVisible = false;
    productsExpanded = true;
    knowledgeExpanded = false;
    newsExpanded = false;
    searchValue: string = '';

    toggleSearch() {
        this.isSearchExpanded = !this.isSearchExpanded;
        if (this.isSearchExpanded) {
            setTimeout(() => this.searchInput.nativeElement.focus(), 100);
        } else {
            this.searchValue = '';
        }
    }

    addToCart(event: Event, product: any) {
        event.stopPropagation();
        this.cartService.addToCart(product, 1);
        console.log('Added to cart:', product.name);
    }

    constructor(public router: Router, public cartService: CartService) { }

    @HostListener('window:resize')
    onResize() {
        this.searchValue = '';
    }
}
