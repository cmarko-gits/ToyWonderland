import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { ReservationService } from '../../core/services/reservation/reservation.service';
import { Cart, CartItem } from '../../model/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart$!: Observable<Cart | null>;
  loading = false;

  constructor(
    private cartService: CartService,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.cartService.getCart();
  }

 increase(item: CartItem) {
  this.cartService.changeQuantity(item.toyId?._id!, 1).subscribe({
    error: (err) => console.error('Greška pri povećanju količine:', err)
  });
}

decrease(item: CartItem) {
  if (item.quantity <= 1) {
    this.removeItem(item.toyId?._id!);
    return;
  }
  this.cartService.changeQuantity(item.toyId?._id!, -1).subscribe({
    error: (err) => console.error('Greška pri smanjenju količine:', err)
  });
}

  removeItem(toyId: string) {
    this.cartService.removeItem(toyId);
  }

  getTotal(cart: Cart | null): number {
    if (!cart) return 0;
    return cart.items.reduce(
      (sum, item) => sum + item.priceAtTheMoment * item.quantity,
      0
    );
  }

  checkout() {
    if (this.loading) return;
    this.loading = true;

    this.reservationService.createReservation().subscribe({
      next: () => {
        this.cartService.getCart();
        this.loading = false;
      },
      error: err => {
        console.error(err.error?.msg || 'Reservation failed');
        this.loading = false;
      }
    });
  }
}
