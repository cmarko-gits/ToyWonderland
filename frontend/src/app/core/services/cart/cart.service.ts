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
    return this.api.post<Cart>('cart/add', { toyId, quantity }).pipe(
      tap(cart => {
        // update BehaviorSubject-a za instant refresh UI-a
        this.cartSubject.next({
          ...cart,
          items: cart.items.map(i => ({ ...i, toyId: { ...i.toyId } }))
        });
      })
    );
  }

  getCart(): void {
    this.api.get<Cart>('cart', true)
      .pipe(
        tap((cart: Cart | null) => {
          if (!cart) return;
          this.cartSubject.next(cart);
        })
      )
      .subscribe();
  }
changeQuantity(toyId: string, change: number) {
  return this.api.put<Cart>(`cart/quantity/${toyId}`, { change })
    .pipe(
      tap((updatedCart) => {
        this.cartSubject.next(updatedCart);  // <<< ISPRAVNO!
      })
    )
    .subscribe();
}



removeItem(toyId?: string): void {
  if (!toyId) return;
  this.api.delete<Cart>(`cart/${toyId}`)
    .pipe(
      tap((cart: Cart | null) => {
        if (!cart) return;

        const updatedCart: Cart = {
          ...cart,
          items: [...cart.items]  
        };

        this.cartSubject.next(updatedCart);
      })
    )
    .subscribe();
}

  getTotalPrice(cart: Cart | null): number {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.priceAtTheMoment * item.quantity, 0);
  }

  

}
