import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cart } from '../../../model/cart.model';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private api: ApiService) {}

  addToCart(toyId: string, quantity: number = 1): Observable<Cart> {
    return this.api.post<Cart>('cart/add', { toyId, quantity }, true).pipe(
      tap(cart => {
        this.cartSubject.next(cart);
      })
    );
  }

  getCart(): void {
    this.api.get<Cart>('cart', true).subscribe({
      next: (cart) => {
        if (cart) {
          this.cartSubject.next(cart);
        }
      },
      error: (err) => {
        console.error("Greška pri učitavanju korpe:", err);
        if (err.status === 401) {
          this.cartSubject.next(null);
        }
      }
    });
  }

  changeQuantity(toyId: string, change: number): Observable<Cart> {
    return this.api.put<Cart>(`cart/quantity/${toyId}`, { change }, true).pipe(
      tap((updatedCart) => {
        this.cartSubject.next(updatedCart);
      })
    );
  }

  removeItem(toyId?: string): void {
    if (!toyId) return;
    this.api.delete<Cart>(`cart/${toyId}`, true).subscribe({
      next: (cart) => {
        if (cart) {
          this.cartSubject.next(cart);
        }
      },
      error: (err) => console.error(err)
    });
  }

  getTotalPrice(cart: Cart | null): number {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + (item.priceAtTheMoment * item.quantity), 0);
  }
}