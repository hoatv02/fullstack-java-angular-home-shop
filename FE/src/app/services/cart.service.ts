import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
    id: number;
    name: string;
    price: number | null;
    image: string;
    quantity: number;
    discount?: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems = new BehaviorSubject<CartItem[]>([]);
    cartItems$ = this.cartItems.asObservable();

    constructor() {
        const savedCart = localStorage.getItem('home_shop_cart');
        if (savedCart) {
            this.cartItems.next(JSON.parse(savedCart));
        }
    }

    addToCart(product: any, quantity: number = 1) {
        const currentItems = this.cartItems.value;
        const existingItemIndex = currentItems.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            currentItems[existingItemIndex].quantity += quantity;
        } else {
            currentItems.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image || product.images?.[0],
                quantity: quantity,
                discount: product.discount
            });
        }

        this.updateCart(currentItems);
    }

    removeFromCart(productId: number) {
        const currentItems = this.cartItems.value.filter(item => item.id !== productId);
        this.updateCart(currentItems);
    }

    updateQuantity(productId: number, quantity: number) {
        const currentItems = this.cartItems.value;
        const itemIndex = currentItems.findIndex(item => item.id === productId);

        if (itemIndex > -1) {
            currentItems[itemIndex].quantity = quantity;
            if (currentItems[itemIndex].quantity <= 0) {
                currentItems.splice(itemIndex, 1);
            }
        }

        this.updateCart(currentItems);
    }

    clearCart() {
        this.updateCart([]);
    }

    getCartItems(): CartItem[] {
        return this.cartItems.value;
    }

    getTotalPrice(): number {
        return this.cartItems.value.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
    }

    getCartCount(): Observable<number> {
        return new Observable<number>(observer => {
            this.cartItems$.subscribe(items => {
                const count = items.reduce((acc, item) => acc + item.quantity, 0);
                observer.next(count);
            });
        });
    }

    getCartTotal(): Observable<number> {
        return new Observable<number>(observer => {
            this.cartItems$.subscribe(items => {
                const total = items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0);
                observer.next(total);
            });
        });
    }

    private updateCart(items: CartItem[]) {
        this.cartItems.next([...items]);
        localStorage.setItem('home_shop_cart', JSON.stringify(items));
    }
}
