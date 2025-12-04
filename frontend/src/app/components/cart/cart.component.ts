import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { Cart } from '../../model/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart$!: Observable<Cart | null>;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // poveži cart$ na BehaviorSubject iz servisa
    this.cart$ = this.cartService.cart$;

    // inicijalno učitaj korpu sa servera
    this.cartService.getCart();
  }

  increase(item: any) {
  this.cartService.changeQuantity(item.toyId._id, +1)
}

decrease(item: any) {
  this.cartService.changeQuantity(item.toyId._id, -1);
}


  getTotal(cart: Cart | null): number {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + item.priceAtTheMoment * item.quantity, 0);
  }

  removeItem(toyId?: string) {
    if (!toyId) return;
    this.cartService.removeItem(toyId);
  }
}
