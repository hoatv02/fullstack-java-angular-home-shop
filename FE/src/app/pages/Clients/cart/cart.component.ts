import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
    cartItems$: Observable<CartItem[]>;
    cartTotal$: Observable<number>;
    cartCount$: Observable<number>;

    constructor(public cartService: CartService) {
        this.cartItems$ = this.cartService.cartItems$;
        this.cartTotal$ = this.cartService.getCartTotal();
        this.cartCount$ = this.cartService.getCartCount();
    }

    ngOnInit(): void {
        window.scrollTo(0, 0);
    }

    incrementQuantity(item: CartItem) {
        this.cartService.updateQuantity(item.id, item.quantity + 1);
    }

    decrementQuantity(item: CartItem) {
        if (item.quantity > 1) {
            this.cartService.updateQuantity(item.id, item.quantity - 1);
        } else {
            this.removeItem(item.id);
        }
    }

    removeItem(productId: number) {
        this.cartService.removeFromCart(productId);
    }

    formatPrice(price: number): string {
        return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    }
}
