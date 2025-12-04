import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  fullname: string = '';
  loggedIn: boolean = false;
  isAdmin: boolean = false;
  menuOpen: boolean = false;
  cartItemCount: number = 0;

  private subscriptions = new Subscription(); // ❗ ovde kreiramo, ne u konstruktoru

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.currentUser$.subscribe(user => {
        this.fullname = user?.fullName || '';
        this.isAdmin = user?.is_admin === 1;
        this.loggedIn = !!user;
        this.cdr.detectChanges();
      })
    );

    this.subscriptions.add(
      this.cartService.cart$.subscribe(cart => {
        this.cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
        this.cdr.detectChanges();
      })
    );
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.loggedIn = false;
    this.isAdmin = false;
    this.cartItemCount = 0;
    this.fullname = '';
    this.router.navigate(['/']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // oslobađamo sve pretplate
  }
}
