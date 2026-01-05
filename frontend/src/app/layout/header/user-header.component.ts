import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart/cart.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../core/services/ThemeService.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  fullName: string = '';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  menuOpen: boolean = false;
  cartItemCount: number = 0;

  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    public themeService: ThemeService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.currentUser$.subscribe({
        next: (user) => {
          this.fullName = user?.fullName || '';
          this.isAdmin = user?.is_admin === 1;
          this.isLoggedIn = !!user;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      })
    );

    this.subscriptions.add(
      this.cartService.cart$.subscribe({
        next: (cart) => {
          this.cartItemCount = cart?.items.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      })
    );
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.cartItemCount = 0;
    this.fullName = '';
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
    this.menuOpen = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}