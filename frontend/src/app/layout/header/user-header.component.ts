import { ChangeDetectorRef, Component, OnInit, OnDestroy, HostListener } from '@angular/core';
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
  
  // Kontrola menija
  menuOpen: boolean = false;      // Mobilni sidebar
  userMenuOpen: boolean = false;  // Desktop dropdown
  
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

  // --- OSLUŠKIVAČ KLIKOVA (Zatvaranje dropdown-a) ---
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Ako korisnik klikne bilo gde van menija, zatvori ga
    this.userMenuOpen = false;
  }

  ngOnInit(): void {
    // Praćenje stanja ulogovanog korisnika
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

    // Praćenje stanja korpe
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

  // --- AKCIJE ---

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // Klik na ime (Desktop Dropdown)
  toggleUserMenu(event: MouseEvent): void {
    event.stopPropagation(); // Sprečava onDocumentClick da odmah zatvori meni
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.cartItemCount = 0;
    this.fullName = '';
    this.menuOpen = false;
    this.userMenuOpen = false; // Resetuj stanje menija pri odjavi
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