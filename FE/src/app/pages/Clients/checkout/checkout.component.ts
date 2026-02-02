import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface ShippingInfo {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    note: string;
}

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ToastModule],
    providers: [MessageService],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
    cartItems: any[] = [];
    shippingInfo: ShippingInfo = {
        fullName: '',
        phone: '',
        email: '',
        address: '',
        note: ''
    };
    paymentMethod: string = 'cod';

    constructor(
        private cartService: CartService,
        private router: Router,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.cartItems = this.cartService.getCartItems();
        if (this.cartItems.length === 0) {
            this.router.navigate(['/cart']);
        }
    }

    getSubtotal(): number {
        return this.cartService.getTotalPrice();
    }

    getShippingCost(): number {
        return this.getSubtotal() > 5000000 ? 0 : 30000;
    }

    getTotal(): number {
        return this.getSubtotal() + this.getShippingCost();
    }

    formatPrice(price: number): string {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }

    placeOrder(): void {
        if (!this.shippingInfo.fullName || !this.shippingInfo.phone || !this.shippingInfo.address) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng điền đầy đủ thông tin giao hàng',
                life: 3000
            });
            return;
        }

        // Mock Order Placement
        this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đơn hàng của bạn đã được tiếp nhận',
            life: 3000
        });

        setTimeout(() => {
            this.cartService.clearCart();
            this.router.navigate(['/']);
        }, 2000);
    }
}
