import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToyService } from '../../core/services/toy/toy.service';
import { CartService } from '../../core/services/cart/cart.service';
import { ReservationService } from '../../core/services/reservation/reservation.service';
import { Toy, Review } from '../../model/toy.model';

@Component({
  selector: 'app-toy-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './toy-detail.component.html',
  styleUrls: ['./toy-detail.component.css']
})
export class ToyDetailComponent implements OnInit, OnDestroy {
  toy?: Toy;
  quantity = 0;
  rating = 0;
  comment = '';
  canReview = false;
  checkingReviewPermission = true;
  private cartSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private toyService: ToyService,
    private cartService: CartService,
    private reservationService: ReservationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.toyService.getToyById(id).subscribe({
      next: data => {
        this.toy = data;
        this.loadCartQuantity();
        this.checkIfCanReview();
        this.cdr.detectChanges();
      },
      error: err => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  increase(): void {
    if (this.toy && this.quantity < this.toy.inStock) {
      this.quantity++;
    }
  }

  decrease(): void {
    if (this.quantity > 0) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.toy || this.quantity === 0) return;
    this.cartService.addToCart(this.toy._id, this.quantity).subscribe({
      error: err => console.error(err)
    });
  }

  loadCartQuantity(): void {
    if (!this.toy) return;
    this.cartSub = this.cartService.cart$.subscribe(cart => {
      if (!cart) return;
      const item = cart.items.find(i => i.toyId._id === this.toy!._id);
      this.quantity = item ? item.quantity : 0;
      this.cdr.detectChanges();
    });
  }

  setRating(stars: number): void {
    this.rating = stars;
  }

  submitReview(): void {
    if (!this.toy || !this.canReview || this.rating < 1 || !this.comment) return;

    this.toyService.addReview(this.toy._id, this.rating, this.comment).subscribe({
      next: () => {
        const review: Review = {
          user: 'You',
          userFullName: 'Vi',
          rating: this.rating,
          comment: this.comment,
          createdAt: new Date().toISOString()
        };
        this.toy?.reviews.unshift(review);
        this.rating = 0;
        this.comment = '';
        this.canReview = false;
        this.cdr.detectChanges();
      }
    });
  }

  checkIfCanReview(): void {
    if (!this.toy) return;
    this.reservationService.getMyReservations().subscribe({
      next: res => {
        this.canReview = res.some(r => 
          r.status === 'arrived' && 
          r.items.some(i => i.toy._id === this.toy!._id && !i.reviewed)
        );
        this.checkingReviewPermission = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.canReview = false;
        this.checkingReviewPermission = false;
      }
    });
  }
}